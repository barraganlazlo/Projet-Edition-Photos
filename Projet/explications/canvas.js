const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let mouse = {x:0, y:0};

function getMousePos(canvas, evt) {
  let rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

canvas.addEventListener('mousemove', function(evt) { mouse = getMousePos(canvas, evt); }, false);

canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;

const sizePixel = 100;

function random(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}

function randColorValue(){ return random(0, 255); }
function randColor(opacity = 1){
  return `rgba(${randColorValue()}, ${randColorValue()}, ${randColorValue()}, ${opacity})`;
}

function resetStyle(){
  ctx.fillStyle = 'rgba(50, 50, 50, 1)';
  ctx.strokeStyle = 'rgba(50, 50, 50, 1)';
}

function drawCircle(x, y, color, rayon = 2){
  if(!color) resetStyle();
  else ctx.fillStyle = color;
  let cercle = new Path2D();
  cercle.moveTo(125, 35);
  cercle.arc(x, y, rayon, 0, 2 * Math.PI);
  ctx.fill(cercle);
}

function drawRectanglePixel(x, y, color, size = sizePixel){
  ctx.fillStyle = color || randColor(0.1);
  let rectangle = new Path2D();
  rectangle.rect(x - size/2, y - size/2, size, size);
  ctx.fill(rectangle);
}

function drawRectangle(x, y, size = sizePixel){
  let rectangle = new Path2D();
  rectangle.rect(x - size/2, y - size/2, size, size);
  ctx.stroke(rectangle);
}

function drawPixel(x, y, posRandColor){
  resetStyle();
  drawCircle(x, y);
  if(posRandColor !== undefined){
    drawRectanglePixel(x, y, colors[posRandColor]);
  }else{
    drawRectangle(x, y);
  }
}

function drawLine(x1, y1, x2, y2, color){
  if(!color) resetStyle();
  else ctx.strokeStyle = color;
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

const sizeImage = 10;
let w = sizeImage;
let h = sizeImage;

//Init random Color fixed
let colors = [];
for (let i = 0; i < sizeImage; i++) {
  for (let j = 0; j < sizeImage; j++) {
    colors[i * sizeImage + j] = randColor();
  }
}

function drawAllPixels(color){
  for (let i = 0; i < sizeImage; i++) {
    for (let j = 0; j < sizeImage; j++) {
      drawPixel(i * sizePixel + centerLeft(), j * sizePixel + centerTop(), color ? i * sizeImage + j : undefined);
    }
  }
}

function centerTop(){ return (canvas.height / 2 - sizeImage * sizePixel / 2); }
function centerLeft(){ return (canvas.width / 2 - sizeImage * sizePixel / 2); }

function drawNeighbourBilinear(x, y){
  const Neighbor = [];
  for(let i = 0; i < 2; i++ ){
    for(let j = 0; j < 2; j++ ){
      const p = new Point(Math.floor(x) + i,Math.floor(y) + j);
      //On merge les valeurs en dehors de la taille de l'image
      if(p.x <0){ p.x = 0; }
      if(p.y <0){ p.y = 0; }
      if(p.x>=w){ p.x=w-1; }
      if(p.y>=h){ p.y=h-1; }
      Neighbor[i * 2 + j]=p;
      drawLine(mouse.x, mouse.y, p.x * sizePixel + centerLeft(), p.y * sizePixel + centerTop());
    }
  }
}

function drawLinearStep(x, y, step = 0){
  const Neighbor = [];
  for(let i = 0; i < 2; i++ ){
    for(let j = 0; j < 2; j++ ){
      const p = new Point(Math.floor(x) + i,Math.floor(y) + j);
      //On merge les valeurs en dehors de la taille de l'image
      if(p.x <0){ p.x = 0; }
      if(p.y <0){ p.y = 0; }
      if(p.x>=w){ p.x=w-1; }
      if(p.y>=h){ p.y=h-1; }
      Neighbor[i * 2 + j]=p;
    }
  }

  for(let i=0;i<2;i++){
    drawLine(Neighbor[i * 2 + 0].x * sizePixel + centerLeft(), Neighbor[i * 2 + 0].y * sizePixel + centerTop(), Neighbor[i * 2 + 1].x * sizePixel + centerLeft(), Neighbor[i * 2 + 1].y * sizePixel + centerTop(), "red");
  }

  if(step > 0){
    drawCircle(Neighbor[0].x * sizePixel + centerLeft(), y * sizePixel + centerTop());
    drawCircle(Neighbor[2].x * sizePixel + centerLeft(), y * sizePixel + centerTop());
  }
  if(step > 1){
    drawLine(Neighbor[0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), Neighbor[2].x * sizePixel + centerLeft(), y * sizePixel + centerTop());
  }
}

function drawNeighbourBicubic(x, y){
  const Neighbor = [];
  for(let i = 0; i < 4; i++ ){
    Neighbor[i] = [];
    for(let j = 0; j < 4; j++ ){
      const p = new Point(Math.floor(x) + i - 1,Math.floor(y) + j - 1);
      //On merge les valeurs en dehors de la taille de l'image
      if(p.x <0){ p.x = 0; }
      if(p.y <0){ p.y = 0; }
      if(p.x>=w){ p.x=w-1; }
      if(p.y>=h){ p.y=h-1; }
      Neighbor[i][j]=p;
      drawLine(mouse.x, mouse.y, p.x * sizePixel + centerLeft(), p.y * sizePixel + centerTop());
    }
  }
}

function drawCubicStep(x, y, step = 0){
  const Neighbor = [];
  for(let i = 0; i < 4; i++ ){
    Neighbor[i] = [];
    for(let j = 0; j < 4; j++ ){
      const p = new Point(Math.floor(x) + i - 1,Math.floor(y) + j - 1);
      //On merge les valeurs en dehors de la taille de l'image
      if(p.x <0){ p.x = 0; }
      if(p.y <0){ p.y = 0; }
      if(p.x>=w){ p.x=w-1; }
      if(p.y>=h){ p.y=h-1; }
      Neighbor[i][j]=p;
    }
  }

  for(let i=0;i<4;i++){
    drawLine(Neighbor[i][0].x * sizePixel + centerLeft(), Neighbor[i][0].y * sizePixel + centerTop(), Neighbor[i][3].x * sizePixel + centerLeft(), Neighbor[i][3].y * sizePixel + centerTop(), "red");
  }
  if(step > 0){
    drawCircle(Neighbor[0][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), "green");
    drawCircle(Neighbor[1][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), "green");
    drawCircle(Neighbor[2][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), "green");
    drawCircle(Neighbor[3][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), "green");
  }
  if(step > 1){
    drawLine(Neighbor[0][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), Neighbor[3][0].x * sizePixel + centerLeft(), y * sizePixel + centerTop(), "blue");
  }
}

function Draw(){
  let x = mouse.x / sizePixel - centerLeft() / sizePixel;
  let y = mouse.y / sizePixel - centerTop() / sizePixel;
  if(MAIN_STEP == 0){
    drawAllPixels(true);
  }else if(MAIN_STEP == 1){
    drawAllPixels();
  }else if(MAIN_STEP == 2){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
  }else if(MAIN_STEP == 3){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawNeighbourBilinear(x, y);
  }else if(MAIN_STEP == 4){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawLinearStep(x, y, 0);
  }else if(MAIN_STEP == 5){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawLinearStep(x, y, 1);
  }else if(MAIN_STEP == 6){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawLinearStep(x, y, 2);
  }else if(MAIN_STEP == 7){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawNeighbourBilinear(x, y);
    drawLinearStep(x, y, 2);
  }else if(MAIN_STEP == 8){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawNeighbourBicubic(x, y);
  }else if(MAIN_STEP == 9){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawCubicStep(x, y, 0);
  }else if(MAIN_STEP == 10){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawCubicStep(x, y, 1);
  }else if(MAIN_STEP == 11){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawCubicStep(x, y, 2);
  }else if(MAIN_STEP == 12){
    drawAllPixels();
    drawCircle(mouse.x, mouse.y);
    drawNeighbourBicubic(x, y);
    drawCubicStep(x, y, 2);
  }
}

// The proper game loop
window.requestAnimationFrame(gameLoop);

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    Draw();
    window.requestAnimationFrame(gameLoop);
}

let MAIN_STEP = 0;
window.addEventListener("keydown", (e) => {
  if(e.code == "ArrowRight") MAIN_STEP++;
  if(e.code == "ArrowLeft") MAIN_STEP--;
  if(MAIN_STEP < 0) MAIN_STEP = 0;
  if(MAIN_STEP > 12) MAIN_STEP = 12;
});
