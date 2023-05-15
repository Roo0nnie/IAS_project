var express = require("express")
var app = express();

const http = require('http');
const server = require('http').Server(app);
const io = require('socket.io')(server);
const PORT = process.env.PORT || 8000;

const port = 8000;
let socketsConected = new Set()

const defURL = "http://localhost:8000/"

app.use(express.static('public'));
app.set("view engine", "ejs");

app.get("/app", function(req, res){
res.render("pages/app", {socketURL:defURL});
});

app.get("/login", function(req, res){
    res.render("pages/login", {socketURL:defURL});
});

io.on("connection",function(socket){
    socket.on("newuser",function(username){
        socket.broadcast.emit("update", username + " joined the convo")
    });
    
    socket.on("exituser",function(username){
      socket.broadcast.emit("update", username + " left the convo")
    });
  
    socket.on('message', (data) => {
      socket.broadcast.emit('chat-message', data)
    });
  
    socket.on("chat",function(message){
      socket.broadcast.emit("chat", message);
    });
  });
  
  server.listen(port, () => {
    console.log(`RJM app listening on port ${port}`)
  })


