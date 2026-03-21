module.exports = (req, res, next) => {
  if (req.user.perfil !== "professor") {
    return res.status(403).json({ erro: "Acesso negado" });
  }

  next();
};
