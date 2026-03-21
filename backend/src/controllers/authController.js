const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = "secret";

exports.register = async (req, res) => {
  try {
    const { nome, email, senha, perfil } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ erro: "Usuário já existe" });
    }

    const hash = await bcrypt.hash(senha, 10);

    const user = await User.create({
      nome,
      email,
      senha: hash,
      perfil,
    });

    res.status(201).json(user);
  } catch (error) {
    console.error("Erro no register:", error);
    res.status(500).json({ erro: "Erro ao registrar" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ erro: "Usuário não encontrado" });
    }

    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return res.status(400).json({ erro: "Senha inválida" });
    }

    const token = jwt.sign(
      { id: user._id, perfil: user.perfil },
      SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ erro: "Erro no login" });
  }
};
