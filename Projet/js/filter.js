const MODEL_URL = 'https://barraganlazlo.github.io/Projet-Edition-Photos/Projet/models';
let STOP_FILTER = false;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
])
.then(startFaceDetection)
.catch((e) => {
  logError(e);
})

const video = document.getElementById("video");
const log = document.getElementById('ERROR');

function startVideo(){
  const rect = document.body.getBoundingClientRect();
  logError(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia({
      video: {
        width: {ideal: 480},
        height: {ideal: 320},
        facingMode: "user",
      }
    }
  ).then((stream) => {
    logError('YES LE STREAM');
    video.srcObject = stream;
  }).catch(logError);
}

startVideo();

window.onerror = function (msg, url, line) {
   logError(msg + " -- " + line);
}

function logError(err){
   log.innerText = err;
}



function startFaceDetection(){
  if(video.paused) return setTimeout(startFaceDetection);
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.id = "canvasOut";
  // canvas.className = "-f-mult1"
  canvas.className = "-align-scenter";
  video.style.display = "none";
  const ctx = canvas.getContext("2d");
  ctxOut = ctx;
  document.body.append(canvas);
  const rect = canvas.getBoundingClientRect();
  const displaySize = {width: rect.width, height : rect.height};
  faceapi.matchDimensions(canvas, displaySize);
  canvas.className = "-f-mult1";

  let echec = 0;

  let loopFilter = async () => {
    if(STOP_FILTER) return;

    USER_DATAS.ImageIn = video;
    USER_DATAS.interporlationType = "Bilinear";
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);

    ctxOut.drawImage(video, 0, 0); //Draw default image

    if(echec > 20){
      keyPoints = [];
    }
    for(let i = 0; i < detections.length; i++){
      echec = 0; //Reset echec
      let detection = detections[i];
      const landmarks = detections[i].landmarks;
      calculateMouthPolygon(landmarks);

      //Get image mouth

      let mouthData = getDataOut();
      // console.log(mouthData);
      let w = mouthData.width;
      let h = mouthData.height;

      let canvas2=document.createElement("canvas");
      canvas2.width=w;
      canvas2.height=h
      let ctx2=canvas2.getContext("2d");
      ctx2.putImageData(mouthData,0,0);
      ctxOut.drawImage(canvas2, 0, 0);

      canvas2.remove();
    }
    if(detections.length <= 0){
      echec++;
      if(keyPoints.length != 0){

      let mouthData = getDataOut();
      // console.log(mouthData);
      let w = mouthData.width;
      let h = mouthData.height;

      let canvas2=document.createElement("canvas");
      canvas2.width=w;
      canvas2.height=h
      let ctx2=canvas2.getContext("2d");
      ctx2.putImageData(mouthData,0,0);
      ctxOut.drawImage(canvas2, 0, 0);

      canvas2.remove();
      }
    }

    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    loopFilter();
  }
  loopFilter();

}

function calculateMouthPolygon(landmarks){
  const dist = distance(new Point(landmarks.positions[66]._x, landmarks.positions[66]._y), new Point(landmarks.positions[62]._x, landmarks.positions[62]._y)) / 20;
  let scale = 1.2 + (dist * dist);
  USER_DATAS.scale = scale > 2 ? 2 : scale;
  let tempKeysPoints = [];

  for (let i = 48; i < 60; i++) {
    const p = new Point(landmarks.positions[i]._x, landmarks.positions[i]._y);
    tempKeysPoints.push(p);
  }
  keyPoints = tempKeysPoints;
  computeCenter();
}
