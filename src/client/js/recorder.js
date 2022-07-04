import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordStartButton = document.getElementById("recordStartButton");
const video = document.getElementById("preview");
const recordDownloadButton = document.getElementById("recordDownloadButton");

const files = {
  input: "recording.webm",
  output: "output.mp4",
  thumbnail: "thumbnail.jpg",
};
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
  recordDownloadButton.disabled = false;
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
    video.width = 480;
    video.height = 270;
    video.loop = true;
    video.play();
  };
  recorder.start();
  videoRecorderTimeout = setTimeout(() => {
    handleStop();
  }, 10000);
}

function downloadFile(fileUrl, fileName) {
  const a = document.createElement("a");
  a.href = fileUrl;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

async function handleDownload() {
  recordDownloadButton.innerText = "Transcoding...";
  recordDownloadButton.disabled = true;
  recordDownloadButton.removeEventListener("click", handleDownload);

  // Transcode Video using ffmpeg web assembly
  const ffmpeg = createFFmpeg({
    corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
    log: true,
  });

  await ffmpeg.load();
  ffmpeg.FS("writeFile", files.input, await fetchFile(videoFile));
  await ffmpeg.run("-i", files.input, "-r", "60", files.output);
  await ffmpeg.run(
    "-i",
    files.input,
    "-ss",
    "00:00:00",
    "-frames:v",
    "1",
    files.thumbnail,
  );

  const mp4File = ffmpeg.FS("readFile", files.output);
  const thumFile = ffmpeg.FS("readFile", files.thumbnail);

  const mp4Blob = new Blob([mp4File.buffer], { type: "video/mp4" });
  const thumBlob = new Blob([thumFile.buffer], { type: "image/jpg" });

  const mp4Url = URL.createObjectURL(mp4Blob);
  const thumUrl = URL.createObjectURL(thumBlob);

  const curDate = new Date().getTime();
  downloadFile(mp4Url, `recoding_${curDate}.mp4`);
  downloadFile(thumUrl, `thumbnail_${curDate}.jpg`);

  ffmpeg.FS("unlink", files.input);
  ffmpeg.FS("unlink", files.output);
  ffmpeg.FS("unlink", files.thumbnail);

  URL.revokeObjectURL(videoFile);
  URL.revokeObjectURL(mp4Url);
  URL.revokeObjectURL(thumUrl);

  recordDownloadButton.disabled = true;
  recordDownloadButton.innerText = "Download";

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
