require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./database/db");

const PORT = process.env.PORT || 3000;

connectDB();

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  app(req, res);
});

server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
