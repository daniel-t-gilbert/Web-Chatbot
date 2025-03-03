(function () {
  if (window.chatbotLoaded) return;
  window.chatbotLoaded = true;

  let chatWidget = document.createElement("div");
  chatWidget.id = "chat-widget";
  chatWidget.innerHTML = `
        <style>
            #chat-widget {
                position: fixed; bottom: 20px; right: 20px;
                width: 300px; height: 400px; background: white;
                border-radius: 10px; box-shadow: 0 4px 10px rgba(0,0,0,0.2);
                display: flex; flex-direction: column;
                font-family: Arial, sans-serif; overflow: hidden;
            }
            #chat-header {
                background: #007bff; color: white; padding: 10px;
                text-align: center; font-weight: bold;
            }
            #chat-body {
                flex: 1; padding: 10px; overflow-y: auto;
            }
            #chat-input {
                display: flex; padding: 5px; border-top: 1px solid #ddd;
            }
            #chat-input input {
                flex: 1; padding: 8px; border: none; outline: none;
            }
            #chat-input button {
                padding: 8px; background: #007bff; color: white;
                border: none; cursor: pointer;
            }
        </style>
        <div id="chat-header">Chatbot</div>
        <div id="chat-body"></div>
        <div id="chat-input">
            <input type="text" id="chat-text" placeholder="Type a message..." />
            <button id="chat-send">Send</button>
        </div>
    `;
  document.body.appendChild(chatWidget);

  let chatBody = document.getElementById("chat-body");
  let chatText = document.getElementById("chat-text");
  let chatSend = document.getElementById("chat-send");

  function appendMessage(text, sender) {
    let message = document.createElement("div");
    message.textContent = text;
    message.style.padding = "8px";
    message.style.margin = "5px";
    message.style.borderRadius = "5px";
    message.style.background = sender === "bot" ? "#eee" : "#007bff";
    message.style.color = sender === "bot" ? "black" : "white";
    message.style.alignSelf = sender === "bot" ? "flex-start" : "flex-end";
    message.style.maxWidth = "80%";
    chatBody.appendChild(message);
    chatBody.scrollTop = chatBody.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    try {
      let response = await fetch("https://web-chatbot-server.onrender.com/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });
      let data = await response.json();
      return data.reply;
    } catch (error) {
      return "Sorry, I am having trouble responding right now.";
    }
  }

  chatSend.addEventListener("click", async () => {
    let userMessage = chatText.value.trim();
    if (!userMessage) return;
    appendMessage(userMessage, "user");
    chatText.value = "";

    let botReply = await getBotResponse(userMessage);
    appendMessage(botReply, "bot");
  });
})();
