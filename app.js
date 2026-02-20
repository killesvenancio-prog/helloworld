const express = require('express');
const app = express();

const porta = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>pra diuli</title>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
          background-color: #ffe6f0;
          font-family: Arial, sans-serif;
          flex-direction: column;
        }
        button {
          padding: 15px 25px;
          font-size: 18px;
          border: none;
          border-radius: 10px;
          background-color: #ff4da6;
          color: white;
          cursor: pointer;
        }
        button:hover {
          background-color: #e60073;
        }
      </style>
    </head>
    <body>
      <h1> Clique no botão </h1>
      <button onclick="mostrarMensagem()">Clique aqui</button>

      <script>
        function mostrarMensagem() {
          alert("Te amo, amor! 💕");
        }
      </script>
    </body>
    </html>
  `);
});

app.listen(porta, () => {
  console.log("Servidor rodando na porta " + porta);
});