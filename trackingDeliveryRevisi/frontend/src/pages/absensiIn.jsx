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

"use client";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";
import api from "../utils/api";

const AbsensiInPage = () => {
  const [milkrunOrDirect, setMilkrunOrDirect] = useState("");
  // const [scanType, setScanType] = useState("");
  const [selectedTruck, setSelectedTruck] = useState(null);
  const [trucks, setTruck] = useState([]);
  const [qrValue, setQrValue] = useState("");

  useEffect(() => {
    const fetchTruck = async () => {
      try {
        const res = await api.get("/absensi/trucks");
        setTruck(res.data.data);
      } catch (err) {
        console.error("Gagal mengambil data", err);
      }
    };
    fetchTruck();

    const generateQRValue = () => {
      if (!selectedTruck) return "";

      const time = new Date().toISOString();
      const payload = {
        // return JSON.stringify({
        id: selectedTruck._id,
        truckName: selectedTruck.truckName,
        route: selectedTruck.route,
        destination: selectedTruck.destination,
        type: milkrunOrDirect,
        scanType: "In",
        timestamp: time,
        // });
      };

      const payloadString = JSON.stringify(
        payload,
        Object.keys(payload).sort()
      );
      const secret = import.meta.env.VITE_QR_SECRET;
      const hmac = CryptoJS.HmacSHA512(payloadString, secret);

      // console.log(secret, "teks", payloadString, time);
      // console.log(
      //   "FRONTEND SECRET:",
      //   JSON.stringify(import.meta.env.VITE_QR_SECRET)
      // );

      return JSON.stringify({
        h: hmac.toString(CryptoJS.enc.Hex),
        n: CryptoJS.lib.WordArray.random(16).toString(),
        id: selectedTruck._id,
        truckName: selectedTruck.truckName,
        route: selectedTruck.route,
        destination: selectedTruck.destination,
        type: milkrunOrDirect,
        scanType: "In",
        timestamp: time,
      });
    };

    if (selectedTruck) {
      setQrValue(generateQRValue());

      const interval = setInterval(() => {
        setQrValue(generateQRValue());
      }, 120000);

      return () => clearInterval(interval);
    }
  }, [selectedTruck, milkrunOrDirect]);

  // const handleReset = () => {
  //   setMilkrunOrDirect(" ");
  //   setScanType("");
  //   setSelectedTruck(null);
  // };
  return (
    <div className="min-h-screen py-2 px-4 max-w-screen mx-auto">
      <div className="space-y-6">
        {/* <button
          onClick={handleReset}
          className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          Buat Absensi Baru
        </button> */}
        {/* {  ( */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold">Pilih Jenis Pengiriman</h2>
          <div className="flex gap-4">
            <button
              onClick={() => setMilkrunOrDirect("Milkrun")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                milkrunOrDirect === "Milkrun"
                  ? "bg-blue-600 text-white"
                  : "bg-blue-100 text-blue-800 hover:bg-blue-200"
              }`}
            >
              Milkrun
            </button>
            <button
              onClick={() => setMilkrunOrDirect("Direct")}
              className={`px-4 py-2 rounded-lg transition-colors ${
                milkrunOrDirect === "Direct"
                  ? "bg-green-600 text-white"
                  : "bg-green-100 text-green-800 hover:bg-green-200"
              }`}
            >
              Direct
            </button>
          </div>
        </div>
        {/* )} */}
        {milkrunOrDirect && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Pilih Cycle</h2>
            <div className="flex gap-4">
              <button
                // onClick={() => setScanType("In")}
                className={`px-4 py-2 rounded-lg transition-colors 
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Cycle 1
              </button>
          
            </div>
          </div>
        )}

        {milkrunOrDirect && (
          <div className="space-y-6">
            <h2 className="text-lg font-bold">Pilih Nama Truk</h2>
            <div className="grid gap-4">
              {trucks
                .filter(
                  (tr) =>
                    tr.typeTruck.toLowerCase() === milkrunOrDirect.toLowerCase()
                )
                .map((truck) => (
                  <button
                    key={truck._id}
                    onClick={() => setSelectedTruck(truck)}
                    className={`px-4 py-3 rounded-lg transition-colors text-left ${
                      selectedTruck?._id === truck._id
                        ? "bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200"
                    }`}
                  >
                    {truck.truckName}
                  </button>
                ))}
            </div>
          </div>
        )}

        {selectedTruck && (
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-lg font-semibold mb-4">Informasi Absensi</h2>
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div>
                  <p className="text-sm text-gray-500">Nama Truk</p>
                  <p className="font-medium">{selectedTruck.truckName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Route</p>
                  <p className="font-medium">{selectedTruck.route}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Tujuan</p>
                  <p className="font-medium">{selectedTruck.destination}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Jenis</p>
                  <p className="font-medium capitalize">{milkrunOrDirect}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Scan</p>
                  <p className="font-medium capitalize">In</p>
                </div>
                {/* <div>
                  <p className="text-sm text-gray-500">Waktu</p>
                  <p className="font-medium">
                    {new Date().toLocaleTimeString()}
                  </p>
                </div> */}
              </div>

              <div className="flex justify-center p-4 bg-white rounded border w-fit">
                <QRCode value={qrValue} size={230} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AbsensiInPage;
