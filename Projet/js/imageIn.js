/**
 * System to get an image and place strategics point
 *
 * @author Lazlo_Barragan
 * @author Romain_Saclier
 */


//Canvas in
let canvasIn = document.getElementById('canvasIn');
let ctxIn = canvasIn.getContext('2d');
realContextSize(ctxIn);


/**
 * Key Points
 * Represent the strategics points to scale localy the image
 */
let keyPoints = []; //strategics points
let pointSize = 4;
let pointSelected = -1; //Point not defined

function drawKeysPoints(ctx){
  for(let i = 0; i < keyPoints.length; i++){
    drawPoint(keyPoints[i], ctx);
  }
}

function drawPoint(point, context){
  context.beginPath();
  context.strokeStyle = "rgb(247, 221, 114)";
  context.fillStyle = "rgb(247, 221, 114)";
  context.arc(point.x, point.y, pointSize, 0, Math.PI * 2, true);
  context.fill();
  context.stroke();
}

function getNearKeyPoint(){
  pointSelected = -1;
  for(let i = 0; i < keyPoints.length; i++){
    if(distance(MOUSE, keyPoints[i]) <= pointSize + 3){
      pointSelected = i;
      break;
    }
  }
}

/**
 * Draw Context
 */

function DrawInContext(debug = true){
  //Draw Image
  if(ImageIn){
    draw_image(ctxIn,ImageIn);
  }else{
    drawDefaultBackground(ctxIn);
  }
  //Draw Points
  if(debug) drawKeysPoints(ctxIn);
  DrawOutContext();
}

function realContextSize(ctx){
  ctx.canvas.width  = ctx.canvas.offsetWidth;
  ctx.canvas.height = ctx.canvas.offsetHeight;
}

function drawDefaultBackground(ctx){
  realContextSize(ctx);
  let w = ctx.canvas.width;
  let h = ctx.canvas.height;
  ctx.fillStyle = "#fff";
  ctx.fillRect(0,0,w,h);
}
/**
* loading imagecanvas
*/
let inputImageIn = document.getElementById("ImageIn");
let btnImageIn = document.getElementById("btnImageIn");
let ImageIn;
btnImageIn.onclick= function(){
  console.log("upload image ");
  ImageIn = load_image(URL.createObjectURL(inputImageIn.files[0]));
}


function load_image(src) {
  let img= new Image();
  img.onload= DrawInContext;
  img.onerror=()=>{ console.error("error loading image : " + src)};
  img.src=src;
  keyPoints=[];
  return img;
}
function draw_image(ctx,img){
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(ImageIn, 0,0);
}

/**
 * Event canvasIn
 */

canvasIn.addEventListener('mousemove', function(e) {
  setMousePos(canvasIn, e);

  if(pointSelected >= 0){
    keyPoints[pointSelected].x = MOUSE.x;
    keyPoints[pointSelected].y = MOUSE.y;
  }
  DrawInContext(true);
}, false);

canvasIn.addEventListener('mousedown', function(e) {
  setMousePos(canvasIn, e);

  // Init the point selected to null
  getNearKeyPoint();

  if(pointSelected < 0){
    keyPoints.push(Point(MOUSE.x, MOUSE.y)); //Create point at mouse position
    pointSelected = keyPoints.length - 1;
  }
  DrawInContext(true);
});

canvasIn.addEventListener('mouseup', function(e) {
  setMousePos(canvasIn, e);
  pointSelected = -1;
});
