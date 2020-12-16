import React from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
// En props tenemos la info. del user (si esta logeado o no)
const Navbar = (props) => {
  // Cierra sesión y dirige al /login
  const logOut = () => {
    // Metodo que cierra sesión activa
    auth
      .signOut()
      // Si el signOut es exitoso redirigelo a una ruta
      .then(() => {
        props.history.push("./login");
      });
  };
  return (
    <div className="navbar navbar-light bg-light">
      <Link className="navbar-brand" to="/">
        Authetication
      </Link>
      <div>
        <div className="d-flex">
          <NavLink className="btn btn-dark mr-2" to="/" exact>
            Home
          </NavLink>
          {
            // Si el state es DIFERENTE DE NULL, muestra botón Admin. Si no, no crea el botón
            props.firebaseUser !== null ? (
              <NavLink className="btn btn-dark mr-2" to="/admin">
                Admin
              </NavLink>
            ) : null
          }
          {
            // Si existe un usuario, puede cerrar sesión, si no, muestra botón de Login
            props.firebaseUser !== null ? (
              <button className="btn btn-dark mr-2" onClick={() => logOut()}>
                Log out
              </button>
            ) : (
              <NavLink className="btn btn-dark mr-2" to="/login">
                Login
              </NavLink>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default withRouter(Navbar);
