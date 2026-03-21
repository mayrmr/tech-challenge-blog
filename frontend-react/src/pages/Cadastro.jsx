import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("aluno");

  const navigate = useNavigate();

  async function handleCadastro(event) {
    event.preventDefault();

    try {
      await api.post("/auth/register", {
        nome,
        email,
        senha,
        perfil,
      });

      alert("Usuário cadastrado com sucesso!");
      navigate("/login");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário");
    }
  }

  return (
    <div className="page">
      <div className="container">
        <Navbar />

        <div className="auth-container">
          <div className="auth-card">
            <h1>Cadastro</h1>
            <p className="page-subtitle">
              Crie uma conta para acessar o sistema.
            </p>

            <form onSubmit={handleCadastro}>
              <div className="form-group">
                <label>Nome</label>
                <input
                  type="text"
                  value={nome}
                  onChange={(event) => setNome(event.target.value)}
                  placeholder="Digite seu nome"
                />
              </div>

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Digite seu email"
                />
              </div>

              <div className="form-group">
                <label>Senha</label>
                <input
                  type="password"
                  value={senha}
                  onChange={(event) => setSenha(event.target.value)}
                  placeholder="Digite sua senha"
                />
              </div>

              <div className="form-group">
                <label>Perfil</label>
                <select
                  value={perfil}
                  onChange={(event) => setPerfil(event.target.value)}
                  style={{
                    width: "100%",
                    border: "1px solid var(--border)",
                    background: "var(--bg-soft)",
                    color: "var(--text)",
                    borderRadius: "14px",
                    padding: "14px 16px",
                  }}
                >
                  <option value="aluno">Aluno</option>
                  <option value="professor">Professor</option>
                </select>
              </div>

              <button className="btn btn-primary btn-block" type="submit">
                Cadastrar
              </button>
            </form>

            <p className="auth-switch">
              Já tem conta? <Link to="/login">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
