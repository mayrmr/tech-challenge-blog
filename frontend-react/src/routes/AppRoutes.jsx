import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Home from "../pages/Home";
import NovoPost from "../pages/NovoPost";
import EditarPost from "../pages/EditarPost";
import PostDetalhe from "../pages/PostDetalhe";
import Cadastro from "../pages/Cadastro";

function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
	<Route path="/cadastro" element={<Cadastro />} />

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
      </Routes>
    </BrowserRouter>
  );
}
