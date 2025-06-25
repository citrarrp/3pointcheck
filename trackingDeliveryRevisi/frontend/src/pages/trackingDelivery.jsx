import { Link, useNavigate } from "react-router";
import api from "../utils/api";
import { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";

export default function TrackingDelivery() {
  const [dataCustomer, setData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    api
      .get("/data")
      .then((res) => {
        setData(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // console.log(dataCustomer, "data");

  const handleEdit = (id, e) => {
    e.stopPropagation();
    navigate(`/updateCycle/${id}`);
  };
  return (
    <div className="max-w-full">
      <h1 className="text-xl font-bold mb-4">Tracking Delivery</h1>
      {dataCustomer.map((data, idx) => (
        <div className="p-4" key={idx}>
          <ul>
            <li
              className="flex justify-between items-center cursor-pointer hover:bg-gray-50 text-black font-bold border rounded-lg p-4 transition-colors duration-200"
              onClick={() => {
                navigate(`${data._id}`);
              }}
            >
              <span className="hover:text-[#105bdf]">{data.nama}</span>
              <button
                onClick={(e) => handleEdit(data._id, e)}
                className="text-gray-500 hover:text-blue-600 p-3 cursor-pointer rounded-full bg-gray-200 hover:bg-blue-50 transition-colors duration-200"
                title="Edit Customer"
              >
                <FaEdit className="w-5 h-5" />
              </button>
            </li>
          </ul>
        </div>
        // <div
        //   key={idx}
        //   className="flex items-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-100"
        // >
        //   <Link
        //     to={`/tracking/${data._id}`}
        //     className="flex-1 text-blue-600 hover:text-blue-800 font-bold text-lg transition-colors duration-200"
        //   >
        //     {data.nama}
        //   </Link>

        //   <svg
        //     xmlns="http://www.w3.org/2000/svg"
        //     className="h-5 w-5 text-gray-400 ml-2"
        //     viewBox="0 0 20 20"
        //     fill="currentColor"
        //   >
        //     <path
        //       fillRule="evenodd"
        //       d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        //       clipRule="evenodd"
        //     />
        //   </svg>
        // </div>
      ))}
    </div>
  );
}
