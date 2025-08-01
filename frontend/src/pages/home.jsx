// import TabelLabel from "../components/Tabellabel";
// import { useContext, useRef } from "react";
// import { AuthContext } from "../context/auth.js";
// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import moment from "moment-timezone";
// import { useReactToPrint } from "react-to-print";

import axios from "axios";
import useSWR from "swr";
import TimelineChart from "../components/TimelineChart";
// import CustomerTimeLine from "../components/customerProses";
import { useContext, useMemo, useState } from "react";
import DatePicker from "react-datepicker";
import moment from "moment-timezone";
import RealtimeTimer from "../components/realtimeTimer";
import { SidebarContext } from "../context/sidebar-context";
import { FaDisplay } from "react-icons/fa6";

const fetcher = (url) =>
  axios
    .get(url, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => res.data.data);

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const { isOpen, setIsOpen } = useContext(SidebarContext);

  // const { data, error } = useSWR(
  //   "http://192.168.56.1:3000/sodDiagram/api/sod/",
  //   fetcher,
  //   {
  //     refreshInterval: 60000, // 5 menit = 300.000 ms
  //     revalidateOnFocus: true,
  //   }
  // );

  const { data: dataTracking, error } = useSWR(
    `${import.meta.env.VITE_BACKEND_URL}/api/track`,
    fetcher,
    {
      refreshInterval: 60000, // 5 menit = 300.000 ms
      revalidateOnFocus: false,
    }
  );
  // mutate(
  //   `${import.meta.env.VITE_BACKEND_URL}/api/track`,
  //   async () => {
  //     const res = await axios.get(
  //       `${import.meta.env.VITE_BACKEND_URL}/api/track`
  //     );
  //     return res.data.data;
  //   },
  //   { revalidate: true }
  // );

  const filteredTrackingData = useMemo(() => {
    if (!dataTracking) return [];
    // console.log(dataTracking, "data tracking");

    const prosesYangDipilih = [
      "Start Preparation (Pulling)",
      "Finish Preparation",
      "Departure Truck",
    ];

    // Filter hanya proses prepare dan departure truck
    const filtered = dataTracking.filter((item) => {
      const isProsesdipilih =
        item.nama?.includes(prosesYangDipilih[0]) ||
        item.nama?.includes(prosesYangDipilih[1]) ||
        item.nama?.includes(prosesYangDipilih[2]);

      if (!selectedDate) return isProsesdipilih;
      const itemDay = moment
        .tz(item.waktuStandar, "Asia/Jakarta")
        .format("YYYY-MM-DD");
      const selectedDay = moment
        .tz(selectedDate, "Asia/Jakarta")
        .format("YYYY-MM-DD");
      // console.log(itemDay === selectedDay, isProsesdipilih);

      return isProsesdipilih && itemDay === selectedDay;
    });

    const uniqueMap = new Map();

    filtered.forEach((item) => {
      const tanggal = moment(item.tanggal).format("YYYY-MM-DD");
      const key = `${item.customerId?.nama}-${item.cycleNumber}-${item?.nama}-${tanggal}`;

      if (!uniqueMap.has(key)) {
        uniqueMap.set(key, {
          customer: item.customerId?.nama,
          cycle: item.cycleNumber,
          status: item.status,
          proses: item.nama,
          waktu: item.waktuStandar,
          totalPercentage: 0,
          count: 0,
          statuses: [],
          dnNumber: new Set(),
        });
      }
      const group = uniqueMap.get(key);
      if (item.nama.includes("Finish Preparation")) {
        group.totalPercentage += item?.persentase || 0;
        group.count += 1;
      }
      if (item.dnNumber) group.dnNumber.add(item.dnNumber);
      group.statuses.push(item?.status || null);
    });

    return Array.from(uniqueMap.values());
  }, [dataTracking, selectedDate]);

  // console.log(filteredTrackingData, "jumlah awal");
  const finalData = filteredTrackingData.map((group) => {
    const hasNull = group.statuses.some(
      (status) => status === null || status === undefined
    );

    let status = "-";
    if (!hasNull) {
      // Hitung kemunculan tiap status
      const statusCount = group.statuses.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
      }, {});

      // Ambil status dengan jumlah terbanyak
      status = Object.entries(statusCount).reduce((max, curr) => {
        return curr[1] > max[1] ? curr : max;
      })[0]; // ambil nama status
    }

    const percentage =
      group.proses.includes("Finish Preparation") && group.count > 0
        ? Math.round(group.totalPercentage / group.count)
        : 0;

    console.log(group.waktu, "waktu tampul");
    return {
      customer: group.customer,
      cycle: group.cycle,
      proses: group.proses,
      waktu: group.waktu,
      percentage: percentage,
      status,
    };
  });

  const handleSelectDate = (date) => {
    setSelectedDate(date); // Kalau kamu pakai komponen datepicker, pastikan update view-nya juga
  };

  if (error) return <div>Gagal memuat data...</div>;
  if (!dataTracking) return <div>Loading...</div>;
  // else {
  //   console.log(
  //     new Date(),
  //     import.meta.env.VITE_BACKEND_URL,
  //     filteredTrackingData,
  //     finalData,
  //     "ini akhir data"
  //   );
  // }
  return (
    <div
      className={`min-h-screen max-h-full ${
        isOpen ? "w-4xl" : "w-full"
      } transition-all duration-200`}
    >
      {isOpen && (
        <DatePicker
          selected={selectedDate}
          onChange={(date) => setSelectedDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          maxDate={new Date()}
          placeholderText="Pilih tanggal"
          showYearDropdown
          dropdownMode="select"
        />
      )}

      <div className="flex justify-between mx-4">
        <div className="flex items-center gap-4">
          <h1 className={`font-bold ${isOpen ? "text-lg" : "text-4xl"} my-10`}>
            Timeline Keberangkatan Truk
          </h1>
          {/* <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            className="p-4 rounded-full text-sm text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-gray-200"
          >
            <FaDisplay
              className={`${isOpen ? "w-5 h-5" : "w-7 h-7"} mx-auto`}
            />
          </button> */}
        </div>
        <RealtimeTimer />
      </div>

      {/* <CustomerTimeLine /> */}
      <TimelineChart
        open={isOpen}
        trackingData={finalData}
        selectDate={selectedDate}
        handleSelectedDate={handleSelectDate}
      />
      {/* <h2 className="font-semibold mb-2">Tracking Data:</h2>
      {dataTracking ? (
        <pre className="text-sm bg-white p-2 rounded overflow-x-auto">
          {JSON.stringify(dataTracking, null, 2)}
        </pre>
      ) : errorTracking ? (
        <p className="text-red-500">Error loading tracking data</p>
      ) : (
        <p>Loading tracking data...</p>
      )} */}
      {/* <ul>
        {filteredTrackingData.map((entry, index) => (
          <li key={index}>
            Customer: {entry.customer}, Cycle: {entry.cycle}, item:{" "}
            {entry.proses}, status: {entry.status}
          </li>
        ))}
      </ul> */}
    </div>
  );
}
// const { user } = useContext(AuthContext);

// const [absensiData, setAbsensiData] = useState([]);
// const [loading, setLoading] = useState(true);
// const [error, setError] = useState(null);

// useEffect(() => {
//   const fetchAbsensiData = async () => {
//     try {
//       const response = await api.get("/absensi/all");
//       setAbsensiData(response.data.data);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   fetchAbsensiData();
// }, []);

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

//   const handlePrint = useReactToPrint({
//     content: () => contentRef.current,
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
//       case "On Time":
//         return "bg-green-100 text-green-800";
//       case "Delay":
//         return "bg-red-100 text-red-800";
//       case "Advanced":
//         return "bg-yellow-100 text-yellow-800";
//       default:
//         return "bg-gray-100 text-gray-800";
//     }
//   };

//   function datetoUTCtoLocal(waktu) {
//     return moment(waktu).format("HH:mm");
//   }

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

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Riwayat Absensi Truk</h1>

//       <div className="bg-white shadow overflow-hidden">
//         <div ref={contentRef} className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Nama Truk
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Tanggal
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Waktu Aktual
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Waktu Plan
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Rute
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Tujuan
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Jenis
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Scan
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Status
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Hasil
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {absensiData.map((item) => {
//                 const hasOutScan = absensiData.some(
//                   (scan) => scan.scanType === "Out"
//                 );
//                 // const outScanStatus = absensiData.find(
//                 //   (scan) => scan.scanType === "Out"
//                 // )?.status;
//                 return (
//                   <tr key={item._id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="font-medium text-gray-900">
//                         {item.truckName}
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {formatDate(item.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {formatTime(item.timestamp)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {datetoUTCtoLocal(item.waktuStandar)}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.route}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.destination}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.typeTruck}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       {item.scanType}
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span
//                         className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                           item.status
//                         )}`}
//                       >
//                         {item.status}
//                       </span>
//                     </td>
//                     {item.scanType === "In" && (
//                       <td rowSpan={hasOutScan ? 2 : 1} key={item.customerId}>
//                         {hasOutScan
//                           ? (item.scanType === "Out" &&
//                               item.status === "On Time") ||
//                             item.status === "Advanced"
//                             ? "Good"
//                             : "Not Good"
//                           : "-"}
//                       </td>
//                     )}
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>

//         {absensiData.length === 0 && (
//           <div className="text-center py-8 text-gray-500">
//             Tidak ada data absensi
//           </div>
//         )}
//       </div>

//       <div className="mt-4 flex justify-between items-center">
//         <div className="text-sm text-gray-500">
//           Total {absensiData.length} absensi
//         </div>
//         <button
//           onClick={handlePrint}
//           className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//         >
//           Cetak Laporan
//         </button>
//       </div>
//     </div>
//   );
// }
