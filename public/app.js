const socket = io("http://localhost:3000");

const inputName = document.getElementById("name");
const inputRoom = document.getElementById("room");
const inputMsg = document.getElementById("message");
const userList = document.querySelector(".user-list");
const roomList = document.querySelector(".room-list");
const activity = document.querySelector(".activity");
const chatDisplay = document.querySelector(".chat-display");

function sendMessage (e) {
    e.preventDefault();
    if (inputName.value  && inputMsg.value && inputRoom.value ) {
        socket.emit("message", {
            'name': inputName.value,
             'text': inputMsg.value
    });
        inputMsg.value = "";
    }
    inputMsg.focus();
}

