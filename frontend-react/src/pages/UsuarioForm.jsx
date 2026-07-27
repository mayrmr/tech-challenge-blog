import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function UsuarioForm() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [perfil, setPerfil] = useState("aluno");

  const navigate = useNavigate();
  const { id } = useParams();
  const isEdicao = Boolean(id);

  useEffect(() => {
    if (!id) return;

    async function carregarUsuario() {
      try {
        const response = await api.get(`/users/${id}`);
        setNome(response.data.nome);
        setEmail(response.data.email);
        setPerfil(response.data.perfil);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar usuário");
      }
    }

    carregarUsuario();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      if (isEdicao) {
        const payload = { nome, email, perfil };
        if (senha) payload.senha = senha;
        await api.put(`/users/${id}`, payload);
        alert("Usuário atualizado com sucesso!");
      } else {
        await api.post("/auth/register", { nome, email, senha, perfil });
        alert("Usuário cadastrado com sucesso!");
      }

      navigate("/usuarios");
    } catch (error) {
      console.error(error);
      const mensagem =
        error?.response?.data?.erro ||
        `Erro ao ${isEdicao ? "editar" : "cadastrar"} usuário`;
      alert(mensagem);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <Navbar />

        <div className="card form-card">
          <h1 className="page-title">
            {isEdicao ? "Editar Usuário" : "Novo Usuário"}
          </h1>
          <p className="page-subtitle">
            {isEdicao
              ? "Atualize os dados do usuário."
              : "Cadastre um(a) novo(a) aluno(a) ou professor(a)."}
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                value={nome}
                onChange={(event) => setNome(event.target.value)}
                placeholder="Digite o nome"
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="Digite o email"
              />
            </div>

            <div className="form-group">
              <label>{isEdicao ? "Nova senha (opcional)" : "Senha"}</label>
              <input
                type="password"
                value={senha}
                onChange={(event) => setSenha(event.target.value)}
                placeholder={
                  isEdicao ? "Deixe em branco para manter a atual" : "Digite a senha"
                }
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

            <div className="post-actions">
              <button className="btn btn-primary" type="submit">
                {isEdicao ? "Salvar alterações" : "Cadastrar"}
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/usuarios")}
              >
                Voltar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
