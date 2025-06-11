// import React, { useState } from "react";
// import QRCodeScanner from "react-qr-reader";
// import api from "../utils/api";
// const CameraScanner = () => {
//   const [data, setData] = useState("");
//   const [error, setError] = useState(null);

//   const handleScan = async (result) => {
//     if (result) {
//       setData(result);

//       //   fetch('https://your-api-endpoint.com/scan', {
//       //     method: 'POST',
//       //     headers: {
//       //       'Content-Type': 'application/json',
//       //     },
//       //     body: JSON.stringify({ scannedData: result }),
//       //   })
//       //     .then((response) => response.json())
//       //     .then((data) => {
//       //       console.log('Success:', data);
//       //     })
//       //     .catch((error) => {
//       //       console.error('Error:', error);
//       //     });

//   await api.post("/scan", {
//     scannedData: result,
//   });
//   alert("Registrasi sukses");
//     }
//   };

//   const handleError = (err) => {
//     setError(err);
//   };

//   return (
//     <div>
//       <h1>Scanner QR Code</h1>
//       <div style={{ width: "100%", height: "400px" }}>
//         <QRCodeScanner
//           delay={300}
//           onError={handleError}
//           onScan={handleScan}
//           style={{ width: "100%" }}
//         />
//       </div>
//       <div>
//         {error && <p>Error: {error.message}</p>}
//         {data && <p>Data QR Code: {data}</p>}
//       </div>
//     </div>
//   );
// };

// export default CameraScanner;

// import { useState } from "react";
// import QrScanner from "react-qr-scanner";
// import api from "../utils/api";

// export default function CameraScanner() {
//   const [scannedResult, setScannedResult] = useState(null);

//   const handleScan = async (data) => {
//     if (data) {
//       console.log("Hasil Scan:", data.text);
//       setScannedResult(data.text);

//       await api.post("/scan", {
//         scannedData: scannedResult,
//       });
//       alert("Registrasi sukses");
//     }
//   };

//   const handleError = (err) => {
//     console.error("Scan Error:", err);
//   };

//   const previewStyle = {
//     height: 240,
//     width: 320,
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       <h1 className="text-xl font-bold mb-4">QR Scanner</h1>

//       <QrScanner
//         delay={300}
//         style={previewStyle}
//         onError={handleError}
//         onScan={handleScan}
//       />

//       {scannedResult && (
//         <div className="mt-4">
//           <p className="text-green-600">Hasil: {scannedResult}</p>
//         </div>
//       )}
//     </div>
//   );
// }

// import { useState } from "react";
// import QrScanner from "../components/QRScanner";

// export default function ScannerPage() {
// const [scanResult, setScanResult] = useState("");

//   const handleScanSuccess = (decodedText) => {
//     setScanResult(decodedText);
//     // Contoh: POST ke server
//     // axios.post('/api/absen', { data: decodedText })
//   };

//   return (
// <div style={{ textAlign: "center", paddingTop: "50px" }}>
//   <h1>Scan QR untuk Absensi</h1>
//   {!scanResult ? (
//     <QrScanner onScanSuccess={handleScanSuccess} />
//   ) : (
//     <div>
//       <h2>Berhasil Scan:</h2>
//       <p>{scanResult}</p>
//     </div>
//   )}
// </div>
//   );
// }

// import { useState } from "react";
// import Html5QrcodePlugin from "../components/QRScanner";
// // import ResultContainerPlugin from "../components/resultQRScan";

// export default function ScannerPage() {
//   const [decodedResults, setDecodedResults] = useState([]);
//   const [scanResult, setScanResult] = useState("");
//   const onNewScanResult = (decodedText, decodedResult) => {
//     console.log("App [result]", decodedResult);
//     setDecodedResults((prev) => [...prev, decodedResult]);
//     setScanResult(decodedText);
//   };

//   return (
//     <div className="flex flex-col items-center p-10 bg-gray-100 rounded-lg shadow-md">
//       <h1 className="text-2xl font-bold mb-5 text-gray-800">
//         Scan QR untuk Absensi
//       </h1>
//       <div className="mb-8">
//         <Html5QrcodePlugin
//           fps={10}
//           qrbox={250}
//           disableFlip={false}
//           qrCodeSuccessCallback={onNewScanResult}
//         />
//       </div>
//       <div className="text-center">
//         <h2 className="text-xl font-semibold">Hasil Scan:</h2>
//         <p className="text-lg text-blue-600 mt-2">
//           {scanResult || "Belum ada hasil scan."}
//         </p>
//       </div>
//     </div>
//   );
// }

"use client";
import { useEffect, useState } from "react";
import Html5QrcodePlugin from "../components/QRScanner";
import api from "../utils/api";
// import ResultContainerPlugin from "../components/resultQRScan";

export default function ScannerPage() {
  // const [decodedResults, setDecodedResults] = useState([]);
  const [scanResult, setScanResult] = useState("");
  const [parsedResult, setParsedResult] = useState(null);
  const [result, setResult] = useState([]);
  const [showScanner, setShowScanner] = useState(true);
  const submitScan = async (data) => {
    console.log("masuk");
    try {
      const response = await api.post("/absensi/qr", data);
      setResult(response.data.data);
      console.log(response);
      setShowScanner(false);
      alert(response.data.message);
      // setParsedResult(null);
      // setDecodedResults([]);
      // setScanResult("");
      // alert(JSON.stringify(response.response.data.message));
    } catch (error) {
      console.error("Gagal kirim ke server:", error);
      console.log(error);
      alert(error.response.data.message);
      setParsedResult(null);
      // setDecodedResults([]);
      setScanResult("");
    }
  };

  const onNewScanResult = (decodedText, decodedResult) => {
    console.log("App [result]", decodedResult);
    // setDecodedResults((prev) => [...prev, decodedResult]);
    setScanResult(decodedText);
    console.log(decodedResult);

    try {
      const parsed = JSON.parse(decodedText);
      setParsedResult(parsed);
    } catch (error) {
      console.error("Gagal parsing hasil scan", error);
      setParsedResult(null);
    }
  };
  console.log(parsedResult, scanResult, "contoh");

  useEffect(() => {
    if (parsedResult) {
      console.log(parsedResult);
      submitScan(parsedResult);
    }
  }, [parsedResult]);

  const handleReset = () => {
    // setDecodedResults([]);
    setScanResult("");
    setParsedResult(null);
    setShowScanner(true);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
          Scan QR untuk Absensi
        </h1>

        {showScanner && (
          <div className="mb-6">
            <Html5QrcodePlugin
              fps={10}
              qrbox={250}
              disableFlip={false}
              qrCodeSuccessCallback={onNewScanResult}
            />
          </div>
        )}

        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold mb-2">Hasil Scan:</h2>
          {parsedResult ? (
            <div className="text-left bg-gray-100 p-4 rounded-md shadow-inner">
              {Object.entries(parsedResult).map(([key, value]) => {
                let displayValue = value;
                let hidden = false;

                if (key === "timestamp") {
                  const date = new Date(value);
                  displayValue = date.toLocaleString("id-ID", {
                    timeStyle: "short",
                  });
                }
                if (
                  key === "h" ||
                  key === "n" ||
                  key === "id" ||
                  key === "timestamp"
                ) {
                  hidden = true;
                  displayValue = undefined;
                }
                return (
                  <div key={key} className="mb-2">
                    <span
                      className={`font-semibold capitalize text-gray-700 ${
                        hidden ? "hidden" : ""
                      }`}
                    >
                      {key}:
                    </span>{" "}
                    <span className="text-gray-900">{displayValue}</span>
                  </div>
                );
              })}
              <div className="mb-2">
                <span className="font-semibold capitalize text-gray-700">
                  Waktu Absensi:
                </span>
                <span className="text-gray-900">
                  {" "}
                  {new Date(result.createdAt).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          ) : (
            <p className="text-gray-600">
              {scanResult || "Belum ada hasil scan."}
            </p>
          )}
        </div>
        {scanResult && (
          <div className="flex justify-center">
            <button
              onClick={handleReset}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
            >
              Scan Lagi
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
