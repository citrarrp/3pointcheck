// // import TabelLabel from "../components/Tabellabel";
// import { useCallback, useContext, useRef } from "react";
// import { AuthContext } from "../context/auth.js";
// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useReactToPrint } from "react-to-print";
// import moment from "moment-timezone";

// export default function Home() {
//   const { user } = useContext(AuthContext);

//   const [absensiData, setAbsensiData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [shouldPrint, setShouldPrint] = useState(false);
//   const [dataTrack, setDataTrack] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(new Date());

//   // const proses = [
//   //   "Received Order",
//   //   "Waiting Post",
//   //   "Start Preparation",
//   //   "Inspection",
//   //   "Finish Preparation",
//   //   "Ready to Shipping Area",
//   //   "Create Surat Jalan",
//   //   "Arrived Truck",
//   //   "Departure Truck",
//   // ];

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);
//   //       const formattedDate = moment(absensiData.timestamp).format(
//   //         "YYYY-MM-DD"
//   //       );
//   //       const response = await api.get(
//   //         `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//   //       );

//   //       if (response.data.data && response.data.data.length > 0) {
//   //         setDataCust(response.data.data);
//   //       } else {
//   //         setDataCust([]);
//   //         setError("No data found for the selected date");
//   //       }
//   //     } catch (err) {
//   //       setError(err.response?.data?.message || "Failed to fetch data");
//   //       setDataCust([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [customerId, cycleNumber, selectedDate, absensiData]);

//   // const groupByDN = (data) => {
//   //   const grouped = {};
//   //   data.forEach((item) => {
//   //     if (!grouped[item.dnNumber]) {
//   //       grouped[item.dnNumber] = [];
//   //     }
//   //     grouped[item.dnNumber].push(item);
//   //   });
//   //   return grouped;
//   // };

//   // const groupedData = groupByDN(dataCust);

//   // const formatTimeString = (dateString) => {
//   //   console.log(dateString);
//   //   if (!dateString) return "-";

//   //   return moment(dateString).format("HH:mm");
//   // };

//   // const filteredProses = proses.filter((prosesName) =>
//   //   prosesName.toLowerCase().includes("Arrived")
//   // );

//   const fetchTrackData = useCallback(async (customerId, cycleNumber, date) => {
//     try {
//       const formattedDate = moment(date).format("YYYY-MM-DD");
//       const response = await api.get(
//         `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//       );

//       return response.data.data || [];
//     } catch (Err) {
//       console.error("Failed to fetch data", Err);
//       return [];
//     }
//   }, []);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
//         const absensiResponse = await api.get(
//           `/absensi/all?tanggal=${formattedDate}`
//         );
//         setAbsensiData(absensiResponse.data.data);
//         console.log(absensiResponse, "absensi");

//         const grouped = groupByCustomerAndCycle(absensiResponse.data.data);
//         const trackDataPromises = Object.keys(grouped).map(async (key) => {
//           const [customerId, cycleNumber] = key.split("-");
//           const data = await fetchTrackData(
//             customerId,
//             cycleNumber,
//             selectedDate
//           );
//           return { key, data };
//         });

//         const trackResults = await Promise.all(trackDataPromises);
//         const newTrackData = trackResults.reduce((acc, { key, data }) => {
//           acc[key] = data;
//           return acc;
//         }, {});

//         setDataTrack(newTrackData);
//       } catch (err) {
//         setError(err.response?.data?.message || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//     if (shouldPrint) {
//       handlePrint();
//       setShouldPrint(false);
//     }
//   }, [shouldPrint, handlePrint, selectedDate, fetchTrackData]);

//   const groupByCustomerAndCycle = (data) => {
//     return data.reduce((acc, item) => {
//       const key = `${item.customerId}-${item.cycleNumber}`;
//       if (!acc[key]) {
//         acc[key] = [];
//       }
//       acc[key].push(item);
//       return acc;
//     }, {});
//   };

//   const getPlannedTime = useCallback(
//     (item) => {
//       const key = `${item.customerId}-${item.cycleNumber}`;
//       const trackItems = dataTrack[key] || [];

//       if (item.scanType === "In") {
//         const arriveItem = trackItems.find((t) => t.nama === "Arrive");
//         return arriveItem?.waktuStandar || "-";
//       } else {
//         const departureItem = trackItems.find((t) => t.nama === "Departure");
//         return departureItem?.waktuStandar || "-";
//       }
//     },
//     [dataTrack]
//   );

//   // useEffect (() => {
//   //   if (absensiData.length > 0) {
//   //     const filtered = absensiData.filter(item => {
//   //       const itemDate = item.timestamp.toDateString();
//   //       const selectedDatestr = selectedDate.toDateString()
//   //       return itemDate === selectedDatestr;
//   //     })

//   //     const mappedData = filtered.map(item => {
//   //       return {
//   //         ...item,
//   //         process: item.scanType === "In" ? "Arrived Truck" : "Departure Truck"
//   //       }
//   //     })
//   //   }
//   // })

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleDateString("id-ID", {
//       day: "2-digit",
//       month: "long",
//       year: "numeric",
//     });
//   };

//   const formatTime = (dateString) => {
//     return new Date(dateString).toLocaleTimeString("id-ID", {
//       hour: "2-digit",
//       minute: "2-digit",
//       timeZone: "Asia/Jakarta",
//     });
//   };

//   // const formatTime = (dateString) => {
//   //   if (!dateString) return "-";
//   //   return moment(dateString).tz("Asia/Jakarta").format("HH:mm");
//   // };

//   // const getPlannedTime = (item) => {
//   //   const truck = getTruckDetails(item.truckName);
//   //   return item.scanType === "In" ? item.waktuStandar find (item => item.nama == "Arrive" : truck.departureTime;
//   // };

//   const contentRef = useRef(null);
//   const handlePrint = useReactToPrint({
//     content: () => contentRef.current,
//     contentRef: contentRef,
//     onPrintError: (error) => {
//       console.error("Print error:", error);
//       alert("Terjadi kesalahan saat mencetak dokumen.");
//     },
//     documentTitle: "Laporan Print",
//     removeAfterPrint: true,
//     pageStyle: `
//       @page { size: auto; margin: 5mm; }
//       @media print {
//         body { -webkit-print-color-adjust: exact; }
//         table { width: 100%; border-collapse: collapse; }
//         th { background-color: #f9fafb !important; }
//         tr { page-break-inside: avoid; }
//       }
//     `,
//   });
//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Ontime":
//         return "bg-green-100 text-green-800";
//       case "Delay":
//         return "bg-red-100 text-red-800";
//       case "Advance":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);
//   //       const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
//   //       const response = await api.get(
//   //         `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//   //       );

//   //       if (response.data.data && response.data.data.length > 0) {
//   //         setDataCust(response.data.data);
//   //       } else {
//   //         setDataCust([]);
//   //         setError("No data found for the selected date");
//   //       }
//   //     } catch (err) {
//   //       setError(err.response?.data?.message || "Failed to fetch data");
//   //       setDataCust([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [customerId, cycleNumber, selectedDate]);

//   // const groupByDN = (data) => {
//   //   const grouped = {};
//   //   data.forEach((item) => {
//   //     if (!grouped[item.dnNumber]) {
//   //       grouped[item.dnNumber] = [];
//   //     }
//   //     grouped[item.dnNumber].push(item);
//   //   });
//   //   return grouped;
//   // };

//   // const groupedData = groupByDN(dataCust);

//   if (!user) {
//     return <p>Loading...</p>;
//   }

//   if (loading) {
//     return <div className="text-center py-8">Memuat data...</div>;
//   }

//   if (error) {
//     return (
//       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//         Error: {error}
//       </div>
//     );
//   }

//   console.log(groupByCustomerAndCycle);
//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Riwayat Absensi Truk</h1>

//       <div className="bg-white shadow overflow-hidden">
//         <div ref={contentRef} className="overflow-x-auto">
//           {Object.entries(groupByCustomerAndCycle(absensiData)).map(
//             ([key, items]) => {
//               return (
//                 <div key={key} className="mb-8">
//                   <h2 className="text-xl font-semibold mb-4">
//                     Customer: {items[0].customerId} - Cycle:{" "}
//                     {items[0].cycleNumber}
//                   </h2>

//                   <table className="min-w-full divide-y divide-gray-200">
//                     <thead className="bg-gray-50">
//                       <tr>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Nama Truk
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Tanggal
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Waktu Aktual
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Waktu Plan
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Rute
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Tujuan
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Jenis
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Scan
//                         </th>
//                         <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                           Status
//                         </th>
//                       </tr>
//                     </thead>
//                     <tbody className="bg-white divide-y divide-gray-200">
//                       {absensiData.map((item) => (
//                         <tr key={item._id} className="hover:bg-gray-50">
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <div className="font-medium text-gray-900">
//                               {item.truckName}
//                             </div>
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {formatDate(item.timestamp)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {formatTime(item.timestamp)}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {/* {item.truckName} */}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.route}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.destination}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.typeTruck}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             {item.scanType}
//                           </td>
//                           <td className="px-6 py-4 whitespace-nowrap">
//                             <span
//                               className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                                 item.status
//                               )}`}
//                             >
//                               {item.status}
//                             </span>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               );
//             }
//           )}
//         </div>

//         {absensiData.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             Tidak ada data absensi
//           </div>
//         )}
//       </div>

//       {/* Fitur tambahan */}
//       <div className="mt-4 flex justify-between items-center">
//         <div className="text-sm text-gray-500">
//           Total {absensiData.length} absensi
//         </div>
//         <button
//           // onClick={setShouldPrint(!shouldPrint)}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Cetak Laporan
//         </button>
//       </div>
//     </div>
//   );
// }
