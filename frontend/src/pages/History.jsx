// import TabelLabel from "../components/Tabellabel";
import { useContext, useRef } from "react";
import { AuthContext } from "../context/auth.js";
import { useEffect, useState } from "react";
import api from "../utils/api";
import moment from "moment-timezone";
import { useReactToPrint } from "react-to-print";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function HistoryPage() {
  const { user } = useContext(AuthContext);

  const [absensiData, setAbsensiData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  // const [dataCust, setDataCust] = useState([]);
  // const [selectedDate, setSelectedDate] = useState(new Date());
  const contentRef = useRef(null);

  // const proses = [
  //   "Received Order",
  //   "Waiting Post",
  //   "Start Preparation",
  //   "Inspection",
  //   "Finish Preparation",
  //   "Ready to Shipping Area",
  //   "Create Surat Jalan",
  //   "Arrived Truck",
  //   "Departure Truck",
  // ];

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       setLoading(true);
  //       setError(null);
  //       const formattedDate = moment(absensiData.timestamp).format(
  //         "YYYY-MM-DD"
  //       );
  //       const response = await api.get(
  //         `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
  //       );

  //       if (response.data.data && response.data.data.length > 0) {
  //         setDataCust(response.data.data);
  //       } else {
  //         setDataCust([]);
  //         setError("No data found for the selected date");
  //       }
  //     } catch (err) {
  //       setError(err.response?.data?.message || "Failed to fetch data");
  //       setDataCust([]);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [customerId, cycleNumber, selectedDate, absensiData]);

  // const groupByDN = (data) => {
  //   const grouped = {};
  //   data.forEach((item) => {
  //     if (!grouped[item.dnNumber]) {
  //       grouped[item.dnNumber] = [];
  //     }
  //     grouped[item.dnNumber].push(item);
  //   });
  //   return grouped;
  // };

  // const groupedData = groupByDN(dataCust);

  // const formatTimeString = (dateString) => {
  //   console.log(dateString);
  //   if (!dateString) return "-";

  //   return moment(dateString).format("HH:mm");
  // };

  // const filteredProses = proses.filter((prosesName) =>
  //   prosesName.toLowerCase().includes("Arrived")
  // );

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  useEffect(() => {
    const fetchAbsensiData = async () => {
      try {
        setLoading(true);
        const dateStr = moment(selectedDate).format("YYYY-MM-DD");
        const response = await api.get(`/absensi/all?tanggal=${dateStr}`);

        if (response.data.data && response.data.data.length > 0) {
          setAbsensiData(response.data.data);
        } else {
          setAbsensiData([]);
          setError("No data found for the selected date");
        }
      } catch (err) {
        setError(err.message);
        setError(err.response?.data?.message || "Failed to fetch data");
        setAbsensiData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAbsensiData();
  }, [selectedDate]);

  // useEffect (() => {
  //   if (absensiData.length > 0) {
  //     const filtered = absensiData.filter(item => {
  //       const itemDate = item.timestamp.toDateString();
  //       const selectedDatestr = selectedDate.toDateString()
  //       return itemDate === selectedDatestr;
  //     })

  //     const mappedData = filtered.map(item => {
  //       return {
  //         ...item,
  //         process: item.scanType === "In" ? "Arrived Truck" : "Departure Truck"
  //       }
  //     })
  //   }
  // })

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Jakarta",
    });
  };

  const handlePrint = useReactToPrint({
    content: () => contentRef.current,
    pageStyle: `
      @page { size: auto; margin: 2mm; }
      @media print {
        body { -webkit-print-color-adjust: exact; }
        table { width: 100%; border-collapse: collapse; }
        th { background-color: #f9fafb !important; }
        tr { page-break-inside: avoid; }
      }
    `,
    contentRef: contentRef,
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Terjadi kesalahan saat mencetak dokumen.");
    },
    documentTitle: "Laporan Print",
    removeAfterPrint: true,
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "On Time":
        return "bg-green-100 text-green-800";
      case "Delay":
        return "bg-red-100 text-red-800";
      case "Advanced":
        return "bg-blue-100 text-blue-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function datetoUTCtoLocal(waktu) {
    return moment(waktu).format("HH:mm");
  }

  if (!user) {
    return <p>Loading...</p>;
  }

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

  const groupedData = absensiData.reduce((acc, item) => {
    if (!acc[item.truckName]) {
      acc[item.truckName] = [];
    }
    acc[item.truckName].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Riwayat Absensi Truk</h1>

      <div className="mb-4">
        <DatePicker
          selected={selectedDate}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          maxDate={new Date()}
          placeholderText="Pilih tanggal"
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      <div className="bg-white shadow overflow-hidden">
        <div ref={contentRef}>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Truck
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tanggal
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Kedatangan Truk
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  colSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Keberangkatan Truk
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Cycle
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tujuan
                </th>
                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Jenis
                </th>

                <th
                  rowSpan={2}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Hasil
                </th>
              </tr>
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Aktual
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Waktu Aktual
                </th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                    Memuat Data...
                  </td>
                </tr>
              ) : absensiData.length > 0 ? (
                Object.entries(groupedData).map(([truckName, item]) => {
                  const inScan = groupedData[truckName].find(
                    (item) => item.scanType === "In"
                  );
                  const outScan = groupedData[truckName].find(
                    (item) => item.scanType === "Out"
                  );
                  // console.log(groupedData, truckName, item, inScan, outScan);

                  // const outScanStatus = absensiData.find(
                  //   (scan) => scan.scanType === "Out"
                  // )?.status;
                  return (
                    <tr key={truckName} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {truckName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan ? formatDate(inScan?.createdAt) : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan ? datetoUTCtoLocal(inScan?.waktuStandar) : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan ? formatTime(inScan?.createdAt) : ""}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan && (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              inScan?.status
                            )}`}
                          >
                            {inScan?.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {outScan ? datetoUTCtoLocal(outScan?.waktuStandar) : ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {outScan ? formatTime(outScan?.createdAt) : ""}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        {outScan && (
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
                              outScan?.status
                            )}`}
                          >
                            {outScan?.status}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        C{inScan?.cycleNumber || outScan?.cycleNumber || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan?.destination || outScan?.destination || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {inScan?.typeTruck || outScan?.typeTruck || ""}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {(outScan && outScan?.status === "On Time") ||
                        outScan?.status === "Advanced" ? (
                          <span
                            className={
                              "inline-flex text-[13px] leading-5 font-semibold bg-green-500 rounded-xl w-[80px] p-1 justify-center text-white"
                            }
                          >
                            GOOD
                          </span>
                        ) : (
                          <span
                            className={
                              "inline-flex text-[13px] w-[80px] leading-5 font-semibold bg-red-500 rounded-xl text-white px-2 py-1 justify-center"
                            }
                          >
                            NOT GOOD
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={10} className="px-6 py-4 text-center">
                    {error ? error : "Tidak ada data absensi"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <div className="text-sm text-gray-500">
          Total {Math.round(absensiData.length / 2)} absensi
        </div>
        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Cetak Laporan
        </button>
      </div>
    </div>
  );
}
