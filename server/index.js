const express = require('express');
const {Server} = require('socket.io');
const http = require('http');
const cors = require('cors');

const app = express();
app.use(cors());
require('dotenv').config();

const port = process.env.PORT || 8000;

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: `http://localhost:${port}`,
        methods: ["GET", "POST"],
    }
});

io.on("connection", (socket) => {
    // console.log(socket.id); 
    socket.on("joinRoom", room => socket.join(room));
    socket.on("newMessage", ({newMessage, room}) => {
        console.log(room, newMessage);
        io.in(room).emit("getLatestMessage", newMessage);
    })
  });

app.get("/",(req,res)=> {
    res.send("Chat application started");
});

server.listen(port, ()=> {
    console.log(`Server is listening on port: ${port}`);
});