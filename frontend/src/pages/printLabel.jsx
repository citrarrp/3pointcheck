import { useEffect, useMemo, useState } from "react";
import CetakLabel from "../components/Preview";
import Breadcrumb from "../components/breadCrumb";
import { useLocation, useNavigate, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";
import CetakTag from "../components/PilihTag";
import api from "../utils/api";
import { FaArrowLeft } from "react-icons/fa";

export default function PrintLabel() {
  // const location = useLocation();
  const { line, uniqueCode } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [dataMaterial, setDataMaterial] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(null);
  // const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/data/all/unique");

      console.log(res.data.data, "isi hasil semua");
      setData(res.data.data);
      console.log("data ada", res.data.data);
    } catch (err) {
      console.error("Failed to fetch schema fields:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMaterial = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/materials");

      setDataMaterial(res.data.data);
    } catch (err) {
      console.error("Failed to fetch schema fields:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      await fetchData();
      await fetchMaterial();
    };
    fetchAll();
  }, []);

  // const formatDate = (date) => {
  //   const options = { year: "numeric", month: "long", day: "numeric" };
  //   return new Date(date).toLocaleDateString("id-ID", options);
  // };

  // const { dataLabel } = useContext(LabelContext);

  // const selected =
  //   data.find((item) => item._id === customerId)?.selectedData || []; ini tadi

  // const matchSelected = selected.filter((item) => item === uniqueCode);

  // const selectedIndex = data.findIndex((item) => item._id === customerId); ini tadi

  // const uniqueLabels = [
  //   ...new Set(
  //     data?.[selectedIndex]?.kolomSelected?.data.filter((item) =>
  //       item.dn_number.toLowerCase().includes(uniqueCode.toLowerCase)
  //     )
  //   ),
  // ];

  // const customer = data.find((item) => item._id === customerId);
  // const kolomData = customer?.kolomSelected || [];

  // const dates = [];
  // kolomData.forEach((item) => {
  //   console.log("tem");
  //   let i = 0;
  //   item.data.forEach((dataItem) => {
  //     const date =
  //       dataItem.delivery_date || dataItem.order_date || dataItem.createdAt;
  //     if (date) {
  //       console.log(date, i, "indez");
  //       i += 1;
  //       dates.push(date);
  //       console.log(dates);
  //     }
  //   });
  // });

  // const kolomData = useMemo(() => {
  //   const customer = data.find((item) => item._id === customerId);
  //   return customer?.kolomSelected || [];
  // }, [data, customerId]);

  // const dates = useMemo(() => {
  //   const uniqueDates = [];
  //   kolomData.forEach((item) => {
  //     // item.data.forEach((dataItem) => {
  //     const date = item.createdAt;
  //     if (date && !uniqueDates.includes(date)) {
  //       uniqueDates.push(date);
  //       // }
  //       // });
  //     } // tambahan
  //   });
  //   return uniqueDates;
  // }, [kolomData]);

  // useEffect(() => {
  //   fetchData();
  //   const newFilteredData = kolomData.flatMap((item) => {
  //     // const isSame = moment(item.createdAt).isSame(Date, "day");

  //     return item.data
  //       .filter(
  //         (dataItem) =>
  //           dataItem.part_no === uniqueCode || dataItem?.material === uniqueCode
  //       )
  //       .map((dataItem) => {
  //         const selectedIndex = item.data.findIndex((d) => d === dataItem);
  //         return {
  //           ...dataItem,
  //           selectedData: item.selectedData[selectedIndex],
  //           // sequence: item.sequence[uniqueCode]
  //         };
  //       });
  //   });

  //   setFilteredData(newFilteredData);
  // }, [kolomData, uniqueCode]);

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
  //   // const filteredData = kolomData.flatMap((item) =>
  //   //   item.data.filter((dataItem) => {
  //   //     console.log(dataItem, "daraitem");
  //   //     return (
  //   //       // dataItem.delivery_date === Date ||
  //   //       // dataItem.order_date === Date ||
  //   //       isSameDay(new Date(item.createdAt), Date)
  //   //     );
  //   //   })
  //   // );
  //   setSelectedDate(Date);
  //   const newFilteredData = kolomData.flatMap((item) => {
  //     // const isSame = moment(item.createdAt).isSame(Date, "day");

  //     return item.data
  //       .filter(
  //         (dataItem) =>
  //           dataItem.part_no === uniqueCode || dataItem?.material === uniqueCode
  //       )
  //       .map((dataItem) => {
  //         const selectedIndex = item.data.findIndex((d) => d === dataItem);
  //         return {
  //           ...dataItem,
  //           selectedData: item.selectedData[selectedIndex],
  //           // sequence: item.sequence[uniqueCode]
  //         };
  //       });
  //   });
  // console.log(
  //   newFilteredData,
  //   selectedDate,
  //   selectedDate === "2025-05-01T14:08:46.535Z",
  //   "contoh"
  // );
  //   setFilteredData(newFilteredData);
  // };
  // console.log("KolomData:", kolomData);
  // console.log("Filter conditions:", {
  //   uniqueCode,
  //   selectedDate,
  // });
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

  const filteredData = useMemo(() => {
    console.log(
      data,
      data.filter(
        (item) =>
          item.material === uniqueCode.split("_")[0] &&
          item.line === line.split("-")[0]
      )
    );
    return data.filter(
      (item) =>
        item.material === uniqueCode.split("_")[0] &&
        item.line === line.split("-")[0]
    );
  }, [data, uniqueCode, line]);

  const uniqueMaterial = useMemo(() => {
    return dataMaterial.filter(
      (item) =>
        item.material === uniqueCode.split("_")[0] &&
        item.customer.includes(uniqueCode.split("_")[1])
    );
  }, [dataMaterial, uniqueCode]);

  function getPrefixOnly(code) {
    const match = code.match(/^([A-Z]+)/);
    return match ? match[1] : "";
  }
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

  // const qtyPerKanban = calculateQuantity(filteredData);
  // console.log(line, "nah ini line");
  // console.log(uniqueCode, filteredData, qtyPerKanban, qtyPerKanban[0], "qty");
  return (
    // <div>
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
      {/* <Breadcrumb /> */}

      {/* <div className="p-4">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => handleClickDate(date)}
          dateFormat="dd/MM/yyyy"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          dayClassName={dayClassName}
          highlightDates={highlightDates}
          maxDate={new Date()}
          placeholderText="Pilih Tanggal"
          // inline
          // calendarClassName="border border-gray-200 rounded-lg shadow-md p-2"
        />
      </div> */}
      {/* {filteredData.length > 0 ? ( */}
      <>
        {/* {console.log(filteredData, "di klik", data.sequence)} */}

        <CetakTag
          // date={selectedDate || new Date()}
          dataAsli={filteredData}
          data={uniqueMaterial}
          lineAt={line}
          code={uniqueCode.split("_")[0]}
          // sequenceFirst={Number(filteredData.sequence)}

          customer={getPrefixOnly(uniqueCode.split("_")[1])}
        />
      </>
      {/* ) : ( */}
    </div>
  );
}

// {dataPrint.length > 0 ? (
//       dataPrint.map((item, index) => (
//    <div key={index}>
//           {item} | asdmkasd
//           {unique}
//           {kolomData.length > 0 ? (
//             kolomData.map(
//               (item, index) => (
//                 const originalIndex = selected.findIndex((i) => i === item);
//                 console.log(
//                   originalIndex,
//                   kolomData,
//                   kolomData[originalIndex].part_name
//                 );

//                 [
//                   ...new Map(
//                     kolomData
//                       .flatMap((item) =>
//                         item.data.map((part) => ({
//                           all: item,
//                           ...part,
//                         }))
//                       )
//                       .map((part) => [part.part_no, part])
//                   ).values(),
//                 ].map((part, idx) => {
//                   console.log(part, part.all, "part");
//                 return (
//                 <div key={index}>
//                   {item.data.map((dataItem, dataIndex) => {
//                     console.log(dataItem);
//                     const date =
//                       dataItem.delivery_date ||
//                       dataItem.order_date ||
//                       item.createdAt;
//                     return (
//                       <div key={dataIndex} className="date-container">
//                         <div
//                           className="date-item"
//                           onClick={() => handleClickDate(date)}
//                           style={{ cursor: "pointer", color: "#105bdf" }}
//                         >
//                           {formatDate(date)}
//                         </div>
//                       </div>
//                     );
//                   })}
//                   <CetakLabel
//                     data={item}
//                     datakolomSelected={item.data}
//                     selectedData={item.selectedData}
//                     code={item.part_no}
//                   />
//                 </div>
//               )
//               })
//             )
//           ) : (
//               </div>;
//             })
//             <p>Loading data...</p>
//           )}
//        </div>
//           ))
//           ) : (
//             <p>Loading data...</p>
//           )}
