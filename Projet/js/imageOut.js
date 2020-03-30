/**
* System to get an image and place strategics point
*
* @author Lazlo_Barragan
* @author Romain_Saclier
*/


//Canvas Out
let canvasOut = document.getElementById('canvasOut');
let ctxOut = canvasOut.getContext('2d');

let ImageInData;

let outKeyPoints = [];


/**
* Draw canvas' out context
* @param {Boolean} debug draw polygon points
*/
function DrawOutContext(debug = false) {


  //Draw Image
  if (USER_DATAS.ImageIn) {
    ImageInData = getImageData(ctxOut, USER_DATAS.ImageIn);
    let ImageOutData;

    let scaleMatrix = matrixScale(USER_DATAS.scale);
    let rotateMatrix = matrixRotation(degrees_to_radians(USER_DATAS.rotation));
    let finalMatrix;
    let invertMatrix;
    let w,h;
    outKeyPoints = [];
    let newCenter;
    if(USER_DATAS.global){

      let height_imageIn = ImageInData.height;
      let width_imageIn = ImageInData.width;

      let translatetocenterMatrix = matrixTranslate(new Vector2(- width_imageIn / 2, - height_imageIn / 2));
      let translatebackMatrix = matrixTranslate(new Vector2(width_imageIn / 2, height_imageIn / 2));
      finalMatrix = Matrix.mult(translatebackMatrix, rotateMatrix, scaleMatrix, translatetocenterMatrix);

      //calculate height and width of the image after transformation
      let x0 = linearTransformationPoint(new Point(0,0), finalMatrix);
      let x1 = linearTransformationPoint(new Point(width_imageIn-1, 0), finalMatrix);
      let x2 = linearTransformationPoint(new Point(width_imageIn-1, height_imageIn-1), finalMatrix);
      let x3 = linearTransformationPoint(new Point(0, height_imageIn-1), finalMatrix);
      //round
      // x0 = roundPoint(x0);
      // x1 = roundPoint(x1);
      // x2 = roundPoint(x2);
      // x3 = roundPoint(x3);
      let minMax = new MinMaxVector2();
      minMax.addValue(x0);
      minMax.addValue(x1);
      minMax.addValue(x2);
      minMax.addValue(x3);

      console.log(minMax.minPos);
      let translateCorrection = matrixTranslate(new Vector2(- minMax.minPos.x, - minMax.minPos.y));
      console.log(translateCorrection);
      finalMatrix = Matrix.mult(translateCorrection, finalMatrix);
      invertMatrix = Matrix.invert(finalMatrix);
      // x0 = linearTransformationPoint(x0, translateCorrection);
      // x1 = linearTransformationPoint(x1, translateCorrection);
      // x2 = linearTransformationPoint(x2, translateCorrection);
      // x3 = linearTransformationPoint(x3, translateCorrection);
      x0 = linearTransformationPoint(new Point(0,0), finalMatrix);
      x1 = linearTransformationPoint(new Point(width_imageIn, 0), finalMatrix);
      x2 = linearTransformationPoint(new Point(width_imageIn, height_imageIn), finalMatrix);
      x3 = linearTransformationPoint(new Point(0, height_imageIn), finalMatrix);
      console.log(finalMatrix);

      h = 1 + minMax.maxPos.y - minMax.minPos.y;
      w = 1 + minMax.maxPos.x - minMax.minPos.x;
      console.log(w, h);
      // console.log(minMax);

      //Set extremum points polygone
      outKeyPoints = [x0,x1,x2,x3];
      console.log(outKeyPoints);
      newCenter = linearTransformationPoint(center, finalMatrix);
    }else{
      w = ImageInData.width;
      h = ImageInData.height;

      let translatetocenterMatrix = matrixTranslate(new Vector2(-center.x, -center.y));
      let translatebackMatrix = matrixTranslate(center);
      let translateMatrix = matrixTranslate(USER_DATAS.translate);
      finalMatrix = Matrix.mult(translateMatrix, translatebackMatrix, rotateMatrix, scaleMatrix, translatetocenterMatrix);
      invertMatrix = Matrix.invert(finalMatrix);
      //Application de la transformation
      newCenter = linearTransformationPoint(center, finalMatrix);
      for (let i = 0; i < keyPoints.length; i++) {
        outKeyPoints[i] = linearTransformationPoint(keyPoints[i], finalMatrix);
      }
    }
    console.log("invertMatrix", invertMatrix);
    setContextSize(ctxOut, w, h);
    switch(USER_DATAS.interporlationType){
      case "NearestNeighbor" :
        ImageOutData = NearestNeighbor(ctxOut, ImageInData, outKeyPoints, invertMatrix);
        break;
      case "Bilinear" :
        ImageOutData = Bilinear(ctxOut, ImageInData, outKeyPoints, invertMatrix);
        break;
      case "Bicubic" :
        ImageOutData = Bicubic(ctxOut, ImageInData, outKeyPoints, invertMatrix);
        break;
    }
    drawDefaultBackground(ctxOut);
    console.log("data[0]",ImageOutData.data[0]);
    ctxOut.putImageData(ImageOutData, 0, 0);
    //Draw Points
    if (debug) {
      drawKeysPoints(outKeyPoints, ctxOut);
      drawCross(newCenter, ctxOut);
    }
  } else {
    drawDefaultBackground(ctxOut);
  }
}
/**
* set every pixel of imgData to black with alpha 255 (0,0,0,255)
* @param {ImageData} imgData
*/
function clear(imgData) {
  let w = imgData.width;
  let h = imgData.height;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let pos = x * 4 + y * w * 4;
      imgData.data[pos + 0] = 0;
      imgData.data[pos + 1] = 0;
      imgData.data[pos + 2] = 0;
      imgData.data[pos + 3] = 255;
    }
  }
}

// 1. on a une image & un polygone ( list de points )
// 2. on applique une matrice de transformation à tous les points du polygone
// 3. on appelle polygonImageMatrix
//      1. ça va prendre tous les pixels qui sont dans le polygone ( transformé par la matrice )
/**
*
* @param {Context} ctx le context dans lequel on crée la nouvelle image
* @param {ImageData} imgData l'image data de l'image d'origine
* @param {Polygon} polygon le polygone transformé
* @param {Matrix} invertMatrix la matrice inverce de la transformation qu'à reçu le polygone
*
* @returns {ImageData} newImgData la nouvelle image data
*/
function NearestNeighbor(ctx, imgData, polygon, invertMatrix) {
  let w = imgData.width;
  let h = imgData.height;
  let w_out = ctx.canvas.width;
  let h_out = ctx.canvas.height;

  let newImgData = ctx.createImageData(w_out, h_out);
  for (let y = 0; y < h_out; y++) {
    for (let x = 0; x < w_out; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w_out * 4;

      if (!insidePolygon(Point(x, y), polygon)&& !USER_DATAS.global) {
        for (let i = 0; i < 4; i++) {
          if(USER_DATAS.global) newImgData.data[newPos + i] = 255;
          else newImgData.data[newPos + i] = imgData.data[newPos + i];
        }
        continue;
      }
      //position exacte du point après transformation inverse
      let floatingPos = linearTransformationPoint(Point(x, y), invertMatrix);
      if(x == 0 && y ==  0 ) console.log("floatingPos 0,0 : ",floatingPos);
      if( x == w_out - 1 && y == h_out - 1)console.log("floatingPos w-1,h-1 : ",floatingPos);
      //position arrondi "au plus proche" après transformation inverse
      let roundedPos = { x: Math.floor(floatingPos.x), y: Math.floor(floatingPos.y)} ;
      if(x == 0 && y ==  0 ) console.log("roundedPos 0,0 : ",roundedPos);
      if( x == w_out - 1 && y == h_out - 1)console.log("roundedPos w-1,h-1 : ",roundedPos);

      let pixelroundedPos= roundedPos.y * w * 4 + roundedPos.x *4;
      for (let i = 0; i < 4; i++) {
        newImgData.data[newPos + i] = imgData.data[pixelroundedPos + i];
        if(x == 0 && y ==  0 || x == w_out - 1 && y == h_out - 1){
          //console.log(pixelroundedPos + i, imgData.data[pixelroundedPos + i]);
        }
      }
    }
  }

  return newImgData;
}

/**
*
* @param {Context} ctx le context dans lequel on crée la nouvelle image
* @param {ImageData} imgData l'image data de l'image d'origine
* @param {Polygon} polygon le polygone transformé
* @param {Matrix} invertMatrix la matrice inverce de la transformation qu'à reçu le polygone
*
* @returns {ImageData} la nouvelle image data
*/
function Bilinear(ctx, imgData, polygon, invertMatrix) {
  let w = imgData.width;
  let h = imgData.height;
  let w_out = ctx.canvas.width;
  let h_out = ctx.canvas.height;
  let newImgData = ctx.createImageData(w_out, h_out);

  for (let y = 0; y < h_out; y++) {
    for (let x = 0; x < w_out; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w_out * 4;

      if (!insidePolygon(Point(x, y), polygon) && !USER_DATAS.global ) {
        for (let i = 0; i < 4; i++) {
          if(USER_DATAS.global) newImgData.data[newPos + i] = 255;
          else newImgData.data[newPos + i] = imgData.data[newPos + i];
        }
        continue;
      }
      //position exacte du point après transformation inverse
      let floatingPos = linearTransformationPoint(Point(x, y), invertMatrix);
      //position arrondi "au plus proche" après transformation inverse
      let i = Math.floor(floatingPos.x);
      let j = Math.floor(floatingPos.y);
      let t = floatingPos.x - i; //Horizontal Distance with i
      let u = floatingPos.y - j; //Vertical Distance with j
      if( x == 0 && y == 0)console.log("floatingPos 0,0 : ",floatingPos);
      if( x == 0 && y == 0)console.log("i,j 0,0 : ",i,j);
      //Loop for RGBA
      let va=0,vb=0;
      for (let k = 0; k < 4; k++) {
        va=(1 - u) * imgData.data[(j*w + i)*4 + k];
        vb=va;
        if(j<h-1){
          va=addFloat(va, u * imgData.data[((j+1)*w + i)*4 + k]);
        }
        if(i<w-1){
          vb=(1 - u) * imgData.data[(j*w + i+1)*4 + k];
        }
        if(j<h-1 && i<w-1){
          vb=addFloat(vb, u * imgData.data[((j+1)*w + i+1)*4 + k ]);
        }
        newImgData.data[newPos + k] = addFloat( (1-t) * va, t *vb);
      }
    }
  }

  return newImgData;
}


/**
*
* @param {Context} ctx le context dans lequel on crée la nouvelle image
* @param {ImageData} imgData l'image data de l'image d'origine
* @param {Polygon} polygon le polygone transformé
* @param {Matrix} invertMatrix la matrice inverce de la transformation qu'à reçu le polygone
*
* @returns {ImageData} la nouvelle image data
*/
function Bicubic(ctx, imgData, polygon, invertMatrix) {
  let w = imgData.width;
  let h = imgData.height;
  let w_out = ctx.canvas.width;
  let h_out = ctx.canvas.height;
  let newImgData = ctx.createImageData(w_out, h_out);

  for (let y = 0; y < h_out; y++) {
    for (let x = 0; x < w_out; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w_out * 4;

      if (!insidePolygon(Point(x, y), polygon) && !USER_DATAS.global ) {
        for (let i = 0; i < 4; i++) {
          if(USER_DATAS.global) newImgData.data[newPos + i] = 255;
          else newImgData.data[newPos + i] = imgData.data[newPos + i];
        }
        continue;
      }
      //position exacte du point après transformation inverse
      let floatingPos = linearTransformationPoint(Point(x, y), invertMatrix);

      // 1. On calcule les 16 voisins
      let pos = new Point(Math.floor(floatingPos.x), Math.floor(floatingPos.y));

      const Neighbor = [];

      for(let i = 0; i < 4; i++ ){
        Neighbor[i] = [];
        for(let j = 0; j < 4; j++ ){
          const p = new Point(pos.x -1  + i,pos.y -1 + j);
          //On merge les valeurs en dehors de la taille de l'image
          if(p.x <0){ p.x = 0; }
          if(p.y <0){ p.y = 0; }
          if(p.x>=w){ p.x=w-1; }
          if(p.y>=h){ p.y=h-1; }
          Neighbor[i][j]=p;
        }
      }

      // Pour chaques valeurs de RGBA
      for (let k = 0; k < 4; k++) {

        // 2. On calcule les 4 courbes cubiques
        let curves = [];
        for(let i=0;i<4;i++){
          let p1= new Point(pos.y - 1, imgData.data[4*Neighbor[i][0].x + 4*Neighbor[i][0].y *w +k]);
          let p2= new Point(pos.y - 0, imgData.data[4*Neighbor[i][1].x + 4*Neighbor[i][1].y *w +k]);
          let p3= new Point(pos.y + 1, imgData.data[4*Neighbor[i][2].x + 4*Neighbor[i][2].y *w +k]);
          let p4= new Point(pos.y + 2, imgData.data[4*Neighbor[i][3].x + 4*Neighbor[i][3].y *w +k]);
          curves[i]=cubic(p1,p2,p3,p4);
        }
        // 3. On calcule la nouvelle courbe cubique associé aux 4 points des courbes précédentes données par la valeur du floatingPos en y
        let final_curve= cubic(new Point(pos.x - 1, curves[0](floatingPos.y)),new Point(pos.x + 0, curves[1](floatingPos.y)),new Point(pos.x + 1, curves[2](floatingPos.y)),new Point(pos.x + 2, curves[3](floatingPos.y)));
        // 4. On obtient la valeur voulue en appliquant la valeur du floatingPos en x à la dernière courbe cubique
        newImgData.data[newPos + k] = final_curve(floatingPos.x);
      }
    }
  }

  return newImgData;
}

/**
 * Permet de calculer une fonction cubique grâce à 4 points
 * @param {Point} p1 le point numéro 1
 * @param {Point} p2 le point numéro 2
 * @param {Point} p3 le point numéro 3
 * @param {Point} p4 le point numéro 4
 * @returns {function} la fonction cubic généré grâce aux 4 points
 */
function cubic(p1, p2, p3, p4){
  return (x) => {
    const mult1 = (x) => (x - p2.x) * (x - p3.x) * (x - p4.x);
    const mult2 = (x) => (x - p1.x) * (x - p3.x) * (x - p4.x);
    const mult3 = (x) => (x - p1.x) * (x - p2.x) * (x - p4.x);
    const mult4 = (x) => (x - p1.x) * (x - p2.x) * (x - p3.x);

    return (mult1(x) * (p1.y / mult1(p1.x))) + (mult2(x) * (p2.y / mult2(p2.x))) + (mult3(x) * (p3.y / mult3(p3.x))) + (mult4(x) * (p4.y / mult4(p4.x)));
  }
}




// ImgData, x, y, h, w, matriceConvolution
/**    | v v
*     | x v
*     | v v
*/
function getValueColor(ImgData, x, y, matriceConvolution) {
  let w = imgData.width;
  let h = imgData.height;

  let convolutionSize = matriceConvolution[0].length; // Ex 1 -> 8 voisins
  let centerMatriceConvolution = (matriceConvolution[0].length / 2).floor();

  let color = {r: 0, g: 0, b: 0, a: 0 };
  for (let i = 0; i < convolutionSize; i++) { //Parcours Hauteur
    let posLargeur = position + (i - 1) * (nW * 4);
    for (let j = 0; j < convolutionSize; j++) { //Parcours Largeur
      let xVoisin = x + j - centerMatriceConvolution;
      let yVoisin = y + i - centerMatriceConvolution;
      let pos = 4 * (yVoisin * w + xVoisin);
      //Si pos n'est pas en dehors de l'image et que celui-ci est sur la même ligne que l'élément centré
      if (pos >= 0 && xVoisin >= 0 && xVoisin < w && yVoisin >= 0 && yVoisin < h) {
        color.r += ImgData[pos] * matriceConvolution[i][j];
        color.g += ImgData[pos + 1] * matriceConvolution[i][j];
        color.b += ImgData[pos + 2] * matriceConvolution[i][j];
        color.a += ImgData[pos + 3] * matriceConvolution[i][j];
        nbElements += matriceConvolution[i][j];
      }
    }
  }
  color.r /= nbElements;
  color.g /= nbElements;
  color.b /= nbElements;
  color.a /= nbElements;
  return color;
}

/**
* @param {Point} point
* @param {Polygon} polygon
*
* @returns {Boolean}
* if point is inside polygon-> true
* else -> false
*/
function insidePolygon(point, polygon) {

  let x = point.x,
  y = point.y;

  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    let xi = polygon[i].x,
    yi = polygon[i].y;
    let xj = polygon[j].x,
    yj = polygon[j].y;

    let intersect = (((yi > y) != (yj > y))  && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) ;

    if (intersect) inside = !inside;
  }

  return inside;
};
