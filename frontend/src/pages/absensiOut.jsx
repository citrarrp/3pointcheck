"use client";
import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import CryptoJS from "crypto-js";
import api from "../utils/api";

const AbsensiOutPage = () => {
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
        scanType: "Out",
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
        scanType: "Out",
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
                // onClick={() => setScanType("Out")}
                className={`px-4 py-2 rounded-lg transition-colors 
                    ? "bg-blue-600 text-white"
                    : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                }`}
              >
                Cycle
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
                  <p className="font-medium capitalize">Out</p>
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

export default AbsensiOutPage;
