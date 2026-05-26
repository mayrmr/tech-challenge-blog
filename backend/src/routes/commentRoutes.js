const express = require("express");
const router = express.Router();

const Comment = require("../models/commentModel");

router.get("/posts/:postId/comments", async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).sort({
      createdAt: -1,
    });

    res.json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao buscar comentários" });
  }
});

router.post("/posts/:postId/comments", async (req, res) => {
  try {
    const { texto, autor, usuarioId } = req.body;

    if (!texto) {
      return res.status(400).json({ message: "O comentário é obrigatório" });
    }

    if (!autor || !usuarioId) {
      return res.status(400).json({ message: "Dados do usuário são obrigatórios" });
    }

    const comment = await Comment.create({
      texto,
      autor,
      usuarioId,
      post: req.params.postId,
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao criar comentário" });
  }
});

router.put("/comments/:commentId", async (req, res) => {
  try {
    const { texto, usuarioId, perfil } = req.body;

    if (!texto) {
      return res.status(400).json({ message: "O comentário é obrigatório" });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentário não encontrado" });
    }

    const isOwner = comment.usuarioId.toString() === usuarioId;
    const isProfessor = perfil === "professor";

    if (!isOwner && !isProfessor) {
      return res.status(403).json({ message: "Sem permissão para editar" });
    }

    comment.texto = texto;
    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao editar comentário" });
  }
});

router.delete("/comments/:commentId", async (req, res) => {
  try {
    const { usuarioId, perfil } = req.body;

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentário não encontrado" });
    }

    const isOwner = comment.usuarioId.toString() === usuarioId;
    const isProfessor = perfil === "professor";

    if (!isOwner && !isProfessor) {
      return res.status(403).json({ message: "Sem permissão para excluir" });
    }

    await Comment.findByIdAndDelete(req.params.commentId);

    res.json({ message: "Comentário excluído com sucesso" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erro ao excluir comentário" });
  }
});

router.post("/comments/:commentId/like", async (req, res) => {
  try {
    const { usuarioId } = req.body;

    if (!usuarioId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório" });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comentário não encontrado" });
    }

    if (!Array.isArray(comment.likes)) {
      comment.likes = [];
    }

    const userLikeId = String(usuarioId);

    const alreadyLiked = comment.likes.some(
      (id) => String(id) === userLikeId
    );

    if (alreadyLiked) {
      comment.likes = comment.likes.filter(
        (id) => String(id) !== userLikeId
      );
    } else {
      comment.likes.push(userLikeId);
    }

    await comment.save();

    res.json(comment);
  } catch (error) {
    console.error("ERRO REAL AO CURTIR COMENTÁRIO:", error);
    res.status(500).json({
      message: "Erro ao curtir comentário",
      error: error.message,
    });
  }
});

module.exports = router;