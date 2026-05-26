import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  async function carregarPosts() {
    try {
      const response = await api.get("/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar posts");
    }
  }

  function formatarData(data) {
    return new Date(data).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  async function excluirPost(id) {
    const confirmar = window.confirm("Deseja realmente excluir este post?");
    if (!confirmar) return;

    try {
      await api.delete(`/posts/${id}`);
      carregarPosts();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir post");
    }
  }

  useEffect(() => {
    carregarPosts();
  }, []);

  return (
    <div className="page">
      <div className="container">
        <Navbar />

	<div className="topbar">
          <div>
            <h1 className="page-title">Blog Educacional</h1>
            <p className="page-subtitle">
              Comunicados e materiais complementares, tudo em um só lugar!
            </p>
          </div>

          <div className="topbar-actions">
            <input 
              type="text"
              className="search-input"
              placeholder="Pesquisar posts"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {user?.perfil === "professor" && (
              <button className="btn btn-primary" onClick={() => navigate("/novo")}>
                Criar Post
              </button>
            )}
          </div>
        </div>

        <div className="posts-grid">
          {posts.length === 0 && (
            <div className="post-card">
              <p className="empty-state">Nenhum post cadastrado ainda.</p>
            </div>
          )}

          {posts
            .filter((post) =>
            `${post.titulo} ${post.conteudo} ${post.autor}`
              .toLowerCase()
              .includes(search.toLowerCase())
            )  
            .map((post) => (
                <div 
            className="post-card post-card-clickable"
            key={post._id}
            onClick={() => navigate(`/post/${post._id}`)}
          >
              <h3 className="post-title">{post.titulo}</h3>
              <p className="post-date">
	        Publicado em {formatarData(post.createdAt)}
	      </p>
	      <p className="post-content">{post.conteudo}</p>
              <div className="post-meta">Autor(a): {post.autor}</div>

              {post.anexo && (
                <div className="current-file" onClick={(e) => e.stopPropagation()}>
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

              {user?.perfil === "professor" && (
                <div className="post-actions">
                  <button
                    className="btn btn-secondary"
                    onClick={() => navigate(`/editar/${post._id}`)}
                  >
                    Editar
                  </button>

                  <button
                    className="btn btn-danger"
                    onClick={() => excluirPost(post._id)}
                  >
                    Excluir
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
