import React from "react";
import { Link, NavLink } from "react-router-dom";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
// props = firebaseUser(object) from App.jsx and withRouter to redirect
const Navbar = (props) => {
  // Log active session out
  const logOut = () => {
    auth
      .signOut()
      .then(() => {
        props.history.push("./login"); // To use this method is necessary export with withRouter()
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
            // In case active user exists
            props.firebaseUser !== null ? (
              <NavLink className="btn btn-dark mr-2" to="/admin">
                Admin
              </NavLink>
            ) : null
          }
          {
            // logOut button if active user, else Login button
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
