import React, { useContext } from "react";
import AuthContext from "../auth-context.js";

const Auth = props => {
  const auth = useContext(AuthContext);
  return <button onClick={auth.login}>Log in!</button>;
};

export default Auth;
