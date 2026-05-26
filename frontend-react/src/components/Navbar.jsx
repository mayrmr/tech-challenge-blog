import { useNavigate } from "react-router-dom";
import userIcon from "../assets/user-icon.png";
import logoSchool from "../assets/logo-school.png";

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
        <img src={logoSchool} alt="Logo School" className="navbar-logo-img" />
        <div>
          <h1 className="navbar-title">Escola Tech</h1>
          <p className="navbar-subtitle">Tech Challenge - Fase 03</p>
        </div>
      </div>

      <div className="navbar-right">
        {user ? (
          <>
            <div className="user-box">
              <img src={userIcon} alt="Ícone do usuário" className="user-avatar" />
              <span>{user.nome}</span>
            </div>

            <button className="btn btn-secondary" onClick={logout}>
              Sair
            </button>
          </>
        ) : (
          <div className="user-box">
            <img src={userIcon} alt="Ícone do usuário" className="user-avatar" />
            <span>Visitante</span>
          </div>
        )}
      </div>
    </header>
  );
}
