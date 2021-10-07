const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
app.use(express.static(path.join(__dirname, "public")));

const botName = "Training Analytics ";
let = msgs = [];
// Run when client connects
io.on("connection", (socket) => {
  
  socket.on("joinRoom", ({ username, room, gest }) => {
    const user = userJoin(socket.id, username, room, gest);
    
    socket.join(user.room);

    // Welcome current user
    socket.emit("message", formatMessage(botName, "Seja bem-vindo!", 0, 0, user.room));

  
    // Broadcast when a user connects
    socket.broadcast.to(user.room).emit("message",
        formatMessage(botName, `${user.username} entrou no chat.`, 0, 0, user.room)
      );

   

    // Send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });
    
  socket.emit("prevMsg", msgs);
  

  // Listen for chatMessage
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    msgs.push(formatMessage(user.username, msg.msg, msg.id, msg.gest, user.room));

    var fs = require('fs');
    fs.writeFile ("conversa"+user.room+".json", JSON.stringify(msgs), function(err) {
    if (err) throw err;
    console.log('complete');
    });

    io.to(user.room).emit(
      "message",
      formatMessage(user.username, msg.msg, msg.id, msg.gest, user.room)
    );
  });

  // Runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(botName, `${user.username} saiu do chat.`, 0, 0, user.room)
      );

      // Send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
