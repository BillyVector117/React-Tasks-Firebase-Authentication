import React, { useState } from "react";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
const Reset = (props) => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState(null);
  // Recover password-Submit event
  const dataSubmit = (event) => {
    event.preventDefault();
    // Validate No-Empty input
    if (!email.trim()) {
      setError("Enter your E-mail");
      return;
    }
    // Success case:Execute recover()
    setError(null);
    recover();
  };
  const recover = React.useCallback(async () => {
    try {
      // Send thorugh Firebase an E-mail confirmation
      await auth.sendPasswordResetEmail(email);
      // console.log("Recovering password...");
      setMessage("Check your E-mail and try again!");
      // Redirect to /login section in 3 Seconds
      setTimeout(() => {
        props.history.push("login");
      }, 3000);
    } catch (error) {
      console.log(error);
      setError(error.message);
    }
  }, [email, props.history]);

  return (
    <div className="mt-2">
      <h4>Recover password</h4>
      <hr />
      <div className="row justify-content-center">
        <div className="col-12 col-sm-8 col-md-6 col-xl-4">
          <form onSubmit={dataSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            {message && <div className="alert alert-success">{message}</div>}
            <input
              type="email"
              className="form-control mb-2"
              placeholder="Type your E-mail"
              onChange={(event) => setEmail(event.target.value)}
              value={email}
              autoComplete="on"
            />
            <button type="submit" className="bnt btn-dark btn-lg btn-block">
              {<b>Recover my password</b>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Reset);
