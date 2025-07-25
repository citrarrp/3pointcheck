import { Navigate, Outlet } from "react-router-dom";
import Sidebar from "./sideBar";
import { useContext } from "react";
import { AuthContext } from "../context/auth.js";
import { SidebarContext } from "../context/sidebar-context.js";

export default function MainLayout() {
  const { user, loading } = useContext(AuthContext);
  const { isOpen } = useContext(SidebarContext);

  if (loading) return <p>loading...</p>;

  return user ? (
    <>
      <Sidebar />
      <main className={`${isOpen ? "ml-64" : "ml-20"} p-4 mt-6`}>
        <Outlet />
      </main>
    </>
  ) : (
    <Navigate to="/login" />
  );
}
