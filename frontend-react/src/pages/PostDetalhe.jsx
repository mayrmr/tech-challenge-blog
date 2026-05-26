import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function PostDetalhe() {
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarioEditando, setComentarioEditando] = useState(null);
  const [textoEditando, setTextoEditando] = useState("");
  const [menuAberto, setMenuAberto] = useState(null);
  

  const navigate = useNavigate();
  const { id } = useParams();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  const usuarioId =
    user?._id ||
    user?.id ||
    user?.usuarioId ||
    user?.userId ||
    user?.email ||
    user?.nome ||
    user?.name;

  const nomeUsuario = user?.nome || user?.name || user?.email || "Usuário";

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

  async function carregarComentarios() {
    try {
      const response = await api.get(`/posts/${id}/comments`);
      setComments(response.data);
    } catch (error) {
      console.error(error);
      alert("Erro ao carregar comentários");
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

  async function curtirPost() {
    if (!usuarioId) {
      alert("Você precisa estar logado para curtir.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/posts/${id}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: String(usuarioId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erro ao curtir post");
      }

      setPost(data);
    } catch (error) {
      console.error("ERRO AO CURTIR POST:", error);
      alert(error.message || "Erro ao curtir post");
    }
  }

  async function criarComentario(e) {
    e.preventDefault();

    if (!usuarioId) {
      alert("Você precisa estar logado para comentar.");
      return;
    }

    if (!novoComentario.trim()) {
      alert("Digite um comentário.");
      return;
    }

    try {
      await api.post(`/posts/${id}/comments`, {
        texto: novoComentario,
        autor: nomeUsuario,
        usuarioId,
      });

      setNovoComentario("");
      carregarComentarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao criar comentário");
    }
  }

  function iniciarEdicaoComentario(comment) {
    setComentarioEditando(comment._id);
    setTextoEditando(comment.texto);
    setMenuAberto(null);
  }

  function cancelarEdicaoComentario() {
    setComentarioEditando(null);
    setTextoEditando("");
  }

  async function salvarEdicaoComentario(commentId) {
    if (!textoEditando.trim()) {
      alert("O comentário não pode ficar vazio.");
      return;
    }

    try {
      await api.put(`/comments/${commentId}`, {
        texto: textoEditando,
        usuarioId,
        perfil: user?.perfil,
      });

      setComentarioEditando(null);
      setTextoEditando("");
      carregarComentarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao editar comentário");
    }
  }

  async function excluirComentario(commentId) {
    const confirmar = window.confirm("Deseja realmente excluir este comentário?");
    if (!confirmar) return;

    try {
      await api.delete(`/comments/${commentId}`, {
        data: {
          usuarioId,
          perfil: user?.perfil,
        },
      });

      setMenuAberto(null);
      carregarComentarios();
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir comentário");
    }
  }

  async function curtirComentario(commentId) {
    if (!usuarioId) {
      alert("Você precisa estar logado para curtir.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:3000/comments/${commentId}/like`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuarioId: String(usuarioId),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || data.message || "Erro ao curtir comentário");
      }

      carregarComentarios();
    } catch (error) {
      console.error("ERRO AO CURTIR COMENTÁRIO:", error);
      alert(error.message || "Erro ao curtir comentário");
    }
  }

  function usuarioCurtiuPost() {
    return post?.likes?.some(
      (likeId) => String(likeId) === String(usuarioId)
    );
  }

  function usuarioCurtiuComentario(comment) {
    return comment?.likes?.some(
      (likeId) => String(likeId) === String(usuarioId)
    );
  }

  function podeEditarOuExcluirComentario(comment) {
    const isOwner = String(comment.usuarioId) === String(usuarioId);
    const isProfessor = user?.perfil === "professor";

    return isOwner || isProfessor;
  }

  useEffect(() => {
    carregarPost();
    carregarComentarios();
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

          <div className="post-like-count">
            {post.likes?.length || 0} curtida(s)
          </div>

          <div className="post-actions post-actions-detail">
            <button className="btn btn-secondary" onClick={() => navigate("/")}>
              Voltar
            </button>

            <button className="btn btn-like" onClick={curtirPost}>
              {usuarioCurtiuPost() ? "Curtido" : "Curtir"}
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

        <div className="card comments-card">
          <h2 className="comments-title">Comentários</h2>

          <form className="comment-form" onSubmit={criarComentario}>
            <textarea
              value={novoComentario}
              onChange={(e) => setNovoComentario(e.target.value)}
              placeholder="Escreva um comentário..."
            />

            <button className="btn btn-primary btn-comment-submit" type="submit">
              Enviar comentário
            </button>
          </form>

          <div className="comments-list">
            {comments.length === 0 && (
              <p className="empty-state">Nenhum comentário ainda.</p>
            )}

            {comments.map((comment) => (
              <div className="comment-item" key={comment._id}>
                <div className="comment-top">
                  <div className="comment-header">
                    <strong>{comment.autor}</strong>
                    <span>{formatarData(comment.createdAt)}</span>
                  </div>

                  {podeEditarOuExcluirComentario(comment) && (
                    <div className="comment-menu-wrapper">
                      <button
                        className="comment-menu-button"
                        type="button"
                        onClick={() =>
                          setMenuAberto(menuAberto === comment._id ? null : comment._id)
                        }
                      >
                        ⋯
                      </button>

                      {menuAberto === comment._id && (
                        <div className="comment-menu">
                          <button
                            type="button"
                            onClick={() => iniciarEdicaoComentario(comment)}
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => excluirComentario(comment._id)}
                          >
                            Excluir
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {comentarioEditando === comment._id ? (
                  <div className="comment-edit-area">
                    <textarea
                      value={textoEditando}
                      onChange={(e) => setTextoEditando(e.target.value)}
                    />

                    <div className="comment-actions">
                      <button
                        className="btn btn-primary"
                        type="button"
                        onClick={() => salvarEdicaoComentario(comment._id)}
                      >
                        Salvar
                      </button>

                      <button
                        className="btn btn-secondary"
                        type="button"
                        onClick={cancelarEdicaoComentario}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <p className="comment-text">{comment.texto}</p>
                )}

                <div className="comment-like-row">
                  <button
                    className="btn btn-like"
                    type="button"
                    onClick={() => curtirComentario(comment._id)}
                  >
                    {usuarioCurtiuComentario(comment) ? "Curtido" : "Curtir"}
                  </button>

                  <span className="like-count">
                    {comment.likes?.length || 0} curtida(s)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}