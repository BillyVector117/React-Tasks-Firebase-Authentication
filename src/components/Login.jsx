import React, { useState } from "react";
// Dependencies
import { Link, withRouter } from "react-router-dom";
// Functions
import { auth, db } from "../firebase";

const Login = (props) => {
  // 'email-password' refers to 'input name'
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [register, setRegister] = useState(false);

  // Submit-Form event
  const dataSubmit = (event) => {
    event.preventDefault();
    // Validate inputs
    if (!email.trim()) {
      setError("Enter your E-mail");
      return;
    }
    if (!password.trim()) {
      setError("Enter your Password");
      return;
    }
    if (password.length < 6) {
      setError("Password must have at least 6 characters");
      return;
    }
    
    // Success case: No errors
    setError(null);
    console.log("validations passed");
    // register/signIn depending Form-section
    if (register) {
      registerUsers();
    } else {
      loginUsers();
    }
  };
  const registerUsers = React.useCallback(async () => {
    try {
      // createUserWithEmailAndPassword() method needs to active in Firebase
      const res = await auth.createUserWithEmailAndPassword(email, password);
      // console.log("DATA CREATED: ", res); // Returns user object
      // .add() generates random ID, .doc() needs a IUD (In this case set as email)
      await db.collection("users").doc(res.user.email).set({
        uid: res.user.uid,
        email: res.user.email,
      });
      // res demo: [user1@gmail.com: {uid: 12341232, email: user1@gmail.com}]
      // Create a new collection to save tasks for each new registered user
      await db.collection(res.user.uid).add({
        name: "Edit this dandom Task!",
        createdAt: Date.now(),
      });
      // Clean States and redirect to /admin section
      setEmail("");
      setPassword("");
      setError(null);
      props.history.push("/admin");
    } catch (error) {
      console.error(error);
      if (error.code === "auth/email-already-in-use") {
        setError("Email in use");
      }
    }
  }, [email, password, props.history]);

  const loginUsers = React.useCallback(async () => {
    try {
      await auth.signInWithEmailAndPassword(email, password);
      // console.log(res.user);
      // Clean states
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
        setError("No user found!");
      }
      if (error.code === "auth/wrong-password") {
        setError(
          "The password is invalid or the user does not have a password"
        );
      }
      console.error(error);
    }
  }, [email, password, props.history]);

  return (
    <div className="mt-2">
      {/* register is false by default */}
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
                {register ? (
                  <b>Already have an account?</b>
                ) : (
                  <b>"Don´t have an account?, Click here"</b>
                )}
              </Link>
            </button>

            <Link className="d-block" to="/reset">
              {register ? null : "Forgot your password?"}
            </Link>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Login); // withRouter genera props
