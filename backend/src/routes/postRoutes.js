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
