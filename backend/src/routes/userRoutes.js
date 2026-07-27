const express = require("express");
const router = express.Router();

const {
  listarUsuarios,
  buscarUsuarioPorId,
  editarUsuario,
  excluirUsuario,
} = require("../controllers/userController");

const authMiddleware = require("../middlewares/authMiddleware");
const professorMiddleware = require("../middlewares/professorMiddleware");

router.use(authMiddleware, professorMiddleware);

router.get("/", listarUsuarios);
router.get("/:id", buscarUsuarioPorId);
router.put("/:id", editarUsuario);
router.delete("/:id", excluirUsuario);

module.exports = router;
