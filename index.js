import express from "express";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";
import { get } from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const ADMIN = "Admin";

const app = express();

app.use(express.static(path.join(__dirname, "public")));

const expressServer = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(expressServer, {
  cors: {
    origin:
      process.env.NODE_ENV === "production"
        ? "https://chat-app-socket-io.herokuapp.com"
        : "http://localhost:3000",
  },
});

const usersState = {
  users: [],
  setUsers: function (newUsersArray) {
    this.users = newUsersArray;
  },
};

// const io = new server(expressServer, {
//     cors: {
//         origin: process.env.NODE_ENV === 'production' ? false: ['https://chat-app-socket-io.herokuapp.com' : 'http://localhost:3000'],
//     }
// })

io.on("connection", (socket) => {
  console.log(`User ${socket.id} connected`);
  socket.on("message", (data) => {
    // Aquí puedes retransmitir el mensaje a todos los usuarios en la sala, por ejemplo:
    io.to(data.room).emit("message", data);
  });

  socket.emit("message", buildMessage(ADMIN, "Welcome to the chat app!"));

  socket.on("enterRoom", ({ name, room }) => {
    const prevRoom = getUser(socket.id)?.room;

    if (prevRoom) {
      socket.leave(prevRoom);
      io.to(prevRoom).emit(
        "message",
        buildMessage(ADMIN, `${name} has left the room`)
      );
    }
    const user = activateUser(socket.id, name, room);

    if (prevRoom) {
      io.to(prevRoom).emit("userList", {
        users: getUsersInRoom(prevRoom),
      });
    }

    socket.join(user.room);

    socket.emit(
      "message",
      buildMessage(ADMIN, `You have joined to the ${room} chat room `)
    );

    socket.broadcast
      .to(user.room)
      .emit("message", buildMessage(ADMIN, `${user.name} has joined the room`));

    io.to(user.room).emit("userList", {
      users: getUsersInRoom(user.room),
    });

    io.emit("roomList", {
      rooms: getAllActiveRooms(),
    });
  });
  socket.on("disconnect", () => {
    const user = getUser(socket.id);
    userLeavesApp(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        buildMessage(ADMIN, `${user.name} has left the room`)
      );
      io.to(user.room).emit("userList", {
        users: getUsersInRoom(user.room),
      });
      io.emit("roomList", {
        rooms: getAllActiveRooms(),
      });
    }
    console.log(`User ${socket.id} disconnected`);
  });

  socket.on("message", ({ name, text }) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      io.to(room).emit("message", buildMessage(name, text));
    }
  });

  socket.on("activity", (name) => {
    const room = getUser(socket.id)?.room;
    if (room) {
      socket.broadcast.to(room).emit("activity", name);
    }
  });
});

function buildMessage(name, text) {
  return {
    name,
    text,
    time: new Intl.DateTimeFormat("default", {
      hour: "numeric",
      minute: "numeric",
    }).format(new Date()), // Correcto
  };
}

// user functions

function activateUser(id, name, room) {
  const user = { id, name, room };
  usersState.setUsers([
    ...usersState.users.filter((user) => user.id !== id),
    user,
  ]);
  return user;
}

function userLeavesApp(id) {
  usersState.setUsers(usersState.users.filter((user) => user.id !== id));
}

function getUser(id) {
  return usersState.users.find((user) => user.id === id);
}

function getUsersInRoom(room) {
  return usersState.users.filter((user) => user.room === room);
}

function getAllActiveRooms() {
  return Array.from(new Set(usersState.users.map((user) => user.room)));
}
