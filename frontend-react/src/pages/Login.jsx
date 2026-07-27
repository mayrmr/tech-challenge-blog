import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  async function handleLogin(event) {
    event.preventDefault();

    try {
      const response = await api.post("/auth/login", {
        email,
        senha,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/");
    } catch (error) {
      console.error(error);
      const mensagem = error?.response?.data?.erro || "Erro no login";
      alert(mensagem);
    }
  }

  return (
    <div className="page">
      <div className="container">
	<Navbar />
	
	<div className="auth-container">
	  <div className="auth-card">
	    <h1>Entrar</h1>
            <p className="page-subtitle">
              Mantenha-se atualizado(a): acesse sua conta para visualizar os conteúdos.
            </p>

            <form onSubmit={handleLogin}>
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

              <button className="btn btn-primary btn-block" type="submit">
                Entrar
              </button>
            </form>

	    <p className="auto-switch">
	      Cadastros de alunos e professores são feitos por um(a)
	      professor(a) já autenticado(a), dentro do sistema.
	    </p>
          </div>
        </div>
      </div>
    </div>
  );
}
