const commentForm = document.getElementById("comment-form");
const videoContainer = document.getElementById("videoContainer");
let handelComments = document.querySelectorAll("div[name='handleComment']");
const videoComments = document.querySelector("#video-comments");

function addComment(text, id) {
  const videoCommetsUl = videoComments.querySelector("ul");
  const newCommentLi = document.createElement("li");
  const newCommentText = document.createElement("span");

  const newCommentDiv = document.createElement("div");
  const newCommentEdit = document.createElement("span");
  const newCommentEditIcon = document.createElement("i");
  const newCommentDelete = document.createElement("span");
  const newCommentDeleteIcon = document.createElement("i");

  newCommentLi.className = "video-comments__comment";
  newCommentLi.dataset.id = id;
  newCommentText.innerText = text;

  newCommentEditIcon.className = "fas fa-pen";
  newCommentDeleteIcon.className = "fas fa-trash-alt";
  newCommentDiv.setAttribute("name", "handleComment");

  newCommentLi.appendChild(newCommentText);
  newCommentEdit.appendChild(newCommentEditIcon);
  newCommentDelete.appendChild(newCommentDeleteIcon);
  newCommentDiv.appendChild(newCommentEdit);
  newCommentDiv.appendChild(newCommentDelete);
  newCommentLi.appendChild(newCommentDiv);
  videoCommetsUl.prepend(newCommentLi);
  newCommentEdit.addEventListener("click", handleCommentEdit);
  newCommentDelete.addEventListener("click", handleCommentDelete);
}

// TODO: comment CRUD challenge
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
