// "use client";
// import React, { useState } from "react";
// import QRCode from "react-qr-code";

// const AbsensiPage = () => {
//   const [step, setStep] = useState(1);
//   const [milkrunOrDirect, setMilkrunOrDirect] = useState("");
//   const [scanType, setScanType] = useState("");
//   const [truckName, setTruckName] = useState("");
//   const [routeDetails, setRouteDetails] = useState(null);

//   const trucks = [
//     { id: 1, name: "Mobil 1", route: "Route 1", destination: "Destination A" },
//     { id: 2, name: "Mobil 2", route: "Route 2", destination: "Destination B" },
//     { id: 3, name: "Mobil 3", route: "Route 3", destination: "Destination C" },
//   ];

//   const handleSelectMilkrunDirect = (type) => {
//     setMilkrunOrDirect(type);
//     setStep(2);
//   };

//   const handleSelectScanType = (type) => {
//     setScanType(type);
//     setStep(3);
//   };

//   const handleSelectTruck = (truck) => {
//     setTruckName(truck.name);
//     setRouteDetails({
//       route: truck.route,
//       destination: truck.destination,
//       truckName: truck.name,
//     });
//     setStep(4);
//   };

//   const handleReset = () => {
//     setMilkrunOrDirect("");
//     setScanType("");
//     setTruckName("");
//     setRouteDetails(null);
//     setStep(1);
//   };

//   const generateQRValue = () => {
//     if (!routeDetails) return "";
//     return JSON.stringify({
//       truckName: routeDetails.truckName,
//       route: routeDetails.route,
//       destination: routeDetails.destination,
//       type: milkrunOrDirect,
//       scanType: scanType,
//       timestamp: new Date().toISOString(),
//     });
//   };

//   return (
//     <div className="min-h-screen py-8 px-4">
//       {/* className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden p-6" */}
//       <div>
//         {/* <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">
//           Sistem Absensi Truk
//         </h1> */}

//         <div className="flex justify-between mb-8 mx-10 ">
//           {[1, 2, 3, 4].map((stepNumber) => (
//             <div
//               key={stepNumber}
//               className={`flex flex-col items-center ${
//                 step >= stepNumber ? "text-blue-600" : "text-gray-400"
//               }`}
//             >
//               <div
//                 className={`w-8 h-8 flex items-center justify-center ${
//                   step >= stepNumber ? "text-blue-600" : "text-gray-200"
//                 }`}
//               >
//                 {stepNumber}
//               </div>
//               <span className="text-[13px] mt-1">
//                 {stepNumber === 1 && "Jenis"}
//                 {stepNumber === 2 && "Scan"}
//                 {stepNumber === 3 && "Truk"}
//                 {stepNumber === 4 && "Selesai"}
//               </span>
//             </div>
//           ))}
//         </div>

//         {step === 1 && (
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-center">
//               Pilih Jenis Pengiriman
//             </h2>
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={() => handleSelectMilkrunDirect("milkrun")}
//                 className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
//               >
//                 Milkrun
//               </button>
//               <button
//                 onClick={() => handleSelectMilkrunDirect("direct")}
//                 className="px-6 py-3 bg-green-100 hover:bg-green-200 text-green-800 rounded-lg transition-colors"
//               >
//                 Direct
//               </button>
//             </div>
//           </div>
//         )}

//         {step === 2 && (
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-center">
//               Pilih Tipe Scan
//             </h2>
//             <div className="flex gap-4 justify-center">
//               <button
//                 onClick={() => handleSelectScanType("in")}
//                 className="px-6 py-3 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-lg transition-colors"
//               >
//                 Scan In
//               </button>
//               <button
//                 onClick={() => handleSelectScanType("out")}
//                 className="px-6 py-3 bg-orange-100 hover:bg-orange-200 text-orange-800 rounded-lg transition-colors"
//               >
//                 Scan Out
//               </button>
//             </div>
//             <button
//               onClick={() => setStep(1)}
//               className="mt-4 text-sm text-gray-500 hover:text-gray-700"
//             >
//               Kembali
//             </button>
//           </div>
//         )}

//         {step === 3 && (
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-center">
//               Pilih Nama Truk
//             </h2>
//             <div className="grid gap-3">
//               {trucks.map((truck) => (
//                 <button
//                   key={truck.id}
//                   onClick={() => handleSelectTruck(truck)}
//                   className="px-4 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-left"
//                 >
//                   {truck.name} - {truck.route}
//                 </button>
//               ))}
//             </div>
//             <button
//               onClick={() => setStep(2)}
//               className="mt-4 text-sm text-gray-500 hover:text-gray-700"
//             >
//               Kembali
//             </button>
//           </div>
//         )}

//         {step === 4 && (
//           <div className="space-y-6">
//             <h2 className="text-lg font-semibold text-center">
//               Informasi Absensi
//             </h2>
//             <div className="bg-gray-50 p-4 rounded-lg">
//               <div className="grid grid-cols-2 gap-2 mb-4">
//                 <div>
//                   <p className="text-sm text-gray-500">Nama Truk</p>
//                   <p className="font-medium">{routeDetails.truckName}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Route</p>
//                   <p className="font-medium">{routeDetails.route}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Tujuan</p>
//                   <p className="font-medium">{routeDetails.destination}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Jenis</p>
//                   <p className="font-medium capitalize">{milkrunOrDirect}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Scan</p>
//                   <p className="font-medium capitalize">{scanType}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm text-gray-500">Waktu</p>
//                   <p className="font-medium">
//                     {new Date().toLocaleTimeString()}
//                   </p>
//                 </div>
//               </div>

//               <div className="flex justify-center p-4 bg-white rounded border">
//                 <QRCode value={generateQRValue()} size={200} />
//               </div>
//             </div>

//             <button
//               onClick={handleReset}
//               className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
//             >
//               Buat Absensi Baru
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AbsensiPage;
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import api from "../utils/api";
import DatePicker from "react-datepicker";

const AbsensiInPage = () => {
  const [milkrunOrDirect, setMilkrunOrDirect] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [scanType, setScanType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [trucks, setTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [status, setStatus] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const res = await api.get("/absensi/trucks");

        setTrucks(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil data", err);
      }
    };
    fetchTruck();
  }, []);

  useEffect(() => {
    if (!milkrunOrDirect) {
      setFilteredTrucks([]);
      return;
    }

    const filtered = trucks.filter(
      (tr) => tr.typeTruck.toLowerCase() === milkrunOrDirect.toLowerCase()
    );
    setFilteredTrucks(filtered);
    setSelectedTruck("");
    setSelectedCustomer("");
  }, [milkrunOrDirect, trucks]);

  const truckPartners = [
    ...new Set(filteredTrucks.map((truck) => truck.partnerName)),
  ];

  useEffect(() => {
    if (!selectedTruck) {
      setCustomers([]);
      return;
    }

    const customersForTruck = filteredTrucks
      .filter((truck) => truck.partnerName === selectedTruck)
      .map((truck) => truck.destination);

    setCustomers([...new Set(customersForTruck)]);
    setSelectedCustomer("");
  }, [selectedTruck, filteredTrucks]);

  useEffect(() => {
    const fetchCycles = async () => {
      if (!selectedCustomer) {
        setCycles([]);
        return;
      }

      try {
        const res = await api.get("/track/unik", {
          params: {
            customerName: selectedCustomer,
            tanggal: selectedDate,
          },
        });
        setCycles(res.data.data || []);
        setSelectedCycle("");
      } catch (err) {
        console.error("Failed to fetch cycles", err);
      }
    };

    fetchCycles();
  }, [selectedCustomer, selectedDate]);

  const handlePostAbsensi = async () => {
    if (!milkrunOrDirect || !selectedCycle || !scanType || !selectedTruck)
      return;
    try {
      const truck = filteredTrucks.find(
        (t) =>
          t.partnerName === selectedTruck && t.destination === selectedCustomer
      );

      if (!truck) {
        setStatus("error");
        return;
      }

      const time = new Date().toISOString();
      const payload = {
        id: truck._id,
        partnerName: truck.partnerName,
        route: truck.route,
        customer: truck.destination,
        milkrunOrDirect,
        scanType: scanType,
        cycle: selectedCycle,
        timestamp: time,
        selectedDate,
      };

      const payloadString = JSON.stringify(
        payload,
        Object.keys(payload).sort()
      );
      const secret = import.meta.env.VITE_QR_SECRET;
      const hmac = CryptoJS.HmacSHA512(payloadString, secret);

      const data = {
        ...payload,
        h: hmac.toString(CryptoJS.enc.Hex),
        n: CryptoJS.lib.WordArray.random(16).toString(),
      };

      const res = await api.post("/absensi/qr", data);
      if (res.data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  useEffect(() => {
    if (
      milkrunOrDirect &&
      selectedCycle &&
      scanType &&
      selectedTruck &&
      selectedCustomer
    ) {
      handlePostAbsensi();
    }
  }, [
    milkrunOrDirect,
    selectedCycle,
    scanType,
    selectedTruck,
    selectedCustomer,
  ]);

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-green-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-green-600 text-4xl mb-4">✓</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Absensi Berhasil
          </h1>
          <p className="text-gray-600">Data telah tersimpan dengan baik</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center p-8 bg-white rounded-lg shadow-md">
          <div className="text-red-600 text-4xl mb-4">✗</div>
          <h1 className="text-2xl font-bold text-red-600 mb-2">
            Absensi Gagal
          </h1>
          <p className="text-gray-600">Silakan coba lagi atau hubungi admin</p>
          <button
            onClick={() => setStatus(null)}
            className="mt-4 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-4 sm:px-6 lg:px-8 px-4 max-w-screen mx-auto space-y-6">
      <div className="p-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          Form Absensi Truk
        </h1>

        <div className="mb-6">
          <label
            htmlFor="tanggal"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Pilih Tanggal Absensi
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd-MM-yyyy"
            className="w-full p-3 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition duration-150 ease-in-out"
            placeholderText="Pilih tanggal"
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        {/* Step 1: Pilih Jenis Pengiriman */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">
            Pilih Jenis Pengiriman
          </h2>
          <div className="grid grid-cols-2 gap-3">
            {["Milkrun", "Direct"].map((type) => (
              <button
                key={type}
                onClick={() => setMilkrunOrDirect(type)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  milkrunOrDirect === type
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Pilih Pickup Status */}
        {milkrunOrDirect && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Pickup Status
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {["In", "Out"].map((type) => (
                <button
                  key={type}
                  onClick={() => setScanType(type)}
                  className={`px-4 py-2 rounded-lg transition-colors ${
                    scanType === type
                      ? "bg-green-600 text-white"
                      : "bg-green-100 text-green-800 hover:bg-green-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Pilih Truck */}
        {scanType && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Pilih Nama Truk
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {truckPartners.map((partnerName) => (
                <button
                  key={partnerName}
                  onClick={() => setSelectedTruck(partnerName)}
                  className={`px-4 py-3 rounded-lg transition-colors text-left ${
                    selectedTruck === partnerName
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {partnerName}
                </button>
              ))}
            </div>
          </div>
        )}

        {selectedTruck && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              {" "}
              Pilih Customer
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {customers.map((customer) => (
                <button
                  key={customer}
                  onClick={() => setSelectedCustomer(customer)}
                  className={`px-4 py-3 rounded-lg transition-colors text-left ${
                    selectedCustomer === customer
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 hover:bg-gray-200"
                  }`}
                >
                  {customer}
                </button>
              ))}
              {/* <select
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
          >
            <option value="">-- pilih customer --</option>
            {customers.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select> */}
            </div>
          </div>
        )}
        {/* Step 6: Pilih Cycle */}
        {selectedCustomer && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Pilih Cycle
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {cycles
                .sort((a, b) => a - b) // Mengurutkan angka secara numerik dari yang terkecil
                .map((cycle, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedCycle(cycle)}
                    className={`px-4 py-2 rounded-lg transition-colors ${
                      selectedCycle === cycle
                        ? "bg-purple-600 text-white"
                        : "bg-purple-100 text-purple-800 hover:bg-purple-200"
                    }`}
                  >
                    {cycle}
                  </button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsensiInPage;
