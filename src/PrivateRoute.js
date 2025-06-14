// src/PrivateRoute.js
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  const isAuth = localStorage.getItem("auth");
  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoute;
