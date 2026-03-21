const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  titulo: String,
  conteudo: String,
  autor: String,

  anexo: {
    nome: String,
    caminho: String,
  },

  criadoPor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },

}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
