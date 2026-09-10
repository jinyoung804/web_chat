const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const messages = document.getElementById("messages");

function addMessage(message) {
  const li = document.createElement("li");
  li.textContent = message;
  messages.appendChild(li);
}

chatForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const message = chatInput.value.trim();
  if (!message) return;

  addMessage(message);

  chatInput.value = "";
  chatInput.focus();
});
