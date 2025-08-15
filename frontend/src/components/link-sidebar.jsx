// import {
//   MdLabel,
//   MdMenuOpen,
//   MdLabelOutline,
//   MdQrCodeScanner,
//   MdOutlineQrCodeScanner,
// } from "react-icons/md";
// import {
//   HiOutlineHome,
//   HiOutlinePrinter,
//   HiHome,
//   HiPrinter,
//   HiOutlineTruck,
//   HiTruck,
// } from "react-icons/hi";
// import { NavLink } from "react-router-dom";
// import React from "react";
// import { useLocation } from "react-router-dom";
// // import { useAuth } from

// const usePathname = () => {
//   const location = useLocation();
//   return location.pathname;
// };

// const Sidebar_Link = [
//   {
//     id: 1,
//     routes: "/",
//     name: "Home",
//     icon: {
//       fill: <HiHome size={24} />,
//       outline: <HiOutlineHome size={24} />,
//     },
//   },
//   {
//     id: 2,
//     routes: "/label",
//     name: "Data Label",
//     icon: {
//       fill: <MdLabel size={24} />,
//       outline: <MdLabelOutline size={24} />,
//     },
//   },
//   {
//     id: 3,
//     routes: "/printLabel",
//     name: "Print Label",
//     icon: {
//       fill: <HiPrinter size={24} />,
//       outline: <HiOutlinePrinter size={24} />,
//     },
//   },
//   {
//     id: 4,
//     routes: "/scanQR",
//     name: "Scan QR Code",
//     icon: {
//       fill: <MdQrCodeScanner size={24} />,
//       outline: <MdOutlineQrCodeScanner size={24} />,
//     },
//   },
//   {
//     id: 5,
//     routes: "/tracking",
//     name: "Tracking Delivery",
//     icon: {
//       fill: <HiTruck size={24} />,
//       outline: <HiOutlineTruck size={24} />,
//     },
//   },
// ];

// export default function SideBarLink({ open }) {
//   const pathname = usePathname();
//   // if (loading) {
//   //     return (
//   //         <div>
//   //             {Sidebar_Link.map((link) => (
//   //                 <div className='h-11 w-full rounded-lg bg-gray-200'
//   //                 key={link.id}></div>
//   //             ))}
//   //             <span className="sr-only">Loading...</span>
//   //         </div>
//   //     )
//   // }

//   const handleSideBarClick = () => {
//     if (
//       localStorage.getItem("alertMessage") &&
//       localStorage.getItem("isSuccess")
//     ) {
//       localStorage.clear();
//     }
//   };

//   return Sidebar_Link.map((link) => {
//     const isCurrentMenu =
//       link.id !== 1 ? pathname.includes(link.routes) : pathname === "";
//     return (
//       <>
//         <li key={link.id}>
//           <NavLink
//             to={`${link.routes}`}
//             className={`${
//               isCurrentMenu
//                 ? "bg-blue-700 text-white"
//                 : "hover:bg-gray-100 text-gray-900"
//             } flex items-center rounded-lg p-2.5 group group`}
//             onClick={handleSideBarClick}
//           >
//             {/* {React.cloneElement(
//             isCurrentMenu ? link.icon.fill : link.icon.outline,
//             {
//               className: `${
//                 isCurrentMenu
//                   ? "text-white"
//                   : "text-gray-500 transition duration-75 group-hover: text-gray-900"
//               }`,
//             }
//           )} */}
//             {isCurrentMenu ? link.icon.fill : link.icon.outline}

//             <span
//               className={`${
//                 !open && "w-0 translate-x-24"
//               } duration-500 overflow-hidden`}
//             >
//               {link.name}
//             </span>
//             <span
//               className={`${
//                 open && "hidden"
//               } absolute left-32 shadow-md rounded-md
//                  w-0 p-0 text-black bg-white duration-100 overflow-hidden group-hover:w-fit group-hover:p-2 group-hover:left-16
//                 `}
//             >
//               {link.name}
//             </span>
//           </NavLink>
//         </li>
//       </>
//     );
//   });
// }

import {
  MdLabel,
  MdMenuOpen,
  MdDriveFileMove,
  MdDriveFileMoveOutline,
  MdLabelOutline,
  MdQrCodeScanner,
  MdOutlineQrCodeScanner,
} from "react-icons/md";
import {
  HiOutlineHome,
  HiOutlinePrinter,
  HiHome,
  HiPrinter,
  HiOutlineTruck,
  HiTruck,
} from "react-icons/hi";
import {
  PiShippingContainerLight,
  PiShippingContainerFill,
  PiTruckTrailerFill,
  PiTruckTrailer,
} from "react-icons/pi";
import { PiPassword, PiPasswordFill } from "react-icons/pi";
import { AiFillProduct, AiOutlineProduct } from "react-icons/ai";
import { RiChatHistoryFill, RiChatHistoryLine } from "react-icons/ri";
import { TiUserAdd, TiUserAddOutline } from "react-icons/ti";
import { FaAddressCard, FaRegAddressCard } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import {
  IoEnterOutline,
  IoEnter,
  IoExit,
  IoExitOutline,
} from "react-icons/io5";
import React from "react";
import { useLocation } from "react-router-dom";
import { useContext } from "react";
import { SidebarContext } from "../context/sidebar-context.js";
import { AuthContext } from "../context/auth.js";
// import { useAuth } from

const usePathname = () => {
  const location = useLocation();
  return location.pathname;
};
const Sidebar_Link = [
  {
    id: 1,
    routes: "/",
    name: "Home",
    icon: {
      fill: <HiHome size={22} />,
      outline: <HiOutlineHome size={22} />,
    },
    role: "ppic",
  },
  {
    id: 2,
    routes: "/history",
    name: "Truck Timetable",
    icon: {
      fill: <RiChatHistoryFill size={22} />,
      outline: <RiChatHistoryLine size={22} />,
    },
    role: "ppic",
  },
  {
    id: 3,
    routes: "/label",
    name: "Data Label",
    icon: {
      fill: <MdLabel size={22} />,
      outline: <MdLabelOutline size={22} />,
    },
    role: "ppic",
  },
  {
    id: 4,
    routes: "/updateDelivery",
    name: "Update Order",
    icon: {
      fill: <MdDriveFileMove size={22} />,
      outline: <MdDriveFileMoveOutline size={22} />,
    },
    role: "ppic",
  },
  {
    id: 5,
    routes: "/printLabel",
    name: "Print Label",
    icon: {
      fill: <HiPrinter size={22} />,
      outline: <HiOutlinePrinter size={22} />,
    },
    role: "production",
  },
  {
    id: 6,
    routes: "/scanQR",
    name: "Scan QR Code",
    icon: {
      fill: <MdQrCodeScanner size={22} />,
      outline: <MdOutlineQrCodeScanner size={22} />,
    },
    role: "ppic",
  },
  {
    id: 7,
    routes: "/tracking",
    name: "Tracking Delivery",
    icon: {
      fill: <HiTruck size={22} />,
      outline: <HiOutlineTruck size={22} />,
    },
    role: "ppic",
  },
  // {
  //   id: 8,
  //   routes: "/absensi/in",
  //   name: "Absensi Kedatangan Truck",
  //   icon: {
  //     fill: <IoEnter size={18} />,
  //     outline: <IoEnterOutline size={18} />,
  //   },
  // },
  // {
  //   id: 9,
  //   routes: "/absensi/out",
  //   name: "Absensi Keberangkatan Truck",
  //   icon: {
  //     fill: <IoExit size={18} />,
  //     outline: <IoExitOutline size={18} />,
  //   },
  // },
  {
    id: 10,
    routes: "/absensi",
    name: "Absensi Truck",
    icon: {
      fill: <FaAddressCard size={22} />,
      outline: <FaRegAddressCard size={22} />,
    },
    role: "ppic",
  },
  {
    id: 11,
    routes: "/scanFinishPrepare",
    name: "Scan Finish Prepare",
    icon: {
      fill: <PiShippingContainerFill size={22} />,
      outline: <PiShippingContainerLight size={22} />,
    },
    role: "ppic",
  },
  {
    id: 12,
    routes: "/masterMaterial",
    name: "Data Master Material",
    icon: {
      fill: <AiFillProduct size={22} />,
      outline: <AiOutlineProduct size={22} />,
    },
    role: "ppic",
  },
  {
    id: 13,
    routes: "/masterTruck",
    name: "Data Master Truck",
    icon: {
      fill: <PiTruckTrailerFill size={22} />,
      outline: <PiTruckTrailer size={22} />,
    },
    role: "ppic",
  },
  {
    id: 14,
    routes: "/register",
    name: "Registrasi User",
    icon: {
      fill: <TiUserAdd size={22} />,
      outline: <TiUserAddOutline size={22} />,
    },
    role: "ppic",
  },
  {
    id: 15,
    routes: "/forget-password",
    name: "Ubah Password",
    icon: {
      fill: <PiPasswordFill size={22} />,
      outline: <PiPassword size={22} />,
    },
    role: "",
  },
];

export default function SideBarLink() {
  const pathname = usePathname();
  const { user, loading } = useContext(AuthContext);
  // if (loading) {
  //     return (
  //         <div>
  //             {Sidebar_Link.map((link) => (
  //                 <div className='h-11 w-full rounded-lg bg-gray-200'
  //                 key={link.id}></div>
  //             ))}
  //             <span className="sr-only">Loading...</span>
  //         </div>
  //     )
  // }

  const { isOpen } = useContext(SidebarContext);

  const handleSideBarClick = () => {
    if (
      localStorage.getItem("alertMessage") &&
      localStorage.getItem("isSuccess")
    ) {
      localStorage.clear();
    }
  };

  return Sidebar_Link.filter((item) =>
    String(user.dept.split("-")[0]).toLowerCase().includes(item.role)
  ).map((link) => {
    const isCurrentMenu =
      link.id !== 1 ? pathname.includes(link.routes) : pathname === "/";
    return (
      <>
        <li key={link.id}>
          <NavLink
            to={`${link.routes}`}
            className={`${
              isCurrentMenu
                ? "bg-[#2c64c7] text-white"
                : "hover:bg-gray-100 text-gray-900"
            } flex items-center rounded-lg p-2 group`}
            onClick={handleSideBarClick}
          >
            {/* {React.cloneElement(
              isCurrentMenu ? link.icon.fill : link.icon.outline,
              {
                className: `${
                  isCurrentMenu
                    ? "text-white"
                    : "text-gray-500 transition duration-75 group-hover: text-gray-900"
                }`,
              }
            )} */}
            {isCurrentMenu ? link.icon.fill : link.icon.outline}
            {isOpen && <span className="ml-5 text-sm">{link.name}</span>}
          </NavLink>
        </li>
      </>
    );
  });
}
