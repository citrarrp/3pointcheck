import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Breadcrumb from "../components/breadCrumb";
// import LabelContext from "../context/label";
import api from "../utils/api";
import DeleteDataAction from "../components/deleteData";
import { MdDelete } from "react-icons/md";

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

  useEffect(() => {
    fetchData();
  }, []);

  // const { updateData } = useContext(LabelContext);

  return (
    <>
      <Breadcrumb />
      <h1 className="text-xl font-bold mb-4">Pilih Customer</h1>
      {data.length > 0 ? (
        data.map((item) => (
          <div className="p-4" key={item.nama}>
            <ul>
              {/* <li
                className="cursor-pointer hover:text-[#105bdf] text-black font-bold border-1 rounded-md p-5"
                onClick={() => {
                  navigate(`${item._id}`);
                }}
              >
                {item.nama} */}
              <li
                className="flex justify-between items-center cursor-pointer hover:bg-gray-50 text-black font-bold border rounded-lg p-5 transition-colors duration-200"
                onClick={() => {
                  navigate(`${item._id}`);
                }}
              >
                <span className="hover:text-[#105bdf]">{item.nama}</span>
                <button
                  onClick={(e) => {
                    handleDeleteData(item._id, e);
                  }}
                  className="text-gray-500 hover:text-blue-600 p-3 cursor-pointer rounded-full bg-gray-200 hover:bg-blue-50 transition-colors duration-200"
                  title="Edit Customer"
                >
                  <MdDelete className="w-5 h-5" />
                </button>
                {/* <DeleteDataAction
                  Id={item._id}
                  onDeleteUser={handleDeleteData}
                /> */}
              </li>
              {/* </li> */}
            </ul>
          </div>
        ))
      ) : (
        <p>Loading data...</p>
      )}
    </>
  );
}
