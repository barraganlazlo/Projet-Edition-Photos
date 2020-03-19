/**
 * Application
 *
 * @author Lazlo_Barragan
 * @author Romain_Saclier
 */

/**
 * Generate a point object
 * @param {Number} x position x of the point
 * @param {Number} y position y of the point
 */
function Point(x = 0, y = 0) {
    return { x, y };
}

/**
 * Distance between to point
 * @param {Number} a first point
 * @param {Number} b second point
 * @return { float }
 */
function distance(a, b) {
    return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
}

/**
 * Change mouse position with an event and a canvas
 * @param {Canvas} canvas the canvas of the context
 * @param {Event} e the event generate by the client
 */
function setMousePos(canvas, e) {
    let rect = canvas.getBoundingClientRect();
    MOUSE.x = e.clientX - rect.left;
    MOUSE.y = e.clientY - rect.top;
}

//Mouse position
MOUSE = Point();