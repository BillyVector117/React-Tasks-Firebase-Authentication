import React, { useState } from "react";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
import Firestore from "./Firestore";
const Admin = (props) => {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    // Si hay un usuario activo (logeado), .currentUser da info. del usuario (correo, etc.)
    if (auth.currentUser) {
      console.log("Auth Status: Signed-in");
      setUser(auth.currentUser); // Montar al state 'user' la info. del user
    } else {
      console.log("Auth Status: Sign-out");
      props.history.push("/login");
    }
  }, [props.history]);
  return (
    <div>
      <h4>Admin Authentication component</h4>
      {
        // Si 'user' tiene info. (es activo, en useEffect se le monta la info) muestra info adicional
        user && (
          <div>
            <h3>Hello, {user.email}</h3>
            <Firestore user={user}></Firestore>
          </div>
        )
        // method 2: user ? <h3>Hello, {user.email}</h3> : null
      }
    </div>
  );
};

export default withRouter(Admin);
