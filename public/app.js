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
socket.on("activity", (data) => {
  activity.textContent = "";
  const { name, text, time } = data;
  const li = document.createElement("li");
  li.className = "post";
  if (name === inputName.value) li.className = "post post--left";
  if (name !== inputName.value && name !== "Admin")
    li.className = "post post--right";
  if (name !== "Admin") {
    li.innerHTML = `
        <div class="post__header ${
          name === nameInput.value
            ? "post__header--user "
            : "post__header--reply"
        }">
        <span class="post__header--name">${name}</span>
        <span class="post__header--time">${name}</span>
        </div>
        <div class="post__ text">${text}</div> 

      `;
  } else {
    li.innerHTML = `
        <div class="post__text">${text}</div> 
        

      `;
  }
  document.querySelector(".chat-display").appendChild(li);

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

function showUSers(users) {
  userList.textContent = "";
  if (users) {
    users.innerHTML = `<em>Users in ${chatRoom.value}:</em>`;
    users.foreach((user, i) => {
      userList.textContent += `${user.name}`;
      if (users.length > 1 && i !== users.length - 1) {
        userList.textContent += ",";
      }
    });
  }
}

function showRooms(rooms) {
  roomList.textContent = "";
  if (rooms) {
    roomList.innerHTML = `<em>Active Rooms:</em>`;
    rooms.foreach((room, i) => {
      roomList.textContent += `${room}`;
      if (rooms.length > 1 && i !== rooms.length - 1) {
        roomList.textContent += ",";
      }
    });
  }
}
