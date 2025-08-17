"use client";
import React, { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import api from "../utils/api";

const AbsensiInPage = () => {
  // State management
  const [milkrunOrDirect, setMilkrunOrDirect] = useState("");
  const [selectedCycle, setSelectedCycle] = useState("");
  const [scanType, setScanType] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [selectedTruck, setSelectedTruck] = useState("");
  const [trucks, setTrucks] = useState([]);
  const [filteredTrucks, setFilteredTrucks] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [cycles, setCycles] = useState([]);
  const [status, setStatus] = useState(null);
  const [selectedDate] = useState(
    new Date("2025-08-15").toISOString().slice(0, 10)
  );

  useEffect(() => {
    const fetchTrucks = async () => {
      try {
        const res = await api.get("/absensi/trucks");
        setTrucks(res.data.data);
      } catch (err) {
        console.error("Failed to fetch trucks", err);
      }
    };
    fetchTrucks();
  }, []);

  // Filter trucks based on selected type (Milkrun/Direct)
  useEffect(() => {
    if (!milkrunOrDirect) {
      setFilteredTrucks([]);
      return;
    }

    const filtered = trucks.filter(
      (truck) => truck.typeTruck.toLowerCase() === milkrunOrDirect.toLowerCase()
    );
    setFilteredTrucks(filtered);
    setSelectedTruck("");
    setSelectedCustomer("");
  }, [milkrunOrDirect, trucks]);

  // Get unique truck partners from filtered trucks
  const truckPartners = [
    ...new Set(filteredTrucks.map((truck) => truck.partnerName)),
  ];

  // Filter customers based on selected truck partner
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

  // Fetch cycles when customer is selected
  useEffect(() => {
    const fetchCycles = async () => {
      if (!selectedCustomer) {
        setCycles([]);
        return;
      }

      try {
        const res = await api.get("/track/", {
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

  // Handle form submission
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
        truckName: truck.partnerName,
        route: truck.route,
        destination: truck.destination,
        type: milkrunOrDirect,
        scanType: scanType,
        cycle: selectedCycle,
        timestamp: time,
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
      setStatus(res.data.success ? "success" : "error");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  // Auto-submit when all fields are filled
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

  // Status views
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

  // Main form
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">
        <div className="p-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-6">
            Form Absensi Truk
          </h1>

          {/* Step 1: Delivery Type */}
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              1. Jenis Pengiriman
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {["Milkrun", "Direct"].map((type) => (
                <button
                  key={type}
                  onClick={() => setMilkrunOrDirect(type)}
                  className={`py-2 px-4 rounded-lg transition-all ${
                    milkrunOrDirect === type
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Scan Type */}
          {milkrunOrDirect && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                2. Jenis Scan
              </h2>
              <div className="grid grid-cols-2 gap-3">
                {["In", "Out"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setScanType(type)}
                    className={`py-2 px-4 rounded-lg transition-all ${
                      scanType === type
                        ? "bg-green-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Truck Selection */}
          {scanType && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                3. Pilih Truk
              </h2>
              <select
                value={selectedTruck}
                onChange={(e) => setSelectedTruck(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Truk --</option>
                {truckPartners.map((partner) => (
                  <option key={partner} value={partner}>
                    {partner}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 4: Customer Selection */}
          {selectedTruck && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                4. Pilih Customer
              </h2>
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Customer --</option>
                {customers.map((customer) => (
                  <option key={customer} value={customer}>
                    {customer}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Step 5: Cycle Selection */}
          {selectedCustomer && (
            <div className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-3">
                5. Pilih Cycle
              </h2>
              <select
                value={selectedCycle}
                onChange={(e) => setSelectedCycle(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">-- Pilih Cycle --</option>
                {cycles.map((cycle, index) => (
                  <option key={index} value={cycle}>
                    {cycle}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Status Indicator */}
          {milkrunOrDirect &&
            scanType &&
            selectedTruck &&
            selectedCustomer &&
            selectedCycle && (
              <div className="mt-6 p-4 bg-blue-50 rounded-lg text-blue-700">
                <p>
                  Semua data sudah terisi. Sistem akan menyimpan data secara
                  otomatis...
                </p>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default AbsensiInPage;
