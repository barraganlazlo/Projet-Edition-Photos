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
let keyPoints =   []; //strategics points
let center = Point(0, 0);
let pointSize = 4;
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

function computeCenter() {
    center = Point(0, 0);
    for (let i = 0; i < keyPoints.length; i++) {
        center.x += keyPoints[i].x;
        center.y += keyPoints[i].y;
    }
    center.x /= keyPoints.length;
    center.y /= keyPoints.length;
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

function realContextSize(ctx) {
    ctx.canvas.width = ctx.canvas.offsetWidth;
    ctx.canvas.height = ctx.canvas.offsetHeight;
}

function drawDefaultBackground(ctx) {
    realContextSize(ctx);
    let w = ctx.canvas.width;
    let h = ctx.canvas.height;
    ctx.fillStyle = "#fff";
    ctx.fillRect(0, 0, w, h);
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
