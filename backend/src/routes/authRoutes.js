const express = require("express");
const router = express.Router();

const { register, login } = require("../controllers/authController");
const authMiddleware = require("../middlewares/authMiddleware");
const professorMiddleware = require("../middlewares/professorMiddleware");

router.post("/register", authMiddleware, professorMiddleware, register);
router.post("/login", login);

module.exports = router;
