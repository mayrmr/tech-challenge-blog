import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

const FILTROS = [
  { key: "todos", label: "Todos" },
  { key: "aluno", label: "Alunos" },
  { key: "professor", label: "Professores" },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState("todos");
  const navigate = useNavigate();

  const usuarioLogado = JSON.parse(localStorage.getItem("user"));

  async function carregarUsuarios() {
    try {
      const query = filtro === "todos" ? "" : `?perfil=${filtro}`;
      const response = await api.get(`/users${query}`);
      setUsuarios(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar usuários");
    }
  }

  async function excluirUsuario(usuario) {
    const confirmar = window.confirm(
      `Deseja realmente excluir ${usuario.nome}?`
    );
    if (!confirmar) return;

    try {
      await api.delete(`/users/${usuario._id}`);
      carregarUsuarios();
    } catch (error) {
      console.error(error);
      const mensagem = error?.response?.data?.erro || "Erro ao excluir usuário";
      alert(mensagem);
    }
  }

  useEffect(() => {
    carregarUsuarios();
  }, [filtro]);

  return (
    <div className="page">
      <div className="container">
        <Navbar />

        <div className="topbar">
          <div>
            <h1 className="page-title">Usuários</h1>
            <p className="page-subtitle">
              Gerencie alunos e professores cadastrados no sistema.
            </p>
          </div>

          <div className="topbar-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate("/usuarios/novo")}
            >
              + Novo Usuário
            </button>
          </div>
        </div>

        <div className="filter-chips">
          {FILTROS.map((item) => (
            <button
              key={item.key}
              className={`filter-chip ${filtro === item.key ? "filter-chip-active" : ""}`}
              onClick={() => setFiltro(item.key)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="user-list">
          {usuarios.length === 0 && (
            <div className="post-card">
              <p className="empty-state">Nenhum usuário encontrado.</p>
            </div>
          )}

          {usuarios.map((usuario) => (
            <div className="post-card user-row" key={usuario._id}>
              <div>
                <h3 className="post-title">{usuario.nome}</h3>
                <p className="post-meta">{usuario.email}</p>
                <span className="user-badge">
                  {usuario.perfil === "professor" ? "Professor(a)" : "Aluno(a)"}
                </span>
              </div>

              <div className="post-actions">
                <button
                  className="btn btn-secondary"
                  onClick={() => navigate(`/usuarios/${usuario._id}/editar`)}
                >
                  Editar
                </button>

                {usuario._id !== usuarioLogado?._id && (
                  <button
                    className="btn btn-danger"
                    onClick={() => excluirUsuario(usuario)}
                  >
                    Excluir
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
