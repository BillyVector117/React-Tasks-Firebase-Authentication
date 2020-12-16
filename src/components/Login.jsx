import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
// withRouter: Empuja al user a diferentes routes, se usa con 'props.history'
import { auth, db } from "../firebase";

const Login = (props) => {
  // email y password se relacionan con el e. onChange del input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [register, setRegister] = useState(false);

  // Evento al dar 'submit' Login/Register
  const dataSubmit = (event) => {
    event.preventDefault();
    // Validar input de E-mail y password si estan vacias
    if (!email.trim()) {
      // console.log('Enter your E-mail')
      setError("Enter your E-mail");
      return;
    }
    if (!password.trim()) {
      // console.log('Enter your password')
      setError("Enter your Password");
      return;
    }
    if (password.length < 6) {
      // console.log('Password must have 6 at least characters')
      setError("Password must have at least 6 characters");
      return;
    }
    setError(null); // Cualquier mensaje de error no se mostrara
    console.log("validations passed");
    // Si 'register' esta activo, se ejecuta la función de registrar con Firebase
    if (register) {
      registerUsers();
    } else {
      loginUsers();
    }
  };
  const registerUsers = React.useCallback(async () => {
    try {
      // Crear una nueva cuenta usando E-mail y password
      const res = await auth.createUserWithEmailAndPassword(email, password);
      // .add() genera un id aleatorio, .doc le proporcionamos el IUD/email del user creado
      await db.collection("users").doc(res.user.email).set({
        uid: res.user.uid,
        email: res.user.email,
      });
      // Creamos una colección especifica para cada usuario registrado
      await db.collection(res.user.uid).add({
        name: 'Task random',
        createdAt: Date.now()
      })
      console.log(res.user);
      // Limpiar formulario y useStates
      setEmail("");
      setPassword("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      console.log(error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email in use");
      }
    }
  }, [email, password, props.history]);
  const loginUsers = React.useCallback(async () => {
    try {
      const res = await auth.signInWithEmailAndPassword(email, password);
      console.log(res.user);
      // Limpiar formulario y useStates
      setEmail("");
      setPassword("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setError("auth/invalid-email");
      }
      if (error.code === "auth/invalid-email") {
        setError("The email address is badly formatted.");
      }
      if (error.code === "auth/user-not-found") {
        setError("No user found!!");
      }
      if (error.code === "auth/wrong-password") {
        setError(
          "The password is invalid or the user does not have a password"
        );
      }
      console.log(error);
    }
  }, [email, password, props.history]);

  return (
    <div className="mt-2">
      <h4>{register ? "Register section" : "Login section"}</h4>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={dataSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Type your E-mail"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              autoComplete="on"
            />
            <input
              type="password"
              className="form-control mb-2"
              placeholder="Type your password"
              onChange={(event) => setPassword(event.target.value)}
              value={password}
              autoComplete="on"
            />
            <button type="submit" className="bnt btn-dark btn-lg btn-block">
              {register ? "Register" : "Log me in"}
            </button>
            <button
              type="button"
              className="btn btn-link"
              onClick={() => setRegister(!register)}
            >
              <Link to="/login">
                {register
                  ? "Already have an account?"
                  : "Don´t have an account?, Click here"}
              </Link>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login); // withRouter genera props
