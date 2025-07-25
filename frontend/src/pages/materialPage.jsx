import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabelContext from "../context/label";
import Breadcrumb from "../components/breadCrumb";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

export default function PageUniqueMaterial() {
  const navigate = useNavigate();
  const { line } = useParams();
  const [data, setData] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  // const [filteredData, setFilteredData] = useState([]);

  console.log(line, "ada ga");
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

  // const { dataLabel } = useContext(LabelContext);
  // console.log(data.find((item) => item._id === customerId, data, "data"));
  // const selected =
  //   data.find((item) => item._id === customerId)?.kolomSelected.data
  //     .part_name || [];
  // const uniqueCode = [...new Set(selected)];

  // console.log(uniqueCode);

  // const customer = data.find((item) => item._id === customerId);
  // const kolomData = useMemo(() => customer?.kolomSelected || [], [customer]);

  // const dates = useMemo(() => {
  //   const uniqueDates = [];
  //   kolomData.forEach((row) => {
  //     // item.data.forEach((dataItem) => {
  //     const data = row.data;
  //     for (const item in data) {
  //       if (item.delivery_date && !uniqueDates.includes(item.delivery_date)) {
  //         uniqueDates.push(item.delivery_date);
  //       }
  //     }
  //   });
  //   return uniqueDates;
  // }, [kolomData]);

  // const highlightDates = useMemo(() => {
  //   return dates.map((date) => new Date(date));
  // }, [dates]);

  // const dayClassName = (date) => {
  //   const hasData = highlightDates.some((d) => moment(d).isSame(date, "day"));
  //   const isSelected = selectedDate && moment(selectedDate).isSame(date, "day");
  //   const isDisabled = date > new Date();
  //   let classes = "rounded-full";

  //   if (isDisabled) {
  //     classes += "text-gray-400 cursor-not-allowed";
  //   } else if (isSelected) {
  //     classes += "bg-blue-600 text-white";
  //   } else if (hasData) {
  //     classes += "bg-blue-100 text-blue-800 font-medium";
  //   } else {
  //     classes += "hover:bg-gray-100";
  //   }
  //   return classes;
  // };

  // const handleClickDate = (Date) => {
  //   setSelectedDate(Date);
  // const newFilteredData = kolomData.flatMap((item) => {
  //   return item.data
  //     .filter((row) => {
  //       // console.log(
  //       //   row,
  //       //   "row",
  //       //   moment(row.delivery_date).format("YYYY-MM-DD"),
  //       //   moment(selectedDate).format("YYYY-MM-DD")
  //       // );
  //       return (
  //         moment(row.delivery_date).format("YYYY-MM-DD") ===
  //           moment(Date).format("YYYY-MM-DD") &&
  //         moment(row.delivery_date).isSame(Date, "day")
  //       );
  //     })
  //     .map((dataItem) => {
  //       const selectedIndex = item.data.findIndex((d) => d === dataItem);
  //       return {
  //         ...dataItem,
  //         selectedData: item.selectedData[selectedIndex],
  //       };
  //     });
  // });

  // console.log(
  //   newFilteredData,
  //   selectedDate,
  //   selectedDate === "2025-05-01T14:08:46.535Z",
  //   "contoh"
  // );
  // setFilteredData(newFilteredData);
  // };

  // console.log("KolomData:", kolomData, filteredData);

  // const filteredData = selectedDate
  //   ? kolomData.flatMap((item) =>
  //       item.data.filter(
  //         (dataItem) =>
  //           (dataItem.delivery_date === selectedDate ||
  //             dataItem.order_date === selectedDate ||
  //             item.createdAt === selectedDate) &&
  //           dataItem.part_no == uniqueCode
  //       )
  //     )
  //   : [];

  // const filteredData = kolomData.flatMap((item) =>
  //   item.data
  //     .filter((dataItem) => dataItem.part_no === uniqueCode && item.createdAt === selectedDate)
  //     .map((dataItem) => {
  //       const selectedIndex = item.data.findIndex((d) => d === dataItem);
  //       return {
  //         ...dataItem,
  //         selectedData: item.selectedData[selectedIndex],
  //         // sequence: item.sequence[uniqueCode]
  //       };
  //     })
  // );
  // const calculateQuantity = (filteredData) => {
  //   const totalQty = filteredData.reduce((acc, item) => {
  //     if (!acc[item.dn_number]) {
  //       acc[item.dn_number] = { totalQty: 0, items: [] };
  //     }
  //     acc[item.dn_number].totalQty += item.qty;
  //     acc[item.dn_number].items.push(item);
  //     return acc;
  //   }, {});

  //   const result = Object.keys(totalQty).map((dnNumber) => {
  //     // console.log(dnNumber, "RESULT");
  //     const dnData = totalQty[dnNumber];
  //     const total = dnData.totalQty;
  //     const itemCount = dnData.items.length;
  //     return total / itemCount;
  //   });

  //   return result;
  // };

  // const uniqueParts = kolomData.reduce((acc, item) => {
  //   item.data.forEach(part => {
  //     const exists = acc.find(p => p.part_name === part.part_name);
  //     if (!exists) {
  //       acc.push({
  //         part_name: part.part_name,
  //         part_code: part.part_code,
  //         createdAt: item.createdAt,
  //       });
  //     }
  //   });
  //   return acc;
  // }, []);

  // return (
  //   <>
  //     <Breadcrumb />
  //     <div className="p-4">
  //       <h1 className="text-xl font-bold mb-4">{dataLabel.name}</h1>
  //       <ul>
  //         {data.length > 0 ? (
  //           // kolomData.map((item, index) => {
  //           // const originalIndex = selected.findIndex((i) => i === item);
  //           // console.log(
  //           //   originalIndex,
  //           //   kolomData,
  //           //   kolomData[originalIndex].part_name
  //           // );
  //           data.map((tag, idx) => {
  //             return (
  //               <li
  //                 key={idx}
  //                 className="cursor-pointer text-[#105bdf] hover:underline"
  //                 onClick={() => {
  //                   navigate(`${tag.part_no || tag.material}`);
  //                 }}
  //               >
  //                 {tag.part_no || tag.material} :{" "}
  //                 {tag.part_name || tag.material_description}
  //               </li>
  //             );
  //           })
  //         ) : (
  //           //   </div>;
  //           // })
  //           <p>Data tidak ditemukan</p>
  //         )}
  //       </ul>
  //     </div>
  //   </>
  // );

  const uniqueMaterialCustomer = [];
  const seen = new Set();

  data.forEach((item) => {
    const key = `${item.material}-${item.customer_description}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueMaterialCustomer.push(item);
    }
  });

  return (
    <>
      {/* <Breadcrumb /> */}
      <div className="p-4 max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 rounded hover:border-gray-600 border-transparent border-2 transition flex items-center gap-2"
          >
            <FaArrowLeft size={20} />
            Kembali
          </button>
        </div>

        {data.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {uniqueMaterialCustomer
              .filter((item) => item.line === line.split("-")[0])
              .map((tag) => {
                const combinedKey = `${tag.material}_${tag.customer_description}`;
                return (
                  <div
                    key={combinedKey}
                    className="relative bg-white rounded-2xl shadow-lg border-2 border-blue-50 overflow-hidden cursor-pointer group"
                    onClick={() => navigate(combinedKey)}
                  >
                    <div className="p-5 flex items-start gap-4">
                      <div className="p-3 rounded-full bg-blue-50 text-blue-700">
                        <GiCardboardBoxClosed size={30} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-blue-700 mb-1">
                          {tag.part_name || tag.material_description}
                        </h3>
                        <p className="text-sm text-gray-500 ">
                          {tag.part_no || tag.material}
                        </p>
                      </div>
                    </div>
                    <div className="absolute bottom-2 right-3 text-xs text-gray-400">
                      {tag.customer_description}
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
