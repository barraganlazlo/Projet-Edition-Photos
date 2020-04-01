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



let pointSelected = -1; //Point not defined
let nearPoint = -1; //Point not defined


function getNearKeyPoint() {
  for (let i = 0; i < keyPoints.length; i++) {
    if (distance(MOUSE, keyPoints[i]) <= pointSize + 3) {
      return i;
    }
  }
  return -1;
}

function addKeyPoint(point) {
  keyPoints.push(point);
  computeCenter();
}

/**
* Draw Context
*/

function DrawInContext(debug = true) {
  //Draw Image
  if (USER_DATAS.ImageIn) {
    drawImage(ctxIn, USER_DATAS.ImageIn);
  } else {
    drawDefaultBackground(ctxIn);
  }
  //Draw Points
  if (debug) {
    drawKeysPoints(keyPoints, ctxIn, nearPoint);
    drawCross(center, ctxIn);
  }
  DrawOutContext();
}


/**
* Event canvasIn
*/

canvasIn.addEventListener('mousemove', function(e) {
  setMousePos(canvasIn, e);

  nearPoint = getNearKeyPoint();

  if (pointSelected >= 0) {
    keyPoints[pointSelected].x = MOUSE.x;
    keyPoints[pointSelected].y = MOUSE.y;
    computeCenter();
  }
  DrawInContext(true);
}, false);

canvasIn.addEventListener('mousedown', function(e) {
  setMousePos(canvasIn, e);

  // Init the point selected to null
  pointSelected = getNearKeyPoint();

  if (pointSelected < 0) {
    addKeyPoint(Point(MOUSE.x, MOUSE.y)); //Create point at mouse position
    pointSelected = keyPoints.length - 1;
  }
  DrawInContext(true);
});

canvasIn.addEventListener('mouseup', function(e) {
  setMousePos(canvasIn, e);
  pointSelected = -1;
});
