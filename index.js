const express =require("express");
const app = express();
const PORT=5000;
const http = require("http");
const redis= require("redis");

const {config} = require("dotenv");
const { Server } = require('socket.io');
config();
app.set("view engine","ejs");

const server = http.createServer(app);
const io = new Server(server);
const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  const sendMessage = async (socket)=>{
    console.log("hit");
    try{
        
        const data = await redisClient.LRANGE("messages",0,-1)
        console.log('data: ', data);

    }catch(error){
        console.log("error : ",error);
    }
 
  }

  redisClient.on("error", (error) => console.log("error occured : ", error));
  if (!redisClient.isOpen) {
    redisClient.connect();
  }


io.on('connection', (socket) => {
    console.log('a user connected');
    socket.on("message",async({message,from})=>{
        await redisClient.RPUSH("messages",`${from}:${message}`);
        await sendMessage(socket);
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