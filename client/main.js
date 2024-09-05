import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const messagesSended = document.getElementById("messages-sended");

socket.on("chat message", (data) => {
  const message = data.msg; // Acceder al mensaje
  const timeSent = data.timeSent; // Acceder a la hora
  const item = `<li class="message-received"><span class="message-text">${message}</span> <span class="real-time">${timeSent}</span></li>`;
  messagesSended.insertAdjacentHTML("beforeend", item);
  scrollTo();
});

form.addEventListener("submit", function (e) {
  e.preventDefault();
  if (message.value) {
    socket.emit("chat message", message.value);
    message.value = "";
  }
});

function scrollTo() {
  messagesSended.scrollTop = messagesSended.scrollHeight;
}
