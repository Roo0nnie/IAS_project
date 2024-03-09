var express = require("express");
var app = express();
const path = require("path");

const http = require("http");
const { count } = require("console");
const server = require("http").Server(app);
const io = require("socket.io")(server);
const PORT = process.env.PORT || 8000;

app.use(express.static(path.join(__dirname + "/public")));

const port = 8000;
let socketsConected = new Set();

const defURL = "http://localhost:8000/";

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get("/app", function (req, res) {
  res.render("pages/app", { socketURL: defURL });
});

// app.get("/login", function (req, res) {
//   res.render("pages/login", { socketURL: defURL });
// });

io.on("connection", function (socket) {
  socket.on("newuser", function (username) {
    socket.username = username;
    socket.broadcast.emit("update", username + " joined the convo");
    socketsConected.add(socket.id);
    io.emit("countUser", socketsConected.size);
  });

  socket.on("message", data => {
    socket.broadcast.emit("chat-message", data);
  });

  socket.on("chat", function (message) {
    socket.broadcast.emit("chat", message);
  });

  socket.on("typing", function () {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("stopTyping", function () {
    socket.broadcast.emit("stopTyping", socket.username);
  });

  socket.on("disconnect", function () {
    if (socket.username) {
      const username = socket.username;
      socket.broadcast.emit("update", username + " left the convo");
      socketsConected.delete(socket.id);
      io.emit("countUser", socketsConected.size);
    }
  });
});

server.listen(port, () => {
  console.log(`RJM app listening on port ${port}`);
});
