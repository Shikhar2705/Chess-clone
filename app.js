const express = require('express');
const http = require('http');
const socket = require('socket.io');
const { Chess } = require('chess.js');
const path = require('path');
const { title } = require('process');
const { log } = require('console');

const app = express();

const server = http.createServer(app);

const io = socket(server);

const chess = new Chess();

let players = {};
let currPlayer = "w";

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.get('/',(req,res)=>{
    res.render("index", {title : "Chess.com"});
});

io.on("connection", function(socket){
    console.log("Connected");

    if (!players.white) {
        players.white = socket.id;
        socket.emit("PlayerRole", "w");
    }
    else if (!players.black) {
        players.black = socket.id;
        socket.emit("PlayerRole", "b");
    }
    else {
        socket.emit("SpectatorRole");
    }
    
    socket.on("disconnect" , function (){
        if (socket.id === players.white) {
            delete players.white;
        }
        else if (socket.id === players.black) {
            delete players.black;
        }
        console.log("Disconnected");
    });

    socket.on("move", (move)=>{
        try{
            if (chess.turn() === "w" && socket.id !== players.white) return ;
            if (chess.turn() === "b" && socket.id !== players.black) return ;

            const result = chess.move(move);

            if (result) {
                currPlayer = chess.turn();
                io.emit("move", move);
                io.emit("boardState", chess.fen());
            }
            else {
                console.log("Invalid move : ", move);
                socket.emit("invalidMove", move);
            }
        } catch(err){
            console.log(err);
            socket.emit("invalidMove", move);
        }
    })
})

server.listen(3000, function () {
    console.log("Listening on port 3000");
});