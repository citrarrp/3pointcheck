// // import { FaSquareXmark } from "react-icons/fa6";

// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useParams } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function DataTrackingTable() {
//   const [dataCust, setDataCust] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);
//   const { customerId, cycleNumber } = useParams();
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [totalPages, setTotalPages] = useState(1);

//   // const controllerRef = useRef(null);

//   console.log("masuk sini", customerId, cycleNumber);

//   useEffect(() => {
//     // const delayDebounce = setTimeout(() => {
//     //   setLoading(true);

//     //   if (controllerRef.current) {
//     //     controllerRef.current.abort();
//     //   }

//     //   const controller = new AbortController();
//     //   controllerRef.current = controller;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const formattedDate = selectedDate.toISOString().split("T")[0];
//         const data = await api.get(
//           `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//         );
//         setDataCust(data.data.data);
//         console.log(data, "masuk");
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Fetch error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     // fetch(
//     //   `${
//     //     import.meta.env.VITE_BACKEND_URL
//     //   }/api/data?search=${encodeURIComponent(
//     //     searchValue
//     //   )}&page=${currentPage}&limit=1`,
//     //   { signal: controller.signal }
//     // )
//     //   .then((res) => {
//     //     if (!res.ok) throw new Error("Network response was not ok");
//     //     return res.json();
//     //   })
//     // .then((json) => {
//     //   setData(json.data);
//     //   setTotalPages(json.totalPages);
//     //   setLoading(false);
//     // })
//     // .catch((err) => {
//     //   if (err.name !== "AbortError") {
//     //     console.error("Fetch error:", err);
//     //     setLoading(false);
//     //   }
//     // });
//     // }, 500);

//     fetchData();

//     // return () => clearTimeout(delayDebounce);
//   }, [customerId, cycleNumber, selectedDate]);

//   const proses = [
//     "Received Order",
//     "Waiting Post",
//     "Start Preparation",
//     "Inspection",
//     "Finish Preparation",
//     "Ready to Shipping Area",
//     "Create Surat Jalan",
//     "Arrived Truck",
//     "Departure Truck",
//   ];

//   const getProcessData = (processName) => {
//     return (
//       dataCust.find((item) => item.nama === processName) || {
//         nama: processName,
//         waktuStandar: "-",
//         waktuAktual: "-",
//         delay: "-",
//         status: "-",
//       }
//     );
//   };

//   const groupByDN = (data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       if (!grouped[item.dnNumber]) {
//         grouped[item.dnNumber] = [];
//       }
//       grouped[item.dnNumber].push(item);
//     });
//     return grouped;
//   };

//   const groupedData = groupByDN(dataCust);

//   console.log(dataCust)

//   // const [data, setData] = useState([
//   //   {
//   //     nama: "Received Order",
//   //     waktuStandar: "08:00",
//   //     waktuAktual: "08:05",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Waiting Post",
//   //     waktuStandar: "08:10",
//   //     waktuAktual: "08:10",
//   //     delay: "0 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Start Preparation",
//   //     waktuStandar: "08:15",
//   //     waktuAktual: "08:20",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Inspection",
//   //     waktuStandar: "08:40",
//   //     waktuAktual: "08:50",
//   //     delay: "10 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Finish Preparation",
//   //     waktuStandar: "08:50",
//   //     waktuAktual: "09:00",
//   //     delay: "10 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Ready to Shipping Area",
//   //     waktuStandar: "09:00",
//   //     waktuAktual: "09:15",
//   //     delay: "15 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Create Surat Jalan",
//   //     waktuStandar: "09:30",
//   //     waktuAktual: "09:35",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Arrived Truck",
//   //     waktuStandar: "09:50",
//   //     waktuAktual: "10:10",
//   //     delay: "20 menit",
//   //     status: "pending",
//   //   },
//   //   {
//   //     nama: "Departure Truck",
//   //     waktuStandar: "10:30",
//   //     waktuAktual: "-",
//   //     delay: "-",
//   //     status: "pending",
//   //   },
//   // ]);

//   console.log(dataCust, "customer");

//   //   return (
//   //     <div className="overflow-x-auto">
//   //       <input
//   //         type="text"
//   //         placeholder="Cari data..."
//   //         className="mb-4 p-2 border rounded w-full max-w-md"
//   //         value={searchValue}
//   //         onChange={(e) => setSearchValue(e.target.value)}
//   //       />

//   //       {loading && <p className="text-sm text-gray-500 mb-2">Loading...</p>}

//   //       <table className="table-fixed w-full border-collapse border">
//   //         <thead className="bg-gray-100">
//   //           <tr>
//   //             <th className="p-2 border w-1/5">Nama Proses</th>
//   //             <th className="p-2 border w-1/5">Waktu Standar</th>
//   //             <th className="p-2 border w-1/5">Waktu Aktual</th>
//   //             <th className="p-2 border w-1/5">Delay</th>
//   //             <th className="p-2 border w-1/5">Status</th>
//   //           </tr>
//   //         </thead>
//   //         <tbody className="w-full">
//   //           {dataCust.length === 0 && !loading ? (
//   //             <tr>
//   //               <td colSpan={5} className="text-center p-4 text-gray-500">
//   //                 Data tidak ditemukan
//   //               </td>
//   //             </tr>
//   //           ) : (
//   //             dataCust.map((item, idx) => (
//   //               <tr key={idx} className="text-center border-t">
//   //                 <td className="p-2 border">{item.nama}</td>
//   //                 <td className="p-2 border">{item.waktuStandar}</td>
//   //                 <td className="p-2 border">{item.waktuAktual}</td>
//   //                 <td className="p-2 border">{item.delay}</td>
//   //                 <td className="p-2 border">{item.status}</td>
//   //                  {/* <td className="p-2 border">
//   //                   {item.status === true || item.status === "done" ? (
//   //                     <FaCheckSquare className="text-green-500 inline" />
//   //                   ) : (
//   //                     <MdCheckBoxOutlineBlank className="text-gray-400 inline" />
//   //                   )}
//   //                 </td> */}
//   //               </tr>
//   //             ))
//   //           )}
//   //         </tbody>
//   //       </table>
//   //       {/* <div className="flex justify-center items-center gap-2 mt-4">
//   //         {Array.from({ length: totalPages }, (_, idx) => (
//   //           <button
//   //             key={idx}
//   //             className={`px-3 py-1 border rounded ${
//   //               currentPage === idx + 1 ? "bg-[#2c64c7] text-white" : "bg-white"
//   //             }`}
//   //             onClick={() => setCurrentPage(idx + 1)}
//   //           >
//   //             {idx + 1}
//   //           </button>
//   //         ))}
//   //       </div> */}
//   //     </div>
//   //   );
//   // };

//   // {excelHeaders
//   //   .filter((col) =>
//   //     col.toLowerCase().includes(searchTerm.toLowerCase())
//   //   )
//   //   .map((col, idx) => (
//   return (
//     <div>
//       {Object.entries(groupedData).map(([dnNumber, items]) => (
//         <div key={dnNumber} className="mb-6 border rounded shadow p-4">
//           <h2 className="text-lg font-bold mb-3">DN Number: {dnNumber}</h2>
//           <table className="min-w-full border-collapse border">
//             <thead className="bg-gray-100">
//               <tr> {/* header sama seperti sebelumnya */} </tr>
//             </thead>
//             <tbody>
//               {proses.map((prosesName, idx) => {
//                 const item = items.find((i) => i.nama === prosesName);
//                 return (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{prosesName}</td>
//                     <td>{dnNumber}</td>
//                     <td>{item?.waktuStandar || "-"}</td>
//                     <td>{item?.waktuAktual || "-"}</td>
//                     <td>{item?.delay || "-"}</td>
//                     <td>{item?.status || "-"}</td>
//                     <td>{item?.ket || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }

// // export default DataTrackingTable;

import { useEffect, useState } from "react";
import api from "../utils/api";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export default function DataTrackingTable() {
  const [dataCust, setDataCust] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { customerId, cycleNumber } = useParams();
  const [processes, setProcesses] = useState({});
  // const handleCheckboxChange = (e) => {
  // if (e.target.checked) {
  //   const now = new Date();
  //   const formattedTime = now.toLocaleTimeString("en-US", {
  //     hour: "2-digit",
  //     minute: "2-digit",
  //     hour12: false,
  //   });
  //   setCurrentTime(formattedTime);
  // } else {
  //   setCurrentTime("");
  // }
  // };

  const today = new Date();
  const besok = new Date(today);
  besok.setDate(today.getDate() + 1);

  function getDelay(item, proses, dn, isChecked, formattedTime) {
    let delay = null;
    let status = "-";

    const waktuAktualUTC = moment.utc(besok);
    const waktuStandarUTC = moment.utc(item.waktuStandar);

    const waktuStandarCorrected = waktuStandarUTC.set({
      year: waktuAktualUTC.year(),
      month: waktuAktualUTC.month(),
      date:
        item.nama === "Waiting Post"
          ? waktuAktualUTC.date() - 1
          : waktuAktualUTC.date(),
    });

    const waktuAktualJakarta = waktuAktualUTC.tz("Asia/Jakarta");
    const waktuStandarJakarta = waktuStandarCorrected.tz("Asia/Jakarta");

    const diffMinutes = waktuAktualJakarta.diff(waktuStandarJakarta, "minutes");

    // console.log(
    //   diffMinutes,
    //   "beda",
    //   waktuAktualJakarta,
    //   waktuStandarJakarta,
    //   item.waktuStandar
    // );
    if (diffMinutes > 0) {
      delay = `-${diffMinutes} menit`;
      status = "Delay";
    } else if (diffMinutes < 0) {
      delay = `+${diffMinutes * -1} menit`;
      status = "Advanced";
    } else {
      delay = `0 menit`;
      status = "On Time";
    }

    const key = `${proses}-${dn}`;
    setProcesses((prev) => ({
      ...prev,
      [key]: {
        checked: true,
        ...prev[key],
        time: isChecked ? formattedTime : "",
        delay: delay,
        status: status,
      },
    }));
  }

  const handleCheckboxChange = (proses, dn, item) => (e) => {
    const isChecked = e.target.checked || (item.waktuAktual ? true : false);
    const now = new Date();
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const key = `${proses}-${dn}`;
    setProcesses((prev) => ({
      ...prev,
      [key]: {
        checked: true,
        ...prev[key],
        time: isChecked ? formattedTime : "",
        delay: "",
        status: "",
      },
    }));

    getDelay(item, proses, dn, isChecked, formattedTime);
  };

  const proses = [
    "Received Order",
    "Waiting Post",
    "Start Preparation (Pulling)",
    "Inspection",
    "Finish Preparation",
    "Ready to Shipping Area",
    "Create Surat Jalan",
    "Arrived Truck",
    "Departure Truck",
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
        const response = await api.get(
          `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
        );

        if (response.data.data && response.data.data.length > 0) {
          setDataCust(response.data.data);
        } else {
          setDataCust([]);
          setError("No data found for the selected date");
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch data");
        setDataCust([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [customerId, cycleNumber, selectedDate]);

  const groupByDN = (data) => {
    const grouped = {};
    data.forEach((item) => {
      if (!grouped[item.dnNumber]) {
        grouped[item.dnNumber] = [];
      }
      grouped[item.dnNumber].push(item);
    });
    return grouped;
  };

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  const groupedData = groupByDN(dataCust);

  const formatTime = (dateString) => {
    if (!dateString) return "-";
    if (/^\d{2}:\d{2}$/.test(dateString)) return dateString;
    return moment.utc(dateString).format("HH:mm");
  };

  const filteredProses = proses.filter((prosesName) =>
    prosesName.trim().toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Data Tracking</h1>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Cari proses..."
              className="border rounded p-2 pl-10 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute left-3 top-2.5 text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">
              Pilih Tanggal :
            </label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="yyyy-MM-dd"
              className="border rounded p-2"
              maxDate={tomorrow}
            />
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading data...</p>
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && Object.keys(groupedData).length === 0 && !error && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          Data Tidak Ditemukan
        </div>
      )}

      {!loading && Object.keys(groupedData).length > 0 && (
        <div className="space-y-6">
          {Object.entries(groupedData).map(([dnNumber, items]) => (
            <div
              key={dnNumber}
              className="border rounded-lg shadow-sm overflow-hidden"
            >
              <div className=" px-4 py-3 border-b">
                <h2 className="text-lg font-semibold">DN Number: {dnNumber}</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Check
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Nama Proses
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waktu Standar
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Waktu Aktual
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Delay
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Keterangan
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProses.map((prosesName, idx) => {
                      console.log(
                        processes,
                        prosesName,
                        processes[(`${prosesName}-${dnNumber}`, "ini")]
                      );
                      const item = items.find((i) =>
                        prosesName.trim().includes(i.nama.trim())
                      );
                      return (
                        <tr
                          key={idx}
                          className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                        >
                          <td className="px-4 py-3  text-sm text-gray-500">
                            <input
                              type="checkbox"
                              className={"h-4 w-4 text-blue-600 rounded"}
                              // onChange={(e) => {
                              //   const isChecked = e.target.checked;
                              //   const newSelected = isChecked
                              //     ? [
                              //         ...selectedItems,
                              //         ...filteredProses.map(prosesName => `${dnNumber}-${prosesName}`)
                              //       ]
                              //     : selectedItems.filter(item => !item.startsWith(dnNumber));
                              //   setSelectedItems(newSelected);
                              // }}
                              // checked={filteredProses.every(prosesName =>
                              //   selectedItems.includes(`${dnNumber}-${prosesName}`)
                              // )}
                              checked={
                                processes[`${prosesName}-${dnNumber}`]
                                  ?.checked || item?.waktuAktual
                              }
                              onChange={handleCheckboxChange(
                                prosesName,
                                dnNumber,
                                item
                              )}
                            />
                          </td>
                          <td className="px-4 py-3  text-sm font-medium text-gray-900">
                            {prosesName}
                          </td>
                          <td className="px-4 py-3  text-sm text-gray-500">
                            {formatTime(item?.waktuStandar)}
                          </td>
                          <td className="px-4 py-3  text-sm text-gray-500">
                            {item?.waktuAktual
                              ? formatTime(item?.waktuAktual)
                              : processes[`${prosesName}-${dnNumber}`]
                              ? processes[`${prosesName}-${dnNumber}`].time
                              : ""}
                          </td>
                          <td className="px-4 py-3  text-sm text-gray-500">
                            {item?.delay ||
                              (processes[`${prosesName}-${dnNumber}`]
                                ? processes[`${prosesName}-${dnNumber}`].delay
                                : "-") ||
                              " "}
                          </td>
                          <td className="px-4 py-3 ">
                            <span
                              className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                processes[`${prosesName}-${dnNumber}`]
                                  ?.status === "On Time" ||
                                item?.status === "On Time"
                                  ? "bg-green-100 text-green-800"
                                  : processes[`${prosesName}-${dnNumber}`]
                                      ?.status === "Delay" ||
                                    item?.status === "Delay"
                                  ? "bg-red-100 text-red-800"
                                  : processes[`${prosesName}-${dnNumber}`]
                                      ?.status === "Advanced" ||
                                    item?.status === "Advanced"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item?.status === "-"
                                ? processes[`${prosesName}-${dnNumber}`]
                                  ? processes[`${prosesName}-${dnNumber}`]
                                      .status
                                  : ""
                                : item?.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-500">
                            {item?.ket || "-"}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
