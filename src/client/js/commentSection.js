const commentForm = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");

function handleComment(event) {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  textarea.value = "";
}

if (commentForm) {
  commentForm.addEventListener("submit", handleComment);
}
