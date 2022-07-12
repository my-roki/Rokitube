const commentForm = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");
let handelComments = document.querySelectorAll("div[name='handleComment']");
const videoComments = document.querySelector("#video-comments");

function addComment(text, id) {
  const ul = videoComments.querySelector("ul");
  const li = document.createElement("li");
  const newText = document.createElement("span");

  const div = document.createElement("div");
  const spanEdit = document.createElement("span");
  const spanEditIcon = document.createElement("i");
  const spanDelete = document.createElement("span");
  const spanDeleteIcon = document.createElement("i");

  li.className = "video-comments__comment";
  li.dataset.id = id;
  newText.innerText = text;

  spanEditIcon.className = "fas fa-pen";
  spanDeleteIcon.className = "fas fa-trash-alt";
  div.setAttribute("name", "handleComment");

  li.appendChild(newText);
  spanEdit.appendChild(spanEditIcon);
  spanDelete.appendChild(spanDeleteIcon);
  div.appendChild(spanEdit);
  div.appendChild(spanDelete);
  li.appendChild(div);
  ul.prepend(li);

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
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
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
    li.firstChild.innerText = text;
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

  editForm.className = "comment-form";
  saveButton.innerText = "Save";
  cancelButton.innerText = "Cancel";
  editTextArea.innerText = li.firstChild.innerText;

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
