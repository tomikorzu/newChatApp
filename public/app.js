const socket = io("http://localhost:3000");

const inputName = document.getElementById("name");
const inputRoom = document.getElementById("room");
const inputMsg = document.getElementById("message");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const activity = document.querySelector(".activity");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage(e) {
  e.preventDefault();
  if (inputName.value && inputMsg.value && inputRoom.value) {
    socket.emit("message", {
      name: inputName.value,
      text: inputMsg.value,
    });
    inputMsg.value = "";
  }
  inputMsg.focus(); 
}
function enterRoom(e) {
  e.preventDefault();
  if (inputName.value && inputRoom.value) {
    socket.emit("enterRoom", {
      name: inputName.value,
      room: inputRoom.value,
    });
  }
}
document.querySelector(".form-msg").addEventListener("submit", sendMessage);
document.querySelector(".form-join").addEventListener("submit", enterRoom);

inputMsg.addEventListener("keypress", function () {
  socket.emit("activity", inputName.value);
});

//Listen for messages 
socket.on('activity', (name) => {
    activity.textContent 
})