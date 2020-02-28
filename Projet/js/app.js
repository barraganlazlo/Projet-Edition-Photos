/**
 * Application
 *
 * @author Lazlo_Barragan
 * @author Romain_Saclier
 */

/**
 * Generate a point object
 * @param x position x of the point
 * @param y position y of the point
 */
function Point(x = 0, y = 0){
  return { x , y };
}

/**
 * Distance between to point
 * @param a first point
 * @param b second point
 * @return { float }
 */
function distance(a, b) {
  return Math.sqrt(((a.x - b.x) * (a.x - b.x)) + ((a.y - b.y) * (a.y - b.y)));
}

/**
 * Change mouse position with an event and a canvas
 * @param canvas the canvas of the context
 * @param e the event generate by the client
 */
function setMousePos(canvas, e) {
  let rect = canvas.getBoundingClientRect();
  MOUSE.x = e.clientX - rect.left;
  MOUSE.y = e.clientY - rect.top;
}

//Mouse position
MOUSE = Point();
