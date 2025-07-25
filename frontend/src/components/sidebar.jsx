"use client";
import SideBarLink from "./link-sidebar";
import { Link, NavLink } from "react-router-dom";
import { useContext } from "react";
import "../styles/index.css";
import { MdMenuOpen } from "react-icons/md";
import { AuthContext } from "../context/auth";
import { SidebarContext } from "../context/sidebar-context";
import { IoLogOutOutline } from "react-icons/io5";
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";
export default function Sidebar() {
  const { isOpen, setIsOpen } = useContext(SidebarContext);
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

      {/* <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 w-56 h-screen transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto bg-gray-100 px-3 ">
          <div className="pb-5">
            <div className="mb-6 flex items-center justify-between pt-10">
              <NavLink to="/" className="items-center">
                <h1 className="text-[#105bdf] text-[19px] font-bold">
                  <b>e-Delivery System</b>
                </h1>
              </NavLink>
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-500 cursor-pointer"
              >
                <GiHamburgerMenu size={17} />
              </button>
            </div>
            <ul>
              <SideBarLink />
            </ul>
          </div>
          <div className="text-center mt-6">
            <button
              className="cursor-pointer text-sm bg-[#2c64c7] w-fit px-3 py-1 rounded text-white absolute bottom-5 left-2/7"
              onClick={handleClick}
            >
              <div className="flex flex-row items-center gap-2">
                <IoLogOutOutline size={18} /> Logout
              </div>
            </button>
          </div>
        </div>
      </aside> */}
      {/* <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
        aria-label="Sidebar"
      > */}

      <aside
        id="sidebar"
        className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 ${
          isOpen ? "w-60" : "w-16"
        }`}
        aria-label="Sidebar"
      >
        <div className="flex h-full flex-col justify-between overflow-y-auto bg-gray-100 px-3">
          <div className="pb-5">
            <div
              className={`mb-6 flex items-center ${
                isOpen ? "justify-between" : "justify-center"
              } pt-5`}
            >
              {isOpen && (
                <NavLink to="/" className="items-center">
                  <h1 className="text-[#105bdf] text-[19px] font-bold">
                    <b>Delivery Tracking</b>
                  </h1>
                </NavLink>
              )}
              <button
                onClick={() => setIsOpen(!isOpen)}
                type="button"
                className="text-gray-800 cursor-pointer"
              >
                {isOpen ? (
                  <MdKeyboardDoubleArrowLeft size={19} />
                ) : (
                  <MdKeyboardDoubleArrowRight size={19} />
                )}
              </button>
            </div>
            <ul>
              <SideBarLink isOpen={isOpen} />
            </ul>
          </div>

          <div className="mt-auto mb-5 text-center">
            <button
              onClick={handleClick}
              className={`cursor-pointer text-sm rounded flex text-[#2c64c7] items-center justify-center border-1 border-[#2c64c7] hover:bg-[#2c64c7] hover:text-white ${
                isOpen ? " px-3 py-1 w-fit mx-auto gap-2" : " p-2" 
              }`}
            >
              <IoLogOutOutline size={18} />
              {isOpen && <span>Logout</span>}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
