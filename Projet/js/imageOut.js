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
function DrawOutContext(debug = true) {

  let scaleMatrix = matrixScale(USER_DATAS.scale);
  let rotateMatrix = matrixRotation(degrees_to_radians(USER_DATAS.rotation));
  console.log(USER_DATAS.rotation);
  let finalMatrix;
  let invertMatrix;
  let w,h;
  outKeyPoints = [];
  //Draw Image
  if (USER_DATAS.ImageIn) {
    ImageInData = getImageData(ctxOut, USER_DATAS.ImageIn);
    drawDefaultBackground(ctxOut);
    let ImageOutData;
    let newCenter;
    if(USER_DATAS.global){

      let height_imageIn = USER_DATAS.ImageIn.height;
      let width_imageIn = USER_DATAS.ImageIn.width;

      let translatetocenterMatrix = matrixTranslate(new Vector2(-Math.round(width_imageIn / 2), -Math.round(height_imageIn / 2)));
      let translatebackMatrix = matrixTranslate(new Vector2(Math.round(width_imageIn / 2), Math.round(height_imageIn / 2)));
      finalMatrix = Matrix.mult(translatebackMatrix, rotateMatrix, scaleMatrix, translatetocenterMatrix);
      invertMatrix = Matrix.invert(finalMatrix);

      //calculate height and width of the image after transformation
      let x0 = linearTransformationPoint(new Point(0,0), finalMatrix);
      let x1 = linearTransformationPoint(new Point(USER_DATAS.ImageIn.width, 0), finalMatrix);
      let x2 = linearTransformationPoint(new Point(USER_DATAS.ImageIn.width, USER_DATAS.ImageIn.height), finalMatrix);
      let x3 = linearTransformationPoint(new Point(0, USER_DATAS.ImageIn.height), finalMatrix);
      x0 = roundPoint(x0);
      x1 = roundPoint(x1);
      x2 = roundPoint(x2);
      x3 = roundPoint(x3);
      let minMax = new MinMaxVector2();
      minMax.addValue(x0);
      minMax.addValue(x1);
      minMax.addValue(x2);
      minMax.addValue(x3);

      h = minMax.maxPos.y - minMax.minPos.y;
      w = minMax.maxPos.x - minMax.minPos.x;
      console.log(w, h);

      //Set extremum points polygone
      outKeyPoints = [new Vector2(0,0),new Vector2(w,0),new Vector2(w,h),new Vector2(0,h)];

      setContextSize(ctxOut, w, h);
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

    switch(USER_DATAS.interporlationType){
      case "NearestNeighbor" :
        ImageOutData = NearestNeighbor(ctxOut, ImageInData, w, h, outKeyPoints, invertMatrix);
        break;
      case "Bilinear" :
        ImageOutData = Bilinear(ctxOut, ImageInData, w, h, outKeyPoints, invertMatrix);
        break;
      case "Bicubic" :
        ImageOutData = Bicubic(ctxOut, ImageInData, w, h, outKeyPoints, invertMatrix);
        break;
    }
    ctxOut.putImageData(ImageOutData, 0, 0);
    //Draw Points
    if (debug  && !USER_DATAS.global) {
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
function NearestNeighbor(ctx, imgData, w, h, polygon, invertMatrix) {
  let newImgData = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w * 4;

      if (!insidePolygon(Point(x, y), polygon)) {
        for (let i = 0; i < 4; i++) {
          newImgData.data[newPos + i] = 255;
        }
        continue;
      }
      //position exacte du point après transformation inverse
      let floatingPos = linearTransformationPoint(Point(x, y), invertMatrix);
      //position arrondi "au plus proche" après transformation inverse
      let roundedPos = Math.round(floatingPos.x) * 4 + Math.round(floatingPos.y) * w * 4;
      for (let i = 0; i < 4; i++) {
        newImgData.data[newPos + i] = imgData.data[roundedPos + i];
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
function Bilinear(ctx, imgData, w, h, polygon, invertMatrix) {
  let newImgData = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w * 4;

      if (!insidePolygon(Point(x, y), polygon)) {
        for (let i = 0; i < 4; i++) {
          newImgData.data[newPos + i] = 255;
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
      //Loop for RGBA
      for (let k = 0; k < 4; k++) {
        let va = (1 - u) * imgData.data[(j*w + i)*4 + k] + u * imgData.data[((j+1)*w + i)*4 + k];
        let vb = (1 - u) * imgData.data[(j*w + i+1)*4 + k] + u * imgData.data[((j+1)*w + i+1)*4 + k ];
        newImgData.data[newPos + k] = (1-t) * va + t *vb;
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
//TODO
function Bicubic(ctx, imgData, w, h, polygon, invertMatrix) {
  let newImgData = ctx.createImageData(w, h);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w * 4;

      if (!insidePolygon(Point(x, y), polygon)) {
        for (let i = 0; i < 4; i++) {
          newImgData.data[newPos + i] = 255;
        }
        continue;
      }
      //position exacte du point après transformation inverse
      let floatingPos = linearTransformationPoint(Point(x, y), invertMatrix);
      //position arrondi "au plus proche" après transformation inverse
      let i = Math.floor(floatingPos.x);
      let j = Math.floor(floatingPos.y);
      let t = floatingPos.x - i;
      let u = floatingPos.y - j;
      for (let k = 0; k < 4; k++) {
        let va = (1 - u) * imgData.data[(j*w + i)*4 + k] + u * imgData.data[((j+1)*w + i)*4 + k];
        let vb = (1 - u) * imgData.data[(j*w + i+1)*4 + k] + u * imgData.data[((j+1)*w + i+1)*4 + k ];
        newImgData.data[newPos + k] = (1-t) * va + t *vb;
      }
    }
  }

  return newImgData;
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

    let intersect = ((yi > y) != (yj > y)) &&
    (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }

  return inside;
};
