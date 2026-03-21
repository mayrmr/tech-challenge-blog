import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch (error) {
    user = null;
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <header className="navbar">
      <div className="navbar-left" onClick={() => navigate("/")}>
        <div className="navbar-logo">📚</div>
        <div>
          <h1 className="navbar-title">Tech Challenge Blog</h1>
          <p className="navbar-subtitle">Sistema de posts</p>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-box">
              <span className="user-icon">👤</span>
              <span>{user.nome}</span>
            </div>

            <button className="btn btn-secondary" onClick={logout}>
              Sair
            </button>
          </>
        ) : (
          <div className="user-box">
            <span className="user-icon">👤</span>
            <span>Visitante</span>
          </div>
        )}
      </div>
    </header>
  );
}
