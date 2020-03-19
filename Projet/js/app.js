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

let USER_DATAS = {
  ImageIn: null,
  global: false,
  scale: 1,
  rotation: 1,
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

const checkGlobal = document.getElementById("checkGlobal");
const scaleValue = document.getElementById("scaleValue");
const rotationValue = document.getElementById("rotationValue");

const translationX = document.getElementById("translationX");
const translationY = document.getElementById("translationY");

function filterChange(radio) {
  USER_DATAS.interporlationType = radio.value;
  DrawOutContext();
}

checkGlobal.addEventListener("change", (e) => {
  USER_DATAS.global = checkGlobal.checked;
  DrawOutContext();
});
scaleValue.addEventListener("change", (e) => {
  USER_DATAS.scale = parseInt(scaleValue.value);
  DrawOutContext();

});
rotationValue.addEventListener("change", (e) => {
  USER_DATAS.rotation = parseInt(rotationValue.value);
  DrawOutContext();
});

translationX.addEventListener("change", (e) => {
  USER_DATAS.translate.x = parseInt(translationX.value);
  DrawOutContext();
});
translationY.addEventListener("change", (e) => {
  USER_DATAS.translate.y = parseInt(translationY.value);
  DrawOutContext();
});

btnImageIn.addEventListener("click", () => {
  inputImageIn.click();
  DrawOutContext();
});

inputImageIn.addEventListener("change", () => {
  console.log("upload image ");
  console.log(inputImageIn.files[0]);
  USER_DATAS.ImageIn = loadImage(URL.createObjectURL(inputImageIn.files[0]));
})
