const express = require("express");
const router = express.Router();

const {
  listarPosts,
  buscarPostPorId,
  criarPost,
  editarPost,
  deletarPost,
} = require("../controllers/postController");

const authMiddleware = require("../middlewares/authMiddleware");
const professorMiddleware = require("../middlewares/professorMiddleware");
const upload = require("../middlewares/uploadMiddleware");
const Post = require("../models/postModel");

router.post("/:postId/like", async (req, res) => {
  try {
    const { usuarioId } = req.body;

    console.log("LIKE POST - postId:", req.params.postId);
    console.log("LIKE POST - usuarioId:", usuarioId);

    if (!usuarioId) {
      return res.status(400).json({ message: "ID do usuário é obrigatório" });
    }

    const post = await Post.findById(req.params.postId);

    if (!post) {
      return res.status(404).json({ message: "Post não encontrado" });
    }

    if (!Array.isArray(post.likes)) {
      post.likes = [];
    }

    const userLikeId = String(usuarioId);

    const alreadyLiked = post.likes.some(
      (id) => String(id) === userLikeId
    );

    if (alreadyLiked) {
      post.likes = post.likes.filter(
        (id) => String(id) !== userLikeId
      );
    } else {
      post.likes.push(userLikeId);
    }

    await post.save();

    return res.json(post);
  } catch (error) {
    console.error("ERRO REAL AO CURTIR POST:", error);

    return res.status(500).json({
      message: "Erro ao curtir post",
      error: error.message,
    });
  }
});

router.get("/", listarPosts);
router.get("/:id", buscarPostPorId);

router.post(
  "/",
  authMiddleware,
  professorMiddleware,
  upload.single("anexo"),
  criarPost
);

router.put(
  "/:id",
  authMiddleware,
  professorMiddleware,
  upload.single("anexo"),
  editarPost
);

router.delete("/:id", authMiddleware, professorMiddleware, deletarPost);

module.exports = router;