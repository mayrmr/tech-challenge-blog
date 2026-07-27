const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  senha: { type: String, required: true },
  perfil: {
    type: String,
    enum: ["professor", "aluno"],
    default: "aluno",
  },
}, {
  timestamps: true,
  toJSON: {
    transform: (_doc, ret) => {
      delete ret.senha;
      return ret;
    },
  },
});

module.exports = mongoose.model("User", userSchema);
