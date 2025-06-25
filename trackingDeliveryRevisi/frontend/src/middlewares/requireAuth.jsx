import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth";

const RequireAuth = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  // console.log(user, loading);
  if (loading) return <div>Loading...</div>;

  return user ? children : <Navigate to="/login" />;
};

export default RequireAuth;
