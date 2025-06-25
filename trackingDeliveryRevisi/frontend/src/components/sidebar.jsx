"use client";
import SideBarLink from "./link-sidebar";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import "../styles/index.css";
import { MdMenuOpen } from "react-icons/md";
import { AuthContext } from "../context/auth";
import { SidebarContext } from "../context/sidebar-context";
import { IoLogOutOutline } from "react-icons/io5";

export default function Sidebar() {
  const { isOpen } = useContext(SidebarContext);
  const { logout } = useContext(AuthContext);

  const handleClick = async (e) => {
    e.preventDefault();
    try {
      await logout();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <>
      {/* <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        className="mt-2 ml-3 inline-flex items-center rounded-lg p-2 text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200"
      >
        <span className="sr-only">Open Sidebar</span>
      </button> */}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-56 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto bg-gray-100 px-3 ">
          <div className="border-b border-gray-200 pb-5">
            <NavLink
              to="/"
              className="mb-6 flex items-center align-middle pt-10 px-2.5 "
            >
              <h1 className="text-[#105bdf] text-[21px]">
                <b>e-Delivery System</b>
              </h1>
            </NavLink>
            <ul>
              <SideBarLink />
            </ul>
          </div>
          <div className="text-center">
            <button
              className="cursor-pointer text-sm bg-[#2c64c7] w-fit px-3 py-1 rounded text-white absolute bottom-10 left-2/7"
              onClick={handleClick}
            >
              <div className="flex flex-row items-center gap-2">
                <IoLogOutOutline size={18} /> Logout
              </div>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
