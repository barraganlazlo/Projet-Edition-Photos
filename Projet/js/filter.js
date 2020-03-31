const MODEL_URL = './models'

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
])
.then(startFaceDetection)
.catch((e) => {
  console.log(e);
})

function startFaceDetection(){
  console.log("coucou");
  document.body.append("loaded");
}

const camera = document.getElementById("camera");
