const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const dotenv = require('dotenv')

dotenv.config();
const app = express();
const server = http.createServer(app);
const cors = require('cors');

const PORT = process.env.PORT || 5000;
app.use(cors());
const io = socketIO(server, {
  cors: {
    origin: process.env.ORIGIN_URL,
    methods: ["GET", "POST"]
  }
});

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods", "GET, HEAD, OPTIONS, POST, PUT, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 10, 0, Math.random() * (-10)];
};

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16);
};

io.on("connection", (socket) => {
  console.log("user connected");

  characters.push({
    value: {
      moveForward: false,
      moveBackward: false,
      moveRight: false,
      moveLeft: false,
      jump: false,
      shift: false,
    },
    id: socket.id,
    angle: 0,
    position: generateRandomPosition(),
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
  });

  socket.emit("hello");

  io.emit("characters", characters);

  socket.on("move", (value) => {
    console.log("Value", value)
    console.log("Moved", socket.id)
    const character = characters.find(
      (character) => character.id === socket.id
    );
    //character.angle = angle;
    character.value = value;
    io.emit("characters", characters);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");

    characters.splice(
      characters.findIndex((character) => character.id === socket.id),
      1
    );
    io.emit("characters", characters);
  });
});


server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
