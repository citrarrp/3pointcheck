import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/breadCrumb";
// import LabelContext from "../context/label";
// import api from "../utils/api";
// import DeleteDataAction from "../components/deleteData";
import { MdDelete, MdOutlineDeviceHub } from "react-icons/md";
import {
  MdOutlineCircle,
  MdStarOutline,
  MdOutlineSquare,
} from "react-icons/md";
import {
  MdOutlinePentagon,
  MdOutlineHexagon,
  MdOutlineRectangle,
} from "react-icons/md";
import {
  RiTriangleLine,
  RiPokerDiamondsLine,
  RiPokerHeartsLine,
} from "react-icons/ri";
import { PiStarAndCrescentLight } from "react-icons/pi";
import { PiParallelogramBold } from "react-icons/pi";
import { BsLightningCharge } from "react-icons/bs";
import { BiCircleHalf } from "react-icons/bi";
import { SiBastyon } from "react-icons/si";
import { GrFastForward } from "react-icons/gr";
import { MdLabelImportantOutline } from "react-icons/md";
import { TiMinusOutline } from "react-icons/ti";
import { TiStarburstOutline } from "react-icons/ti";
import { MdFormatOverline } from "react-icons/md";
import { TiPlusOutline } from "react-icons/ti";
import { TiWavesOutline } from "react-icons/ti";
import { TiThLargeOutline } from "react-icons/ti";
import { GiZigzagHieroglyph } from "react-icons/gi";
import { IoMdCloudOutline } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { RiMapLine } from "react-icons/ri";
import { CiLocationArrow1 } from "react-icons/ci";
import { SiNextbilliondotai } from "react-icons/si";
import { LuFishSymbol } from "react-icons/lu";
import { VscSymbolNumeric } from "react-icons/vsc";

export default function LabelPage() {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  // const location = useLocation();
  // console.log(location.pathname);

  const fetchData = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/materials`
      );
      const Data = await res.json();
      setData(Data.data);
    } catch (err) {
      console.error("Failed to fetch schema fields:", err);
    }
  };

  // const handleDeleteData = async (customerId, e) => {
  //   e.stopPropagation();

  //   try {
  //     const data = await api.delete(`/data/${customerId}`);
  //     if (data.data.success) {
  //       await fetchData();
  //       return { success: true, message: "User berhasil dihapus!" };
  //     } else {
  //       return {
  //         success: false,
  //         message: data.message || "Gagal mengambil data!",
  //       };
  //     }
  //   } catch (error) {
  //     return {
  //       success: false,
  //       message: error.response?.data?.message || "Gagal menghapus user",
  //     };
  //   }
  // };

  useEffect(() => {
    fetchData();
  }, []);

  // const { updateData } = useContext(LabelContext);

  const seen = new Set();
  const uniqueLines = data.filter((tag) => {
    if (seen.has(tag.line)) return false;
    seen.add(tag.line);
    return true;
  });

  const shapeIcons = [
    MdOutlineCircle,
    MdStarOutline,
    MdOutlineSquare,
    MdOutlinePentagon,
    MdOutlineHexagon,
    MdOutlineRectangle,
    RiTriangleLine,
    RiPokerDiamondsLine,
    PiStarAndCrescentLight,
    PiParallelogramBold,
    BsLightningCharge,
    RiPokerHeartsLine,
    BiCircleHalf,
    SiBastyon,
    GrFastForward,
    MdLabelImportantOutline,
    TiMinusOutline,
    TiStarburstOutline,
    MdFormatOverline,
    TiPlusOutline,
    TiThLargeOutline,
    TiWavesOutline,
    GiZigzagHieroglyph,
    IoMdCloudOutline,
    FaRegBookmark,
    RiMapLine,
    CiLocationArrow1,
    SiNextbilliondotai,
    LuFishSymbol,
    VscSymbolNumeric,
  ];

  return (
    // <>
    //   {/* <Breadcrumb /> */}
    //   <h1 className="text-2xl font-bold mb-4 text-blue-700">Pilih Line</h1>
    //   {uniqueLines.length > 0 ? (
    //     uniqueLines
    //       .filter((item) => item.line.trim() !== "")
    //       .map((item) => (
    //         <div className="p-4" key={item.line}>
    //           <ul>
    //             {/* <li
    //             className="cursor-pointer hover:text-[#105bdf] text-black font-bold border-1 rounded-md p-5"
    //             onClick={() => {
    //               navigate(`${item._id}`);
    //             }}
    //           >
    //             {item.nama} */}
    //             <li
    //               className="flex justify-between items-center cursor-pointer hover:bg-gray-50 text-black font-bold border-black border-1 rounded-md shadow-md p-5 transition-colors duration-200"
    //               onClick={() => {
    //                 navigate(`${item.line}`);
    //               }}
    //             >
    //               <span className="hover:text-[#105bdf]">{item.line}</span>
    //               {/* <button
    //               onClick={(e) => {
    //                 handleDeleteData(item._id, e);
    //               }}
    //               className="text-gray-500 hover:text-blue-600 p-3 cursor-pointer rounded-full bg-gray-200 hover:bg-blue-50 transition-colors duration-200"
    //               title="Edit Customer"
    //             >
    //               <MdDelete className="w-5 h-5" />
    //             </button> */}
    //               {/* <DeleteDataAction
    //               Id={item._id}
    //               onDeleteUser={handleDeleteData}
    //             /> */}
    //             </li>
    //             {/* </li> */}
    //           </ul>
    //         </div>
    //       ))
    //   ) : (
    //     <p>Loading data...</p>
    //   )}
    // </>
    <>
      {/* <Breadcrumb /> */}
      <div className="p-4 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-2 ml-2 text-gray-800 pb-4">
          Pilih Line
        </h1>
        {/* <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded hover:border-gray-600 border-transparent border-2 transition flex items-center gap-2"
          >
            <FaArrowLeft size={20} />
            Kembali
          </button> */}

        {/* <h1 className="text-2xl font-bold text-blue-700">Pilih Line</h1>

          <button
            onClick={() => navigate(1)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
          >
            Maju →
          </button> */}
        {/* </div> */}
        {/* <div className="grid grid-cols-6 gap-6 p-6">
          {shapeIcons.map((IconComponent, idx) => {
            const customSize = [13, 14, 20, 24, 27, 29].includes(idx) ? 28 : 32;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center gap-1 text-center text-gray-700 hover:text-blue-500 transition"
              >
                <IconComponent size={customSize} />

                <span className="text-xs">#{idx + 1}</span>
              </div>
            );
          })}
        </div> */}
        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {uniqueLines
              // .filter((item) => item.line.trim() !== "")
              .map((tag, idx) => {
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl shadow-lg border-2 border-blue-50 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(`${tag.line}-${idx}`)}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-700">
                        <MdOutlineDeviceHub size={30} />
                      </div>

                      <h3 className="text-xl font-bold text-blue-700 p-3">
                        {tag.line}
                      </h3>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </>
  );
}
