const commentForm = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");

function addComment(text, id) {
  const videoComments = document.querySelector("#video-comments ul");
  const newCommentLi = document.createElement("li");
  const newCommentText = document.createElement("span");
  const newCommentDelete = document.createElement("span");

  newCommentLi.className = "video-comments__comment";
  newCommentLi.dataset.id = id;
  newCommentText.innerText = text;
  newCommentDelete.innerText = "❌";

  newCommentLi.appendChild(newCommentText);
  newCommentLi.appendChild(newCommentDelete);

  videoComments.prepend(newCommentLi);
}

// TODO: comment CRUD challenge
async function handleComment(event) {
  event.preventDefault();
  const textarea = commentForm.querySelector("textarea");
  const text = textarea.value;
  const videoId = videoContainer.dataset.id;
  if (text === "") {
    return;
  }
  const response = await fetch(`/api/videos/${videoId}/comment`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text }),
  });
  if (response.status == 201) {
    textarea.value = "";
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
}

if (commentForm) {
  commentForm.addEventListener("submit", handleComment);
}
