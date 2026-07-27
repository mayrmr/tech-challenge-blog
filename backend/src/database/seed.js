require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("./db");
const User = require("../models/userModel");

const PROFESSOR_BOOTSTRAP = {
  nome: "May Professora",
  email: "may@professora.com.br",
  senha: "123456",
  perfil: "professor",
};

async function seed() {
  await connectDB();

  const existente = await User.findOne({ email: PROFESSOR_BOOTSTRAP.email });

  if (existente) {
    console.log(
      `Usuário professor "${PROFESSOR_BOOTSTRAP.email}" já existe, nada a fazer.`
    );
  } else {
    const hash = await bcrypt.hash(PROFESSOR_BOOTSTRAP.senha, 10);

    await User.create({
      nome: PROFESSOR_BOOTSTRAP.nome,
      email: PROFESSOR_BOOTSTRAP.email,
      senha: hash,
      perfil: PROFESSOR_BOOTSTRAP.perfil,
    });

    console.log(
      `Professor bootstrap criado: ${PROFESSOR_BOOTSTRAP.email} / senha: ${PROFESSOR_BOOTSTRAP.senha}`
    );
  }

  await mongoose.connection.close();
}

seed().catch((error) => {
  console.error("Erro ao rodar seed:", error);
  process.exit(1);
});
