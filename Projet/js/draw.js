
function drawImage(ctx,img){
    ctx.canvas.width = img.width;
    ctx.canvas.height = img.height;
    ctx.drawImage(USER_DATAS.ImageIn, 0,0);
}

function drawKeysPoints(keyPoints,ctx, pointSelected = -1){
  for(let i = 0; i < keyPoints.length; i++){
    if(i > 0) drawLine(keyPoints[i], keyPoints[i - 1], ctx);
    else drawLine(keyPoints[0], keyPoints[keyPoints.length - 1], ctx);
    drawPoint(keyPoints[i], ctx, pointSelected == i ? "rgb(220,50,50)" : "rgb(247, 221, 114)");
  }
}

function drawPoint(point, ctx, color = "rgb(247, 221, 114)"){
  ctx.beginPath();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.arc(point.x, point.y, pointSize, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.stroke();
}

function drawLine(pointA, pointB, ctx){
  ctx.beginPath();
  ctx.strokeStyle = "rgb(247, 221, 114)";
  ctx.fillStyle = "rgb(247, 221, 114)";
  ctx.moveTo(pointA.x, pointA.y);
  ctx.lineTo(pointB.x, pointB.y);
  ctx.stroke();
}

function drawCross(point, ctx){
  ctx.strokeStyle = "rgb(100, 100, 100)";
  let sizeCross = 10;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(point.x, point.y - sizeCross);
  ctx.lineTo(point.x, point.y + sizeCross);
  ctx.stroke();

  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(point.x - sizeCross, point.y);
  ctx.lineTo(point.x + sizeCross, point.y);
  ctx.stroke();
}
