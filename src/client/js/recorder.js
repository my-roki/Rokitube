const recordStartButton = document.getElementById("recordStartButton");
const video = document.getElementById("preview");
const recordDownloadButton = document.getElementById("recordDownloadButton");

let stream;
let recorder;
let videoFile;
let videoRecorderTimeout = null;

function handleStop() {
  if (videoRecorderTimeout) {
    clearTimeout(videoRecorderTimeout);
    videoRecorderTimeout = null;
  }
  recordStartButton.innerText = "Start Recording";
  recordStartButton.removeEventListener("click", handleStop);
  recordStartButton.addEventListener("click", handleStart);
  recordDownloadButton.addEventListener("click", handleDownload);

  recorder.stop();
}

function handleStart() {
  recordStartButton.innerText = "Stop Recording";
  recordStartButton.removeEventListener("click", handleStart);
  recordStartButton.addEventListener("click", handleStop);
  video.srcObject = stream;
  video.play();

  recorder = new MediaRecorder(stream, { mimeType: "video/webm" });
  recorder.ondataavailable = (event) => {
    videoFile = URL.createObjectURL(event.data);
    video.srcObject = null;
    video.src = videoFile;
    video.loop = true;
    video.play();
  };
  recorder.start();
  videoRecorderTimeout = setTimeout(() => {
    handleStop();
  }, 10000);
}

function handleDownload() {
  const a = document.createElement("a");
  a.href = videoFile;
  a.download = `my_recoding_${new Date().getTime()}.webm`;
  document.body.appendChild(a);
  a.click();
  video.srcObject = stream;
  video.play();
}

async function init() {
  stream = await navigator.mediaDevices.getUserMedia({
    audio: false,
    video: { width: 480, height: 270 },
  });
  video.srcObject = stream;
  video.play();
}

init();
recordStartButton.addEventListener("click", handleStart);
