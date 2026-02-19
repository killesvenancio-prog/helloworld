const express = require('express');
const app = express();

const porta = process.env.PORT || 3000;

// Rota básica
app.get('/', (req, res) => {
  res.send('Olá, Mundo!');
});

// Segunda rota
app.get('/sobre', (req, res) => {
  res.send('Esta é a página Sobre.');
});

// Rota com query strings
app.get('/buscar', (req, res) => {
  const termo = req.query.termo;

  if (!termo) {
    return res.send('Você não informou nenhum termo 😅');
  }

  res.send(`Você buscou por: ${termo}`);
});

// Inicia o servidor
app.listen(porta, () => {
  console.log(`Servidor rodando em http://localhost:${porta}`);
});