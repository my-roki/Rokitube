const commentForm = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");
let handelComments = document.querySelectorAll("div[name='handleComment']");
const videoComments = document.querySelector("#video-comments");

function commentComponent(
  text,
  newCommentId,
  newUsername,
  newAvatar,
  newCreatedAt
) {
  const li = document.createElement("li");
  li.className = "video-comments__comment";
  li.dataset.id = newCommentId;

  const result = `<div class="video-comments__payloads">
    <img src="${newAvatar}" />
    <div class="video-comments__contents">
      <div class="video-comments__commentinfo">
        <span>${newUsername}</span>
        <span class="video-comments__createdAt"> ${newCreatedAt}</span>
      </div>
      <div class="video-comments__text">
        <span id="comments-text">${text}</span>
      </div>
      <div class="comment__like">
        <i class="far fa-thumbs-up"></i>
        <i class="far fa-thumbs-down"></i>
        <span> report </span>
      </div>
    </div>
  </div>
  <div name="handleComment">
    <span id="comments-edit">
      <i class="fas fa-pen"></i>
    </span>
    <span id="comments-delete">
      <i class="fas fa-trash-alt"></i>
    </span>
  </div>`;

  li.innerHTML = result;
  return li;
}

function addComment(text, newCommentId, newUsername, newAvatar, newCreatedAt) {
  const ul = videoComments.querySelector("ul");
  const li = commentComponent(
    text,
    newCommentId,
    newUsername,
    newAvatar,
    newCreatedAt
  );
  ul.prepend(li);
  const spanEdit = li.querySelector("#comments-edit");
  const spanDelete = li.querySelector("#comments-delete");

  spanEdit.addEventListener("click", handleCommentEdit);
  spanDelete.addEventListener("click", handleCommentDelete);
}

async function handleCommentCreate(event) {
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
    const { newCommentId, newUsername, newAvatar, newCreatedAt } =
      await response.json();
    addComment(text, newCommentId, newUsername, newAvatar, newCreatedAt);
  }
}

async function updateComment(editForm, li, text, commentId) {
  if (text === "") {
    handelCancel(editForm, li);
    return;
  }
  const response = await fetch(`/api/videos/${commentId}/comment`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text, commentId }),
  });
  if (response.status == 200) {
    videoComments.removeChild(editForm);
    li.querySelector("#comment-text").innerText = text;
    li.style = "";
  }
}

function handelCancel(editForm, li) {
  videoComments.removeChild(editForm);
  li.style = "";
}

function handleCommentEdit(event) {
  const li = event.target.parentElement.parentElement.parentElement;
  const editForm = document.createElement("form");
  const editTextArea = document.createElement("textarea");
  const saveButton = document.createElement("button");
  const cancelButton = document.createElement("button");

  editForm.className = "comment-form nform";
  saveButton.innerText = "Save";
  cancelButton.innerText = "Cancel";
  editTextArea.innerText = li.querySelector("#comment-text").innerText;

  editForm.appendChild(editTextArea);
  editForm.appendChild(saveButton);
  editForm.appendChild(cancelButton);

  li.style.display = "none";
  videoComments.prepend(editForm);

  cancelButton.addEventListener("click", handelCancel);
  editForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = editTextArea.value;
    const id = li.dataset.id;
    updateComment(editForm, li, text, id);
  });
}

async function handleCommentDelete(event) {
  const li = event.target.parentElement.parentElement.parentElement;
  console.log(li);
  const {
    dataset: { id },
  } = li;
  await fetch(`/api/videos/${id}/comment`, { method: "DELETE" });
  li.remove();
}

if (commentForm) {
  commentForm.addEventListener("submit", handleCommentCreate);
}
if (handelComments) {
  handelComments.forEach((handleComment) => {
    const editButton = handleComment.firstChild;
    const deleteButton = handleComment.lastChild;
    editButton.addEventListener("click", handleCommentEdit);
    deleteButton.addEventListener("click", handleCommentDelete);
  });
}
