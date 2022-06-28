console.log("video player");
const videoContainer = document.getElementById("videoContainer");
const video = document.querySelector("video");
const videoController = document.getElementById("videoController");
const playButton = document.getElementById("play");
const playButtonIcon = playButton.querySelector("i");
const muteButton = document.getElementById("mute");
const muteButtonIcon = muteButton.querySelector("i");
const time = document.getElementById("time");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeline = document.getElementById("timeline");
const fullScreenButton = document.getElementById("fullscreen");
const fullScreenButtonIcon = fullScreenButton.querySelector("i");

const defaultVolume = 0.3;
let inputVolume = defaultVolume;
let changeVolume = defaultVolume;
video.volume = defaultVolume;

let videoPlayStatus = false;
let setVideoPlayStatus = false;
let controlsLeaveTimeout = null;
let controlsMoveTimeout = null;

function formatDate(targetSeconds) {
  const totalSeconds = parseInt(targetSeconds, 10);
  let hours = Math.floor(totalSeconds / 3600);
  let minutes = Math.floor((totalSeconds - hours * 3600) / 60);
  let seconds = totalSeconds - hours * 3600 - minutes * 60;

  hours = String(hours).padStart(2, "0");
  minutes = String(minutes).padStart(2, "0");
  seconds = String(seconds).padStart(2, "0");

  if (hours === "00") {
    return `${minutes}:${seconds}`;
  }
  return `${hours}:${minutes}:${seconds}`;
}

function handlePlayButton(event) {
  video.paused ? video.play() : video.pause();
  playButtonIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
}

function handleMuteButton(event) {
  video.muted = video.muted ? false : true;
  muteButtonIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted
    ? "0"
    : inputVolume < changeVolume
    ? changeVolume
    : inputVolume;
  video.volume = volumeRange.value;
}

function handleInputVolumeRange(event) {
  const {
    target: { value },
  } = event;
  if (video.muted) {
    video.muted = false;
    muteButtonIcon.classList = "fas fa-volume-mute";
  }
  if (Number(value) === 0) {
    muteButtonIcon.classList = "fas fa-volume-mute";
    video.muted = true;
  }
  inputVolume = value;
  video.volume = value;
  muteButtonIcon.classList = "fas fa-volume-up";
}

function handleChangeVolumeRange(event) {
  const {
    target: { value },
  } = event;
  if (Number(value) === 0) {
    muteButtonIcon.classList = "fas fa-volume-mute";
    video.muted = true;
  } else {
    changeVolume = value;
  }
}

function handleCurrentTime() {
  currentTime.innerText = formatDate(Math.floor(video.currentTime));
  timeline.value = Math.floor(video.currentTime);
}

function handleTotalTime() {
  totalTime.innerText = formatDate(Math.floor(video.duration));
  timeline.max = Math.floor(video.duration);
}

function handleTimelineInput(event) {
  const {
    target: { value },
  } = event;
  if (!setVideoPlayStatus) {
    videoPlayStatus = video.paused ? false : true;
    setVideoPlayStatus = true;
  }
  video.pause();
  video.currentTime = value;
}

const handleTimelineChange = () => {
  videoPlayStatus ? video.play() : video.pause();
  setVideoPlayStatus = false;
};

function handleGetFullScreen(event) {
  const fullscreen = document.fullscreenElement;
  if (fullscreen) {
    document.exitFullscreen();
    fullScreenButtonIcon.classList = "fas fa-expand";
  } else {
    videoContainer.requestFullscreen();
    fullScreenButtonIcon.classList = "fas fa-compress";
  }
}

function handleMouseMove(event) {
  if (controlsLeaveTimeout) {
    clearTimeout(controlsLeaveTimeout);
    controlsLeaveTimeout = null;
  }

  if (controlsMoveTimeout) {
    clearTimeout(controlsMoveTimeout);
    controlsMoveTimeout = null;
  }

  videoController.classList.add("showing");
  controlsMoveTimeout = setTimeout(() => {
    videoController.classList.remove("showing");
  }, 3000);
}

function handleMouseLeave(event) {
  controlsLeaveTimeout = setTimeout(() => {
    videoController.classList.remove("showing");
  }, 3000);
}

function keyboardShortcut(event) {
  switch (event.keyCode) {
    case 32: // space
      event.preventDefault();
      handlePlayButton();
      break;
    case 77: // m
      handleMuteButton();
      break;
    case 70: // f
      handleGetFullScreen();
      break;
    case 39: // right arrow
      handleMouseMove();
      video.currentTime = video.currentTime + 5;
      break;
    case 37: // left arrow
      handleMouseMove();
      video.currentTime = video.currentTime - 5;
      break;
  }
}

playButton.addEventListener("click", handlePlayButton);
muteButton.addEventListener("click", handleMuteButton);
volumeRange.addEventListener("input", handleInputVolumeRange);
volumeRange.addEventListener("change", handleChangeVolumeRange);
video.addEventListener("loadeddata", handleTotalTime);
video.addEventListener("timeupdate", handleCurrentTime);
timeline.addEventListener("input", handleTimelineInput);
timeline.addEventListener("change", handleTimelineChange);
fullScreenButton.addEventListener("click", handleGetFullScreen);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);

video.addEventListener("click", handlePlayButton);
window.addEventListener("keydown", keyboardShortcut);
