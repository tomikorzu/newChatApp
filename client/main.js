import { io } from "https://cdn.socket.io/4.3.2/socket.io.esm.min.js";
const socket = io();

const chat = document.getElementById("chat");
const form = document.getElementById("form");
const message = document.getElementById("message");
const submitBtn = document.getElementById("submit-btn");
const messagesSended = document.getElementById("messages-sended");

let username = prompt("Enter your username:"); // Pedir al usuario su nombre
socket.emit("set username", username); // Enviar el nombre de usuario al servidor

socket.on("chat message", (data) => {
  const message = data.msg;
  const timeSent = data.timeSent;
  const user = data.username; // Acceder al nombre de usuario
  const messageClass =
    data.id === socket.id ? "message-own" : "message-received"; // Diferenciar mensajes propios
  const item = `<li class="${messageClass}"><span class="message-text">${user}: ${message}</span> <span class="real-time">${timeSent}</span></li>`;
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
