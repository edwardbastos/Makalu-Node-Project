const socketClient = io();
const nombreUsuario = document.getElementById("username");
const chatBox = document.getElementById("chatBox");
const sendButton = document.getElementById("sendButton");
const chatPanel = document.getElementById("chatContent");
const loadingText = document.getElementById("loadingText");

loadingText.innerHTML = "Obteniendo mensajes...";

let user;
const socket = io({
  autoConnect: false,
});

fetchUser();

chatBox.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    if (chatBox.value.trim().length > 0) {
      const messageBody = {
        userId: user.id,
        username: user.name,
        body: chatBox.value.trim(),
      };
      socket.emit("chat:message", messageBody);
      chatBox.value = "";
    }
  }
});

sendButton.addEventListener("click", (event) => {
  if (chatBox.value.trim().length > 0) {
    const messageBody = {
      userId: user.id,
      username: user.name,
      role: user.role,
      body: chatBox.value.trim(),
    };
    socket.emit("chat:message", messageBody);
    chatBox.value = "";
  }
});

//SOCKET EVENTS

socket.on("chat:logMessage", (message) => {
  const p = document.createElement("p");
  p.innerHTML =
    user.id === message.userId
      ? message.body
      : `${message.username} dice: ${message.body}`;
  chatPanel.appendChild(p);
});

//FUNCTIONS
async function fetchUser() {
  const response = await fetch("/api/sessions/current");
  if (response.status === 200) {
    const result = await response.json();
    user = result.payload;
    console.log(user.payload);
    await fetchMessages();
    await socket.connect();
    socketClient.emit("join", user);
    loadingText.innerHTML = "";
    nombreUsuario.innerHTML = `Hola ${user.name}`;
  } else {
    loadingText.innerHTML =
      "Para poder participar en el chat, debes estar logueado";
    chatBox.setAttribute("disabled", true);
    sendButton.setAttribute("disabled", true);
  }
}

async function fetchMessages() {
  const response = await fetch(`/api/chat`);
  if (response.status === 200) {
    const result = await response.json();
    const messages = result.payload;
    if (messages.length > 0) {
      const fragment = document.createDocumentFragment();
      for (const message of messages) {
        const p = document.createElement("p");
        p.innerHTML =
          user.id === message.userId
            ? message.body
            : `${message.username} dice: ${message.body}`;
        fragment.appendChild(p);
      }
      chatPanel.appendChild(fragment);
      loadingText.remove();
    } else {
      loadingText.innerHTML =
        "Aún no hay mensajes  ¡Sé el primero en participar";
    }
  } else {
    loadingText.innerHTML =
      "Error al obtener los mensajes previos, aún puedes participar";
  }
}
