/**
 * face-api
 * https://github.com/justadudewhohacks/face-api.js/
 *
 * Lien des modèles pour la reconnaissance du visage
 */
const MODEL_URL = 'https://barraganlazlo.github.io/Projet-Edition-Photos/Projet/models';
let STOP_FILTER = false;
let MOBILE_PERF = true;

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68TinyNet.loadFromUri(MODEL_URL),
  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),

  // faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
  // faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
  // faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
]).then(startFaceDetection)
.catch((e) => {
  logDOM(e);
})

//Récupération des elements HTML du DOM
const video = document.getElementById("video"); //Affichage de la vidéo de la webcam
const log = document.getElementById('ERROR'); //Affichage des erreurs (log)

/**
 * Récupère les accès de la caméra
 * @return {[type]} [description]
 */
function startVideo(){
  //const rect = document.body.getBoundingClientRect();
  logDOM(navigator.mediaDevices);
  navigator.mediaDevices.getUserMedia({
      video: {
        width: {ideal: 240, max: 240},
        height: {ideal: 160, max: 160},
        facingMode: "user",
      }
    }
  ).then((stream) => {
    let deviceId = stream.getVideoTracks()[0].getSettings().deviceId;
    let frameRate = stream.getVideoTracks()[0].getSettings().frameRate;
    let height = stream.getVideoTracks()[0].getSettings().height;
    let width = stream.getVideoTracks()[0].getSettings().width;

    video.height = width;
    video.width = height;
    video.srcObject = stream;
  }).catch(logDOM);
}

startVideo();

window.onerror = function (msg, url, line) {
   logDOM(msg + " -- " + line);
}

/**
 * Affiche une erreur sur le DOM
 * permet de faire du debug sur le téléphone
 * @param  {String} err le message de l'erreur
 */
function logDOM(err){
   log.innerText = err;
}

//Calcul de performances
let perf = 0;
function startPerformance(){ perf = performance.now(); };
function endPerformance(){ return performance.now() - perf; };

/**
 * Lancement de la detection du visage + filtre
 */
function startFaceDetection(){
  if(video.paused) return setTimeout(startFaceDetection); //Loop si la vidéo ne s'est pas lancée

  //Création du canvas pour afficher le filtre
  const canvas = faceapi.createCanvasFromMedia(video);
  canvas.id = "canvasOut";
  canvas.className = "-align-scenter";
  const ctxOut = canvas.getContext("2d");

  document.body.append(canvas);

  const displaySize = {width: video.width, height : video.height};
  faceapi.matchDimensions(canvas, displaySize);

  // logDOM(video.width + " : " + video.height + " / " + canvas.width + " : " + canvas.height);
  video.style.width = video.width + "px";
  video.style.height = video.height + "px";
  canvas.style.width = video.width + "px";
  canvas.style.height = video.height + "px";


  let canvasDraw=document.createElement("canvas");
  let ctxDraw=canvasDraw.getContext("2d");
  canvasDraw.width=video.width;
  canvasDraw.height=video.height;

  let echec = 0; //Nombre de fois où le visage n'a pas été détecté
  let tick = 0;

  //Init rendering
  initRendering(canvas);

  //Début du filtre
  const loopFilter = async () => {
    if(STOP_FILTER) return;


    /* Start performances */ startPerformance();
    let detections
    if(MOBILE_PERF) detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({inputSize : 256, scoreThreshold: 0.5})).withFaceLandmarks(true);
    else detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks();

    /* End  performances */ let speedFace = endPerformance();

    /* Start performances */ startPerformance();
    ctxDraw.drawImage(video, 0, 0); //Draw default image temporaly
    ctxOut.clearRect(0, 0, video.width, video.height);
    // ctxOut.drawImage(video, 0, 0);
    /* End  performances */ let speedDraw = endPerformance();

    /* Start performances */ startPerformance();
    if(echec > 20){
      keyPoints = [];
    }
    let speedAlgo = 0;
    for(let i = 0; i < detections.length; i++){
      echec = 0; //Reset echec
      let detection = detections[i];
      const landmarks = detections[i].landmarks;
      calculateMouthPolygon(landmarks);

      //Get image mouth
      startPerformance()
      let mouthData = getDataOut(ctxDraw);
      speedAlgo = endPerformance();
      // console.log(mouthData);
      ctxDraw.putImageData(mouthData,0,0);
      ctxOut.drawImage(canvasDraw, 0, 0);
    }
    if(detections.length <= 0){
      echec++;
      if(keyPoints.length != 0){
        let mouthData = getDataOut(ctxDraw);

        ctxDraw.putImageData(mouthData,0,0);
        ctxOut.drawImage(canvasDraw, 0, 0);
      }
    }
    /* End  performances */ let speedEffect = endPerformance();

    //Le scale pour adapter à la taille de l'écran

    // const resizedDetections = faceapi.resizeResults(detections, displaySize);
    // faceapi.draw.drawFaceLandmarks(canvas, resizedDetections);

    // logDOM(++tick + " : " + (speedFace).toFixed(2) + " / " + (speedDraw).toFixed(2) + " / " + (speedEffect).toFixed(2) + " / " + (speedAlgo).toFixed(2));

    loopFilter();
  }
  loopFilter();

}

function calculateMouthPolygon(landmarks){
  const dist = distance(new Point(landmarks.positions[66]._x, landmarks.positions[66]._y), new Point(landmarks.positions[62]._x, landmarks.positions[62]._y)) / 20;
  let scale = 1.2 + (dist * dist);
  if(MOBILE_PERF) scale = scale > 3 ? 3 : scale;
  USER_DATAS.scale = scale;
  keyPoints = [];
  center = new Point(0,0);

  //Face-api 48 -> 60 représent la bouche
  for (let i = 48; i < 60; i++) {
    const p = new Point(landmarks.positions[i]._x, landmarks.positions[i]._y);
    keyPoints[i - 48] = p;
    center.x += p.x;
    center.y += p.y;
  }
  center.x /= keyPoints.length;
  center.y /= keyPoints.length;
}

function initRendering(canvas){
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
}
