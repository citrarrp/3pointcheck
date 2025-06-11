import { useEffect, useMemo, useState } from "react";
import CetakLabel from "../components/Preview";
import Breadcrumb from "../components/breadCrumb";
import { useLocation, useParams } from "react-router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment-timezone";

export default function PrintLabel() {
  const location = useLocation();
  console.log(location.pathname);
  const { customerId, uniqueCode } = useParams();
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredData, setFilteredData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`);
      const Data = await res.json();
      setData(Data.data);
      console.log("Data", Data);
    } catch (err) {
      console.log("ini");
      console.error("Failed to fetch schema fields:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(customerId, uniqueCode);

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

  const kolomData = useMemo(() => {
    const customer = data.find((item) => item._id === customerId);
    return customer?.kolomSelected || [];
  }, [data, customerId]);

  const dates = useMemo(() => {
    const uniqueDates = [];
    kolomData.forEach((item) => {
      // item.data.forEach((dataItem) => {
      const date = item.createdAt;
      if (date && !uniqueDates.includes(date)) {
        uniqueDates.push(date);
        // }
        // });
      } // tambahan
    });
    return uniqueDates;
  }, [kolomData]);

  console.log(dates, "tangal");

  useEffect(() => {
    fetchData();
    const newFilteredData = kolomData.flatMap((item) => {
      // const isSame = moment(item.createdAt).isSame(Date, "day");

      return item.data
        .filter((dataItem) => dataItem.part_no === uniqueCode)
        .map((dataItem) => {
          const selectedIndex = item.data.findIndex((d) => d === dataItem);
          return {
            ...dataItem,
            selectedData: item.selectedData[selectedIndex],
            // sequence: item.sequence[uniqueCode]
          };
        });
    });

    setFilteredData(newFilteredData);
  }, [kolomData, uniqueCode]);

  const highlightDates = useMemo(() => {
    return dates.map((date) => new Date(date));
  }, [dates]);

  const dayClassName = (date) => {
    const hasData = highlightDates.some((d) => moment(d).isSame(date, "day"));
    const isSelected = selectedDate && moment(selectedDate).isSame(date, "day");
    const isDisabled = date > new Date();
    let classes = "rounded-full";

    if (isDisabled) {
      classes += "text-gray-400 cursor-not-allowed";
    } else if (isSelected) {
      classes += "bg-blue-600 text-white";
    } else if (hasData) {
      classes += "bg-blue-100 text-blue-800 font-medium";
    } else {
      classes += "hover:bg-gray-100";
    }
    return classes;
  };

  const handleClickDate = (Date) => {
    // const filteredData = kolomData.flatMap((item) =>
    //   item.data.filter((dataItem) => {
    //     console.log(dataItem, "daraitem");
    //     return (
    //       // dataItem.delivery_date === Date ||
    //       // dataItem.order_date === Date ||
    //       isSameDay(new Date(item.createdAt), Date)
    //     );
    //   })
    // );
    console.log(filteredData, "filter");
    setSelectedDate(Date);
    const newFilteredData = kolomData.flatMap((item) => {
      // const isSame = moment(item.createdAt).isSame(Date, "day");

      return item.data
        .filter((dataItem) => dataItem.part_no === uniqueCode)
        .map((dataItem) => {
          const selectedIndex = item.data.findIndex((d) => d === dataItem);
          return {
            ...dataItem,
            selectedData: item.selectedData[selectedIndex],
            // sequence: item.sequence[uniqueCode]
          };
        });
    });
    console.log(
      newFilteredData,
      selectedDate,
      selectedDate === "2025-05-01T14:08:46.535Z",
      "contoh"
    );
    setFilteredData(newFilteredData);
  };
  console.log("KolomData:", kolomData);
  console.log("Filter conditions:", {
    uniqueCode,
    selectedDate,
  });
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

  const customer = data.find((item) => item._id === customerId);

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
  const calculateQuantity = (filteredData) => {
    const totalQty = filteredData.reduce((acc, item) => {
      if (!acc[item.dn_number]) {
        acc[item.dn_number] = { totalQty: 0, items: [] };
      }
      acc[item.dn_number].totalQty += item.qty;
      acc[item.dn_number].items.push(item);
      return acc;
    }, {});

    console.log(totalQty, "ttoal");

    const result = Object.keys(totalQty).map((dnNumber) => {
      console.log(dnNumber, "RESULT");
      const dnData = totalQty[dnNumber];
      const total = dnData.totalQty;
      const itemCount = dnData.items.length;
      return total / itemCount;
    });

    return result;
  };

  const qtyPerKanban = calculateQuantity(filteredData);

  console.log(uniqueCode, filteredData, qtyPerKanban, qtyPerKanban[0], "qty");
  return (
    <div>
      <Breadcrumb />

      <div className="p-4">
        {/* <DatePicker
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
        /> */}
      </div>
      {filteredData.length > 0 ? (
        <>
          {console.log(filteredData, "di klik", data.sequence)}

          <CetakLabel
            date={selectedDate || new Date()}
            data={filteredData}
            qty={qtyPerKanban[0]}
            code={uniqueCode}
            sequenceFirst={customer.sequence}
            // sequenceFirst={Number(filteredData.sequence)}
            separator={customer.separator}
          />
        </>
      ) : (
        // <CetakLabel data={filteredData}  />
        // <p>No data found for the selected date.</p>
        <p></p>
      )}
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
