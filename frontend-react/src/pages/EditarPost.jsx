import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import Navbar from "../components/Navbar";

export default function EditarPost() {
  const [titulo, setTitulo] = useState("");
  const [conteudo, setConteudo] = useState("");
  const [autor, setAutor] = useState("");
  const [arquivo, setArquivo] = useState(null);
  const [anexoAtual, setAnexoAtual] = useState(null);

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    async function carregarPost() {
      try {
        const response = await api.get(`/posts/${id}`);
        setTitulo(response.data.titulo);
        setConteudo(response.data.conteudo);
        setAutor(response.data.autor);
	setAnexoAtual(response.data.anexo || null);
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar post");
      }
    }

    carregarPost();
  }, [id]);

  async function handleSubmit(event) {
    event.preventDefault();

    try {    
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("conteudo", conteudo);
      formData.append("autor", autor);

      if (arquivo) {
        formData.append("anexo", arquivo);
      }

      await api.put(`/posts/${id}`, formData);
      
      alert("Post atualizado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao editar post");
    }
  }

  return (
    <div className="page">
      <div className="container">
	<Navbar />

        <div className="card form-card">
          <h1 className="page-title">Editar Post</h1>
          <p className="page-subtitle">
            Atualize as informações do post e troque o anexo se quiser.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Título</label>
              <input
                type="text"
                placeholder="Título"
                value={titulo}
                onChange={(event) => setTitulo(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Conteúdo</label>
              <textarea
                placeholder="Conteúdo"
                value={conteudo}
                onChange={(event) => setConteudo(event.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Autor</label>
              <input
                type="text"
                placeholder="Autor"
                value={autor}
                onChange={(event) => setAutor(event.target.value)}
              />
            </div>

            {anexoAtual && (
              <div className="current-file">
                <strong>Anexo atual:</strong>{" "}
                <a
                  href={`http://localhost:3000${anexoAtual.caminho}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {anexoAtual.nome}
                </a>
              </div>
            )}

            <div className="form-group">
              <label>Trocar anexo</label>
              <input
                type="file"
                onChange={(event) => setArquivo(event.target.files[0])}
              />
            </div>

            <div className="post-actions">
              <button className="btn btn-primary" type="submit">
                Salvar edição
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
