const express = require("express");
const OpenAI = require("openai");

const app = express();
app.use(express.json());

const porta = process.env.PORT || 3000;

// Inicializa OpenAI com a variável de ambiente
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Página principal com o chat
app.get("/", (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <title>Chatbot do Venâncio 🤖</title>
  <style>
    body {
      font-family: Arial;
      max-width: 700px;
      margin: 40px auto;
    }
    #chat {
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 10px;
      min-height: 300px;
    }
    .msg {
      margin: 8px 0;
      padding: 10px;
      border-radius: 10px;
      max-width: 80%;
    }
    .user {
      background: #d1e7ff;
      margin-left: auto;
    }
    .bot {
      background: #f1f1f1;
    }
    form {
      display: flex;
      margin-top: 10px;
    }
    input {
      flex: 1;
      padding: 10px;
    }
    button {
      padding: 10px;
      cursor: pointer;
    }
  </style>
</head>
<body>

<h2>🤖 Chat do Venâncio</h2>

<div id="chat"></div>

<form id="form">
  <input id="msg" placeholder="Escreve algo..." autocomplete="off"/>
  <button>Enviar</button>
</form>

<script>
  const chat = document.getElementById("chat");
  const form = document.getElementById("form");
  const msgInput = document.getElementById("msg");

  function addMessage(text, type) {
    const div = document.createElement("div");
    div.className = "msg " + type;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const message = msgInput.value.trim();
    if (!message) return;

    msgInput.value = "";
    addMessage(message, "user");

    addMessage("Digitando...", "bot");
    const typing = chat.lastChild;

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
      });

      const data = await response.json();

      typing.remove();
      addMessage(data.reply, "bot");

    } catch (err) {
      typing.remove();
      addMessage("Erro no servidor 😵", "bot");
    }
  });
</script>

</body>
</html>
  `);
});

// Rota da IA
app.post("/api/chat", async (req, res) => {
  try {
    const message = req.body.message;

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: "Você é um chatbot simpático que responde em português."
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    const reply = response.output_text || "Não consegui responder.";

    res.json({ reply });

  } catch (error) {
    console.error(error);
    res.status(500).json({ reply: "Erro interno 😅" });
  }
});

app.listen(porta, () => {
  console.log("Servidor rodando na porta " + porta);
});