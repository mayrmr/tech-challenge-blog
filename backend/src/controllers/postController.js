const Post = require("../models/postModel");

const listarPosts = async (req, res) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao listar posts" });
  }
};

const buscarPostPorId = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar post" });
  }
};

const criarPost = async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;

    if (!titulo || !conteudo || !autor) {
      return res.status(400).json({ erro: "Campos obrigatórios" });
    }

    let anexo = null;

    if (req.file) {
      anexo = {
        nome: req.file.originalname,
        caminho: `/uploads/${req.file.filename}`,
      };
    }

    const novoPost = await Post.create({
      titulo,
      conteudo,
      autor,
      anexo,
      criadoPor: req.user.id,
    });

    res.status(201).json(novoPost);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao criar post" });
  }
};

const editarPost = async (req, res) => {
  try {
    const { titulo, conteudo, autor } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    post.titulo = titulo;
    post.conteudo = conteudo;
    post.autor = autor;

    if (req.file) {
      post.anexo = {
        nome: req.file.originalname,
        caminho: `/uploads/${req.file.filename}`,
      };
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: "Erro ao editar post" });
  }
};

const deletarPost = async (req, res) => {
  try {
    const postRemovido = await Post.findByIdAndDelete(req.params.id);

    if (!postRemovido) {
      return res.status(404).json({ erro: "Post não encontrado" });
    }

    res.json({ mensagem: "Post removido com sucesso" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao deletar post" });
  }
};

module.exports = {
  listarPosts,
  buscarPostPorId,
  criarPost,
  editarPost,
  deletarPost,
};
