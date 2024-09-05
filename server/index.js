import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

dotenv.config();
const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app);
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 10000,
  },
});

const db = createClient({
  url: "libsql://caring-ganymede-tomikorzu.turso.io",
  authToken: process.env.TURSO_TOKEN,
});

function setTimer() {
  let time = new Date();
  let hours = time.getHours();
  let minutes = time.getMinutes();
  let ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12;
  minutes = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutes + " " + ampm;
  return strTime;
}

// Crear la tabla con la columna `timeSent` si no existe
await db.execute(
  `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT, timeSent TEXT, username TEXT);`
);

io.on("connection", async (socket) => {
  console.log("A user has connected");

  socket.on("set username", (username) => {
    socket.username = username;
    console.log(`${username} has connected`);
  });

  // Enviar los mensajes anteriores al nuevo usuario
  let result;
  try {
    result = await db.execute({
      sql: `SELECT content, timeSent, username FROM messages`,
    });

    if (result && result.rows) {
      result.rows.forEach((row) => {
        socket.emit("chat message", {
          msg: row.content,
          timeSent: row.timeSent,
          username: row.username,
          id: socket.id,
        });
      });
    }
  } catch (e) {
    console.error(e);
  }

  socket.on("chat message", async (msg) => {
    let timeSent = setTimer();
    let username = socket.username || "Anonymous";

    if (msg && timeSent && username) {
      try {
        await db.execute({
          sql: `INSERT INTO messages(content, timeSent, username) VALUES (:msg, :timeSent, :username)`,
          args: { msg, timeSent, username },
        });

        io.emit("chat message", { msg, timeSent, username, id: socket.id });
      } catch (e) {
        console.error("Error inserting message:", e);
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`${socket.username || "A user"} has disconnected`);
  });
});

app.use(express.static(process.cwd() + "/client"));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + "/client/index.html");
});

app.use(logger("dev"));

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
