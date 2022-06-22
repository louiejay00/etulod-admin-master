import axios from "axios";
import { createContext, useState } from "react";

export const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(localStorage.getItem("user_token"));
  const Login = (formValues) => {
    axios
      .post("/admin/signin", { ...formValues })
      .then((response) => {
        setAuth(response.data.token);
        localStorage.setItem("user_token", response.data.token);
        console.log("response", response);
      })
      .catch((err) => {
        localStorage.setItem("user_token", "");
        setAuth(false);
        console.error("error in Admin Login", err);
      });
  };
  const Logout = () => {
    localStorage.setItem("user_token", "");
    setAuth(false);
  };
  return (
    <AuthContext.Provider value={{ auth, setAuth, Login, Logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
