const chatForm = document.getElementById("chat-form");
const count = document.getElementById("count");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// Get username and room from URL
const { username, room, gest, iduser } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();
let id_gene = iduser;
let gestor = gest;
// Join chatroom
socket.emit("joinRoom", { username, room, gest });

// Get room and users
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

 socket.on("prevMsg", function (msgs_) {
  // let qtd = msgs_.length;
  // console.log(qtd);
    for (msg_ of msgs_) {
      outputMessage(msg_);
    }
  });

// Message from server
socket.on("message", (message) => {
  // console.log(message);
  outputMessage(message);

  // Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  // Get message text
  let msg_ = e.target.elements.msg.value;

  var msg = {
    id: id_gene,
    msg: msg_.trim(),
    gest: gestor,
  };

  if (!msg_) {
    return false;
  }

  // Emit message to server
  socket.emit("chatMessage", msg);

  // Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

// Output message to DOM
function outputMessage(message) {  
  // count.append(msg_atual);
  if(message.room == room){
      // console.log(message.id);
      if (message.id){
        img_url = `<img src="https://www.wydawnictwoliteratura.pl/pub/skin/wyd-skin/img/avatar.png" width="50" height="50">`;
      }else{
        img_url = `<img src="https://icon-library.com/images/bot-icon/bot-icon-12.jpg" width="50" height="50">`;
      }
    const div = document.createElement("div");
    div.classList.add("message");
    if (message.id === id_gene) {
      div.classList.add("direito");
    }
    if (message.gest === "1") {
      div.classList.add("amarelo");
    }

    if (message.id !== id_gene) {
      const divimg = document.createElement("div");
      divimg.classList.add("img");
      divimg.innerHTML += img_url;
      div.appendChild(divimg);
    }

    const p = document.createElement("p");
    p.classList.add("meta");
    if (message.gest === "1") {
      p.innerText += message.username + " (moderador)";
    }else{
      p.innerText += message.username;
    }
    p.innerHTML += `<span class="span_data"> ${message.time} </span>`;
    div.appendChild(p);

    const para = document.createElement("p");
    para.classList.add("text");
    para.innerText = message.text;
    div.appendChild(para);
    document.querySelector(".chat-messages").appendChild(div);

    if (message.id === id_gene) {
      const divimg = document.createElement("div");
      divimg.classList.add("img_r");
      divimg.innerHTML += img_url;
      div.appendChild(divimg);
    }
  }
}

// Add room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}

//Prompt the user before leave chat room
// document.getElementById("leave-btn").addEventListener("click", () => {
//   const leaveRoom = confirm("Certeza que deseja sair?");
//   if (leaveRoom) {
//     // window.location = "../index.html";
//   } else {
//   }
// });
