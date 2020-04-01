/**
 * Application
 *
 * @author Lazlo_Barragan
 * @author Romain_Saclier
 */


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

/**
* Key Points
* Represent the strategics points to scale localy the image
*/
let keyPoints = []; //strategics points
let center = Point(0, 0);
let pointSize = 4; //Basic size of a point

function computeCenter() {
  center = Point(0, 0);
  for (let i = 0; i < keyPoints.length; i++) {
    center.x += keyPoints[i].x;
    center.y += keyPoints[i].y;
  }
  center.x /= keyPoints.length;
  center.y /= keyPoints.length;
}

let USER_DATAS = {
  ImageIn: null,
  global: false,
  scale: 1,
  rotation: 0,
  translate: new Vector2(0, 0),
  /**
   * Types possible :
   *    - NearestNeighbor
   *    - Bilinear
   *    - Bicubic
   */
  interporlationType: "NearestNeighbor",
}

/**
 * loading imagecanvas
 */
const inputImageIn = document.getElementById("ImageIn");
const btnImageIn = document.getElementById("btnImageIn");
/**
 * Download button
 */
const btnImageSave = document.getElementById("btnImageSave");

const checkGlobal = document.getElementById("checkGlobal");
const scaleValue = document.getElementById("scaleValue");
const rotationValue = document.getElementById("rotationValue");

const translationX = document.getElementById("translationX");
const translationY = document.getElementById("translationY");

let tmpNameFile = "";

function filterChange(radio) {
  USER_DATAS.interporlationType = radio.value;
  DrawOutContext();
}

if(checkGlobal) checkGlobal.addEventListener("change", (e) => {
  USER_DATAS.global = checkGlobal.checked;
  DrawOutContext();
});
if(scaleValue) scaleValue.addEventListener("change", (e) => {
  USER_DATAS.scale = parseFloat(scaleValue.value);
  DrawOutContext();

});
if(rotationValue) rotationValue.addEventListener("change", (e) => {
  USER_DATAS.rotation = parseFloat(rotationValue.value);
  DrawOutContext();
});

if(translationX) translationX.addEventListener("change", (e) => {
  USER_DATAS.translate.x = parseFloat(translationX.value);
  DrawOutContext();
});
if(translationY) translationY.addEventListener("change", (e) => {
  USER_DATAS.translate.y = parseFloat(translationY.value);
  DrawOutContext();
});

if(btnImageIn) btnImageIn.addEventListener("click", () => {
  inputImageIn.click();
  DrawOutContext();
});

if(inputImageIn) inputImageIn.addEventListener("change", () => {
  console.log("upload image ");
  console.log(inputImageIn.files[0]);
  USER_DATAS.ImageIn = loadImage(URL.createObjectURL(inputImageIn.files[0]));
  tmpNameFile = inputImageIn.files[0].name;
  tmpNameFile = tmpNameFile.split(".");
  tmpNameFile.pop();
  tmpNameFile = tmpNameFile.join(".");
  console.log(tmpNameFile);
})

if(btnImageSave) btnImageSave.addEventListener("click", () => {
  let link = document.createElement('a');
  console.log(tmpNameFile);
  link.download = tmpNameFile + '_transform.png';
  link.href = canvasOut.toDataURL();
  link.click();
});
