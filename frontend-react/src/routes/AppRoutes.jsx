import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NovoPost from "../pages/NovoPost";
import EditarPost from "../pages/EditarPost";
import PostDetalhe from "../pages/PostDetalhe";
import Usuarios from "../pages/Usuarios";
import UsuarioForm from "../pages/UsuarioForm";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

function ProfessorRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  let user = null;

  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  if (user?.perfil !== "professor") {
    return <Navigate to="/" />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />

	<Route
	  path="/novo"
	  element={
	    <PrivateRoute>
	      <NovoPost />
	    </PrivateRoute>
	  }
	/>

	<Route
	  path="/editar/:id"
	  element={
	    <PrivateRoute>
	      <EditarPost />
	    </PrivateRoute>
	  }
	/>

	<Route
          path="/post/:id"
          element={
            <PrivateRoute>
              <PostDetalhe />
            </PrivateRoute>
          }
        />

	<Route
	  path="/usuarios"
	  element={
	    <ProfessorRoute>
	      <Usuarios />
	    </ProfessorRoute>
	  }
	/>

	<Route
	  path="/usuarios/novo"
	  element={
	    <ProfessorRoute>
	      <UsuarioForm />
	    </ProfessorRoute>
	  }
	/>

	<Route
	  path="/usuarios/:id/editar"
	  element={
	    <ProfessorRoute>
	      <UsuarioForm />
	    </ProfessorRoute>
	  }
	/>
      </Routes>
    </BrowserRouter>
  );
}
