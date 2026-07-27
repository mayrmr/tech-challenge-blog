const bcrypt = require("bcryptjs");
const User = require("../models/userModel");

const listarUsuarios = async (req, res) => {
  try {
    const { perfil } = req.query;
    const filtro = {};

    if (perfil === "aluno" || perfil === "professor") {
      filtro.perfil = perfil;
    }

    const usuarios = await User.find(filtro).sort({ nome: 1 });
    res.json(usuarios);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao listar usuários" });
  }
};

const buscarUsuarioPorId = async (req, res) => {
  try {
    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao buscar usuário" });
  }
};

const editarUsuario = async (req, res) => {
  try {
    const { nome, email, perfil, senha } = req.body;

    const usuario = await User.findById(req.params.id);

    if (!usuario) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    if (nome) usuario.nome = nome;
    if (email) usuario.email = email;
    if (perfil) usuario.perfil = perfil;
    if (senha) usuario.senha = await bcrypt.hash(senha, 10);

    await usuario.save();

    res.json(usuario);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao editar usuário" });
  }
};

const excluirUsuario = async (req, res) => {
  try {
    if (req.params.id === req.user.id) {
      return res
        .status(400)
        .json({ erro: "Não é possível excluir a própria conta" });
    }

    const usuarioRemovido = await User.findByIdAndDelete(req.params.id);

    if (!usuarioRemovido) {
      return res.status(404).json({ erro: "Usuário não encontrado" });
    }

    res.json({ mensagem: "Usuário removido com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao excluir usuário" });
  }
};

module.exports = {
  listarUsuarios,
  buscarUsuarioPorId,
  editarUsuario,
  excluirUsuario,
};
