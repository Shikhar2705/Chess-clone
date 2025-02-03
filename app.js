const express = require('express');
const http = require('http');
const socket = require('socket.io');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');

const app = express();

const server = http.createServer(app);

const io = socket(server);

const chess = new Chess();

let players = {};
let currPlayer = "W";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
    res.render("index", {title : "Chess.com"});
});

io.on("connection", function(socket){
    console.log("Connected");
})

server.listen(3000, function () {
    console.log("Listening on port 3000");
});