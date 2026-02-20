import express from "express";
import OpenAI from "openai";

const app = express();
app.use(express.json());

const porta = process.env.PORT || 3000;

// Cliente OpenAI (a key vem do ambiente)
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Serve a página do chat
app.get("/", (req, res) => {
  res.type("html").send(`
<!doctype html>
<html lang="pt-br">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Chatbot</title>
  <style>
    body{font-family:Arial,sans-serif;max-width:720px;margin:40px auto;padding:0 16px}
    #chat{border:1px solid #ddd;border-radius:12px;padding:12px;min-height:260px}
    .msg{margin:8px 0;padding:10px 12px;border-radius:12px;max-width:85%}
    .user{background:#e8f0ff;margin-left:auto}
    .bot{background:#f3f3f3}
    form{display:flex;gap:8px;margin-top:12px}
    input{flex:1;padding:12px;border-radius:10px;border:1px solid #ccc}
    button{padding:12px 16px;border-radius:10px;border:0;cursor:pointer}
  </style>
</head>
<body>
  <h1>🤖 Chatbot no site</h1>
  <div id="chat"></div>

  <form id="form">
    <input id="txt" autocomplete="off" placeholder="Escreve aí..." />
    <button>Enviar</button>
  </form>

  <script>
    const chat = document.getElementById('chat');
    const form = document.getElementById('form');
    const txt = document.getElementById('txt');

    function addMsg(text, who){
      const div = document.createElement('div');
      div.className = 'msg ' + who;
      div.textContent = text;
      chat.appendChild(div);
      chat.scrollTop = chat.scrollHeight;
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const msg = txt.value.trim();
      if(!msg) return;
      txt.value = '';
      addMsg(msg, 'user');

      addMsg('digitando...', 'bot');
      const typing = chat.lastChild;

      try{
        const r = await fetch('/api/chat', {
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body: JSON.stringify({ message: msg })
        });
        const data = await r.json();
        typing.remove();
        addMsg(data.reply ?? 'Deu ruim 😅', 'bot');
      }catch(err){
        typing.remove();
        addMsg('Erro de rede 😵', 'bot');
      }
    });
  </script>
</body>
</html>
  `);
});

// Endpoint do chat (chama a IA)
app.post("/api/chat", async (req, res) => {
  try {
    const message = String(req.body?.message ?? "").slice(0, 2000);

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        { role: "system", content: "Você é um chatbot gente boa, responde em PT-BR, curto e claro." },
        { role: "user", content: message },
      ],
    });

    // Pega o texto final (SDK pode variar, então deixo robusto)
    const reply =
      response.output_text ??
      (response.output?.[0]?.content?.[0]?.text ?? "Não consegui responder.");

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "Erro no servidor 😅" });
  }
});

app.listen(porta, () => console.log("Rodando na porta " + porta));