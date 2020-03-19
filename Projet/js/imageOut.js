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

let copyKeyPoints = [];
let scaleMatrix = matrixScale(10);
let rotateMatrix = matrixRotation(0);

/**
 * Draw canvas' out context
 * @param {Boolean} debug
 */
function DrawOutContext(debug = true) {

  copyKeyPoints = [];
  let translateMatrix = matrixTranslate(new Vector2(-center.x, -center.y));
  let translateMatrix2 = matrixTranslate(center.x, center.y);
  let finalMatrix = Matrix.mult(translateMatrix2, rotateMatrix, scaleMatrix, translateMatrix);
  let invertMatrix = Matrix.invert(finalMatrix);

  //Application de la transformation
  let newCenter = linearTransformationPoint(center, finalMatrix);
  for (let i = 0; i < keyPoints.length; i++) {
    copyKeyPoints[i] = linearTransformationPoint(keyPoints[i], finalMatrix);
  }

  //Draw Image
  if (USER_DATAS.ImageIn) {
    ImageInData = getImageData(ctxOut, USER_DATAS.ImageIn);
    drawDefaultBackground(ctxOut);
    let ImageOutDataScale = BoxFilter(ctxOut, ImageInData, copyKeyPoints, invertMatrix);
    ctxOut.putIm
  } else {
    drawDefaultBackground(ctxOut);
  }

  //Draw Points
  if (debug) {
    drawKeysPoints(copyKeyPoints, ctxOut);
    drawCross(newCenter, ctxOut);
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
 * @returns {ImageData} la nouvelle image data
 */
function BoxFilter(ctx, imgData, polygon, invertMatrix) {
  let w = imgData.width;
  let h = imgData.height;
  let newImgData = ctx.createImageData(w, h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (!insidePolygon(Point(x, y), polygon)) {
        for (let i = 0; i < 4; i++) {
          newImgData.data[newPos + i] = 255;
        }
        continue;
      }
      //position du pixel courrant dans newImgData
      let newPos = x * 4 + y * w * 4;
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