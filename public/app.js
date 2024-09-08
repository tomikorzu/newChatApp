const socket = io("http://localhost:3000");

const inputName = document.getElementById("name");
const inputRoom = document.getElementById("room");
const inputMsg = document.getElementById("message");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const activity = document.querySelector(".activity");
const chatDisplay = document.querySelector(".chat-display");
const joinBtn = document.getElementById("join");
const main = document.querySelector("main");
const formJoin = document.querySelector(".form-join");
let chatRoom = "Room";

joinBtn.addEventListener("click", enterToChat);

window.onload = () => {
  showJoinMenu();
};

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
  socket.emit("activity", { name: inputName.value });
});

//Listen for messages
socket.on("message", (data) => {
  const { name, text } = data;
  const li = document.createElement("li");
  li.className = "post";
  if (name === inputName.value) li.className = "post post--left";
  else li.className = "post post--right";

  li.innerHTML = `
    <div class="post__header ${
      name === inputName.value ? "post__header--user" : "post__header--reply"
    }">
      <span class="post__header--name">${name}</span>
      </div>
      <div class="post__text">
        ${text}
        <span class="post__header--time">${new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}</span>
        </div>
  `;
  chatDisplay.appendChild(li);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
});

let activityTimer;
socket.on("activity", (name) => {
  activity.textContent = `${name} is typing...`;
  clearTimeout(activityTimer);
  activityTimer = setTimeout(() => {
    activity.textContent = "";
  }, 3000);
});

socket.on("userList", ({ users }) => {
  showUsers(users);
});

socket.on("roomList", ({ rooms }) => {
  showRooms(rooms);
});

function showUsers(users) {
  userList.textContent = ""; // Limpiamos la lista de usuarios
  if (users && Array.isArray(users)) {
    userList.innerHTML = `<em>Users in ${chatRoom}:</em>`;
    users.forEach((user, i) => {
      userList.textContent += `${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        userList.textContent += ",";
      }
    });
  }
}

function showRooms(rooms) {
  roomList.textContent = "";
  if (Array.isArray(rooms)) {
    rooms.forEach((room, i) => {
      roomList.textContent += `${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.textContent += ",";
      }
    });
  } else {
    console.error("rooms is not an array:", rooms);
  }
}

function applyBlur() {
  main.classList.add("apply-blur");
}
function quitBlur() {
  main.classList.remove("apply-blur");
}

function showJoinMenu() {
  applyBlur();
  formJoin.style.display = "flex";
  setTimeout(() => {
    formJoin.classList.add("show-form");
  }, 400);
}

function enterToChat() {
  quitBlur();
  formJoin.classList.remove("show-form");
  setTimeout(() => {
    formJoin.style.display = "none";
  }, 1000);
}
