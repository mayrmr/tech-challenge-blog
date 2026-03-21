import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function PostDetalhe() {
  const [post, setPost] = useState(null);
  const navigate = useNavigate();
  const { id } = useParams();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function carregarPost() {
    try {
      const response = await api.get(`/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar post");
    }
  }

  async function excluirPost() {
    const confirmar = window.confirm("Deseja realmente excluir este post?");
    if (!confirmar) return;

    try {
      await api.delete(`/posts/${id}`);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir post");
    }
  }

  useEffect(() => {
    carregarPost();
  }, [id]);

  if (!post) {
    return (
      <div className="page">
        <div className="container">
          <Navbar />
          <div className="card detail-card">
            <p>Carregando post...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="container">
        <Navbar />

        <div className="card detail-card">
          <h1 className="detail-title">{post.titulo}</h1>

          <p className="post-date">
            Publicado em {formatarData(post.createdAt)}
          </p>

          <p className="post-meta">Autor: {post.autor}</p>

          <p className="detail-content">{post.conteudo}</p>

          {post.anexo && (
            <div className="current-file">
              <strong>Anexo:</strong>{" "}
              <a
                href={`http://localhost:3000${post.anexo.caminho}`}
                target="_blank"
                rel="noreferrer"
              >
                {post.anexo.nome}
              </a>
            </div>
          )}

          <div className="post-actions">
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Voltar para home
            </button>

            {user?.perfil === "professor" && (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => navigate(`/editar/${post._id}`)}
                >
                  Editar
                </button>

                <button className="btn btn-danger" onClick={excluirPost}>
                  Excluir
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
