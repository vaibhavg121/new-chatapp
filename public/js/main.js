const chatForm = document.getElementById("chat-form");
const chatMessages = document.querySelector(".chat-messages");
const roomName = document.getElementById("room-name");
const userList = document.getElementById("users");

// using QS-querystring library to get username & the room name from the URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});
console.log("qs-->", username, room);

const socket = io();

// join chatroom
socket.emit("joinRoom", { username, room });

//room & users, 2 functions to get it:
socket.on("roomUsers", ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

//message from server
socket.on("message", (message) => {
  console.log(message);
  outputMessage(message);

  // scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

chatForm.addEventListener("submit", (e) => {
  e.preventDefault();

  //getting msg text from input form
  const msg = e.target.elements.msg.value;

  // console.log(msg);
  //Emitting msg to server
  socket.emit("chatMessage", msg);

  // clear input & focus on type field
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//output msg to DOM:
//creating that div and appending it to the DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<p class="meta">${message.username} <span>${message.time} </span></p>
  <p class="text">
    ${message.text}
  </p>`;
  document.querySelector(".chat-messages").appendChild(div);
}

//Adding room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

//Adding users to DOM
function outputUsers(users) {
  userList.innerHTML = "";
  users.forEach((user) => {
    const li = document.createElement("li");
    li.innerText = user.username;
    userList.appendChild(li);
  });
}
