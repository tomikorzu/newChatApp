import express from "express";
import logger from "morgan";
import { Server } from "socket.io"
import { createServer } from 'node:http'

const port = process.env.PORT ?? 3000;

const app = express();
const server = createServer(app)
const io = new Server(server, {
  connectionStateRecovery: {
    maxDisconnectionDuration: 10000
  }
})

io.on('connection', (socket) =>{
    console.log('A user has connected')

    socket.on('disconnect', () =>{
        console.log('A user has disconnected')
    })

    socket.on('chat message', (msg) =>{
      io.emit('chat message', msg)
    })
})

app.use(express.static(process.cwd() + '/client'));

app.get("/", (req, res) => {
  res.sendFile(process.cwd() + '/client/index.html');
});

app.use(logger("dev"));


server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
