const MODEL_URL = 'https://barraganlazlo.github.io/Projet-Edition-Photos/Projet/models';
let STOP_FILTER = false;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
  // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  // faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  // faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
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
        width: {ideal: 1280, max: 1280},
        height: {ideal: 720, max: 720},
        facingMode: "user",
      }
    }
  ).then((stream) => {
    let deviceId = stream.getVideoTracks()[0].getSettings().deviceId;
    let frameRate = stream.getVideoTracks()[0].getSettings().frameRate;
    let height = stream.getVideoTracks()[0].getSettings().height;
    let width = stream.getVideoTracks()[0].getSettings().width;

    video.height = height;
    video.width = width;
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

let perf = 0;
function startPerformance(){ perf = performance.now(); };
function endPerformance(){ return performance.now() - perf; }



function startFaceDetection(){
  if(video.paused) return setTimeout(startFaceDetection);
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.id = "canvasOut";
  // canvas.className = "-f-mult1"
  canvas.className = "-align-scenter";
  canvas.style.background = "aliceblue";
  //video.style.display = "none";
  const ctxOut = canvas.getContext("2d");
  document.body.append(canvas);
  const displaySize = {width: video.width, height : video.height};
  faceapi.matchDimensions(canvas, displaySize);
  // canvas.style.width = "100%";

  // logError(video.width + " : " + video.height + " / " + canvas.width + " : " + canvas.height);
  // video.style.width = video.width + "px";
  // video.style.height = video.height + "px";
  // canvas.style.width = video.width + "px";
  // canvas.style.height = video.height + "px";


  let canvasDraw=document.createElement("canvas");
  let ctxDraw=canvasDraw.getContext("2d");
  canvasDraw.width=video.width;
  canvasDraw.height=video.height;

  let echec = 0;
  let tick = 0;

  let moyenneFace = 0;
  let moyenneDraw = 0;
  let moyenneEffect = 0;

  let loopFilter = async () => {
    if(STOP_FILTER) return;

    const windowSize = document.body.getBoundingClientRect();

    let scaleX = windowSize.width / video.width;
    let scaleY = windowSize.height / video.height;

    let scaleToFit = Math.min(scaleX, scaleY);
    let scaleToCover = Math.max(scaleX, scaleY);

    canvas.style.transformOrigin = "0 0"; //scale from top left
    canvas.style.transform = " translateX("+ (windowSize.width / 2 + canvas.width * scaleToFit / 2) +"px) scale( -" + scaleToFit + ", " + scaleToFit + ")";
    canvas.style.position = "fixed";
    canvas.style.top = (windowSize.height / 2 - (canvas.height / 2) * scaleToFit) + "px";
    canvas.style.left = 0;

    video.style.transformOrigin = "0 0"; //scale from top left
    video.style.transform = " translateX("+ (windowSize.width / 2 + canvas.width * scaleToFit / 2) +"px) scale( -" + scaleToFit + ", " + scaleToFit + ")";
    video.style.position = "fixed";
    video.style.top = (windowSize.height / 2 - (canvas.height / 2) * scaleToFit) + "px";
    video.style.left = 0;


    USER_DATAS.ImageIn = video;
    USER_DATAS.interporlationType = "Bilinear";
    /* Start performances */ startPerformance();
    const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({inputSize : 128})).withFaceLandmarks();
    const resizedDetections = faceapi.resizeResults(detections, displaySize);
    /* End  performances */ let speedFace = endPerformance();

    /* Start performances */ startPerformance();
    ctxDraw.drawImage(video, 0, 0); //Draw default image temporaly
    ctxOut.clearRect(0, 0, video.width, video.height);
    /* End  performances */ let speedDraw = endPerformance();

    /* Start performances */ startPerformance();
    // if(echec > 20){
    //   keyPoints = [];
    // }
    // for(let i = 0; i < detections.length; i++){
    //   echec = 0; //Reset echec
    //   let detection = detections[i];
    //   const landmarks = detections[i].landmarks;
    //   calculateMouthPolygon(landmarks);
    //
    //   //Get image mouth
    //
    //   let mouthData = getDataOut(ctxDraw);
    //   // console.log(mouthData);
    //   ctxDraw.putImageData(mouthData,0,0);
    //   ctxOut.drawImage(canvasDraw, 0, 0);
    // }
    // if(detections.length <= 0){
    //   echec++;
    //   if(keyPoints.length != 0){
    //     let mouthData = getDataOut(ctxDraw);
    //
    //     ctxDraw.putImageData(mouthData,0,0);
    //     ctxOut.drawImage(canvasDraw, 0, 0);
    //   }
    // }
    /* End  performances */ let speedEffect = endPerformance();

    faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    logError(++tick + " : " + (speedFace).toFixed(2) + " / " + (speedDraw).toFixed(2) + " / " + (speedEffect).toFixed(2));

    loopFilter();
  }
  loopFilter();

}

function calculateMouthPolygon(landmarks){
  const dist = distance(new Point(landmarks.positions[66]._x, landmarks.positions[66]._y), new Point(landmarks.positions[62]._x, landmarks.positions[62]._y)) / 20;
  let scale = 1.2 + (dist * dist);
  USER_DATAS.scale = scale > 3 ? 3 : scale;
  let tempKeysPoints = [];

  for (let i = 48; i < 60; i++) {
    const p = new Point(landmarks.positions[i]._x, landmarks.positions[i]._y);
    tempKeysPoints.push(p);
  }
  keyPoints = tempKeysPoints;
  computeCenter();
}
