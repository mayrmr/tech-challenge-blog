import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function NovoPost() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [arquivo, setArquivo] = useState(null);

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("conteudo", conteudo);
    formData.append("autor", autor);
    if (arquivo) formData.append("anexo", arquivo);

    try {
      await api.post("/posts", formData);
      alert("Post criado!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao criar post");
    }
  }

  return (
    <div className="page">
      <div className="container">
	<Navbar />

        <div className="card form-card">
          <h1 className="page-title">Novo Post</h1>
          <p className="page-subtitle">
            Preencha os dados abaixo para publicar um novo conteúdo.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                placeholder="Digite o título do post"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Conteúdo</label>
              <textarea
                placeholder="Digite o conteúdo"
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Autor</label>
              <input
                placeholder="Digite o nome do autor"
                value={autor}
                onChange={(e) => setAutor(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Anexo</label>
              <input type="file" onChange={(e) => setArquivo(e.target.files[0])} />
              <p className="helper-text">Você pode enviar um arquivo opcional.</p>
            </div>

            <div className="post-actions">
              <button className="btn btn-primary" type="submit">
                Criar
              </button>

              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => navigate("/")}
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
