import express from "express";
import logger from "morgan";
import { Server } from "socket.io";
import { createServer } from "node:http";
import dotenv from "dotenv";
import { createClient } from "@libsql/client";

// quiero agregar el horario en el que se envio el mensaje y el nombre del usuario
// quiero agregar un boton para borrar todos los mensajes
// quiero agregar un boton para borrar un mensaje en especifico
// quiero agregar un boton para editar un mensaje en especifico

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

await db.execute(
  `CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, content TEXT);`
);

io.on("connection", (socket) => {
  console.log("A user has connected");

  socket.on("disconnect", () => {
    console.log("A user has disconnected");
  });

  socket.on("chat message", async (msg) => {
    let timeSent = setTimer(); // Llamas a setTimer aquí
    let result;
    try {
      result = await db.execute({
        sql: `INSERT INTO messages(content) VALUES (:msg)`,
        args: { msg },
      });
    } catch (e) {
      console.error(e);
      return;
    }
    io.emit(
      "chat message",
      { msg, timeSent },
      result.lastInsertRowid.toString()
    );
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
