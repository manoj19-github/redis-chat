const express =require("express");
const app = express();
const PORT=5000;
const http = require("http");
const { Server } = require('socket.io');
app.set("view engine","ejs");

const server = http.createServer(app);
const io = new Server(server);


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("message",({message,from})=>{
        console.log({message,from});
        io.emit("message",{from,message});

    })
});


app.get("/",(req,res)=>{
    
    res.render("index");
});
app.get("/chat",(req,res)=>{
    const username = req.query.username;

    res.render("chat",{username});
    setTimeout(()=>{
        io.emit("joined",username)
    },3000)
    
});


server.listen(PORT,()=>{
    console.log("SERVER LISTENING AT : ",PORT);
});