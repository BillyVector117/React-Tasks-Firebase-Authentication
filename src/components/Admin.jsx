import React, { useState } from "react";
import { auth } from "../firebase";
import { withRouter } from "react-router-dom";
import Firestore from "./Firestore";
const Admin = (props) => {
  const [user, setUser] = useState(null);

  React.useEffect(() => {
    // currentUser() is auth() method, returns the current user object (if exists)
    if (auth.currentUser) {
      const currentUser = auth.currentUser;
      console.log("Auth Status: Signed-in as: ", currentUser);
      setUser(currentUser); // Mount 'user' state the user Object
    } else {
      console.log("Auth Status: Sign-out");
      props.history.push("/login"); // Force to logOut
    }
  }, [props.history]);
  return (
    <div>
      <h4>Admin Authentication component</h4>
      {
        // useEffect() capture complete user Object, to enter this page is necessary an active user
        user && (
          <div>
            <h3>Welcome back!, {user.email}</h3>
            <Firestore user={user}></Firestore>
          </div>
        )
      }
    </div>
  );
};
export default withRouter(Admin);
