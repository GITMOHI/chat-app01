const express = require("express");
const data = require("./data/data");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const cors = require("cors");

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");
const dayRoutes = require("./routes/dayRoutes");

const { notFound, errorHandler } = require("./middlewares/errorMiddleware");

const app = express();

dotenv.config();
connectDB();

app.use(
  cors({
    origin: "http://localhost:3000", // replace with your actual origin
  })
);

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/day", dayRoutes);

app.use(notFound); //when urls not matched...
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(5000, (req, res) => {
  console.log("listening on 5000");
});


//socket.io...
const io = require("socket.io")(server,{
  pingTimeout:60000,
  cors: {
    origin: "http://localhost:3000", // replace with your actual origin
  }
})

io.on('connection',(socket)=>{
  console.log("connected...to socket.io");

  // new room with user.id..
  socket.on('setup',(userData)=>{
    socket.join(userData._id);
    console.log('room');
    socket.emit('connected');
  })

  //joining a chat..
  socket.on('join chat',(room)=>{
    socket.join(room);
    console.log('room joined successfully..:'+room);
  })
  
  //typing..
  socket.on('typing',(room)=>{
    socket.in(room).emit('typing');
  })
  socket.on('stop typing',(room)=>{
    socket.in(room).emit('stop typing');
  })


  //new message...
  socket.on('new message',(newMessageRecieved)=>{
    console.log(newMessageRecieved);
    var chat = newMessageRecieved.chat;
    if(!chat.users)return console.log('no user...');

    chat.users.forEach(user=>{
      if(user._id===newMessageRecieved.sender._id)return;

      socket.in(user._id).emit('message recieved',newMessageRecieved)
    })

  });
})