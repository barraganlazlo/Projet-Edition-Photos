
function drawImage(ctx,img){
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(ImageIn, 0,0);
}

function drawKeysPoints(keyPoints,ctx){
  for(let i = 0; i < keyPoints.length; i++){
    drawPoint(keyPoints[i], ctx);
    if(i > 0) drawLine(keyPoints[i], keyPoints[i - 1], ctx);
    else drawLine(keyPoints[0], keyPoints[keyPoints.length - 1], ctx);
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

function drawLine(pointA, pointB, context){
  context.beginPath();
  context.strokeStyle = "rgb(247, 221, 114)";
  context.fillStyle = "rgb(247, 221, 114)";
  context.moveTo(pointA.x, pointA.y);
  context.lineTo(pointB.x, pointB.y);
  context.stroke();
}
