/**
 * System to get an image and place strategics point
 *
 * @author Lazlo_Barragan
 * @author Romain_Saclier
 */


 //Canvas in
let canvasOut = document.getElementById('canvasOut');
let ctxOut = canvasOut.getContext('2d');

let ImageInData;

let copyKeyPoints = [];
let scaleMatrix = matrixScale(10);
let rotateMatrix = matrixRotation(0);

function DrawOutContext(debug = true){

  copyKeyPoints = [];
  let translateMatrix = matrixTranslate(- center.x, - center.y);
  let translateMatrix2 = matrixTranslate(center.x, center.y);
  let finalMatrix = Matrix.mult(translateMatrix2, rotateMatrix, scaleMatrix, translateMatrix);
  let invertMatrix = Matrix.invert(finalMatrix);
  let newCenter = linearTransformationPoint(center, finalMatrix);

  for(let i = 0; i < keyPoints.length; i++){
    copyKeyPoints[i] = linearTransformationPoint(keyPoints[i], finalMatrix);
  }

  //Draw Image
  if(ImageIn){
    ImageInData = getImageData(ctxOut,ImageIn);
    drawDefaultBackground(ctxOut);
    let ImageOutData = polygonImage(ctxOut, ImageInData, keyPoints);
    // ctxOut.putImageData(ImageOutData,0,0);
    let ImageOutDataScale = polygonImageMatrix(ctxOut, ImageInData, copyKeyPoints, invertMatrix);
    ctxOut.putImageData(ImageOutDataScale,0,0);

  }else{
    drawDefaultBackground(ctxOut);
  }

  //Draw Points
  if(debug){
    drawKeysPoints(copyKeyPoints,ctxOut);
    drawCross(newCenter, ctxOut);
  }
}

function clear(imgData){
  let w = imgData.width;
  let h = imgData.height;
  for(let y=0; y<h; y++){
    for(let x=0; x<w; x++){
      let pos = x*4 + y*w*4;
      imgData.data[pos + 0]= 0;
      imgData.data[pos + 1]= 0;
      imgData.data[pos + 2]= 0;
      imgData.data[pos + 3]= 255;
    }
  }
}

function polygonImage(ctx, imgData, polygon){
  let w = imgData.width;
  let h = imgData.height;
  let newImgData = ctx.createImageData(w, h);
  for(let y=0; y<h; y++){
    for(let x=0; x<w; x++){
      let pos = x*4 + y*w*4;
      if(insidePolygon(Point(x, y), polygon)){
        for(let i = 0; i < 4; i++){
          newImgData.data[pos + i] = imgData.data[pos + i];
        }
      }else{
        for(let i = 0; i < 4; i++){
          newImgData.data[pos + i] = 255;
        }
      }
    }
  }

  return newImgData;
}

function polygonImageMatrix(ctx, imgData, polygon, invertMatrix){
  let w = imgData.width;
  let h = imgData.height;
  let newImgData = ctx.createImageData(w, h);
  for(let y=0; y<h; y++){
    for(let x=0; x<w; x++){
      let pos = x*4 + y*w*4;
      let vec2 = linearTransformationPoint(Point(x, y), invertMatrix);
      let realPos = Math.round(vec2.x)*4 + Math.round(vec2.y)*w*4;
      if(insidePolygon(Point(x, y), polygon)){
        for(let i = 0; i < 4; i++){
          newImgData.data[pos + i] = imgData.data[realPos + i];
        }
      }else{
        for(let i = 0; i < 4; i++){
          newImgData.data[pos + i] = 255;
        }
      }
    }
  }

  return newImgData;
}

function insidePolygon(point, polygon) {

    let x = point.x, y = point.y;

    let inside = false;
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i].x, yi = polygon[i].y;
        let xj = polygon[j].x, yj = polygon[j].y;

        let intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }

    return inside;
};
