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
let ImageOutData;

function DrawOutContext(debug = true){
  //Draw Image
  if(ImageIn){
    let w = ctxOut.canvas.width;
    let h = ctxOut.canvas.height;
    ImageInData = getImageData(ctxOut,ImageIn, w, h);

    drawDefaultBackground(ctxOut);
    processTransformation(ctxOut, ImageInData, w, h);
    // drawImage(ctxOut,ImageOut);
  }else{
    drawDefaultBackground(ctxOut);
  }
  //Draw Points
  if(debug) drawKeysPoints(ctxOut);
}

function getImageData(ctx,img, w, h){
    draw_image(ctx,img);
    return ctx.getImageData(0,0,w,h);
}

function processTransformation(ctx, imageData, w,h){
  let monImageData = ctx.createImageData(w, h);
  for(let y=0; y<h; y++){
    for(let x=0; x<w; x++){
      let pos = x + y*w;
      if(insidePolygon(Point(x, y), keyPoints)){
        for(let i = 0; i < 5; i++){
          monImageData[pos + i] = imageData[pos + i];
        }
      }else{
        for(let i = 0; i < 5; i++){
          monImageData[pos + i] = 255;
        }
      }
    }
  }
  ctx.putImageData(monImageData, 0, 0);
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
