// import { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import moment from "moment-timezone";

// function UpdateForm({ customerId, onClose }) {
//   const [fileName, setFileName] = useState("");
//   const [excelHeaders, setExcelHeaders] = useState([]);
//   const [excelData, setExcelData] = useState([]);
//   const [existingData, setExistingData] = useState(null);
//   const [mapping, setMapping] = useState({});
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [showTable, setShowTable] = useState(false);

//   // Fetch existing data to get sourceLabel and separator
//   useEffect(() => {
//     const fetchExistingData = async () => {
//       try {
//         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${customerId}`);
//         const data = await res.json();
//         setExistingData(data);

//         // Auto-map based on sourceLabel if available
//         if (data.sourceLabel) {
//           const autoMapping = {};
//           Object.entries(data.sourceLabel).forEach(([schema, excelCol]) => {
//             autoMapping[schema] = excelCol;
//           });
//           setMapping(autoMapping);
//         }

//         // Auto-select columns for unique code if selectedData exists
//         if (data.selectedData && data.selectedData.length > 0) {
//           // Ini perlu disesuaikan dengan logika Anda untuk menentukan kolom yang dipilih
//           // Contoh sederhana - ambil dari mapping pertama
//           if (data.sourceLabel) {
//             const firstMappedCol = Object.values(data.sourceLabel)[0];
//             if (firstMappedCol) {
//               setSelectedColumns([firstMappedCol]);
//             }
//           }
//         }
//       } catch (err) {
//         console.error("Failed to fetch existing data:", err);
//       }
//     };

//     if (customerId) {
//       fetchExistingData();
//     }
//   }, [customerId]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
//     setFileName(nameWithoutExt);

//     const customers = nameWithoutExt.split("&").map(name => name.trim());

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const sheets = XLSX.read(data, { type: "binary", cellDates: true });

//       const sheetName = sheets.SheetNames[0];
//       const sheet = sheets.Sheets[sheetName];

//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//       const columns = jsonData[0];
//       const rows = XLSX.utils.sheet_to_json(sheet);

//       setExcelHeaders(columns);
//       setExcelData(rows);
//       setShowTable(true);
//     };
//     reader.readAsBinaryString(file);
//   };

//   const extractColon = (str) => {
//     if (typeof str !== "string") return str;
//     return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str;
//   };

//   const handleUpdate = async () => {
//     if (!existingData) return;

//     try {
//       const formatValue = (val) => {
//         if (val instanceof Date && !isNaN(val)) {
//           return moment(val).tz("Asia/Jakarta").format("DDMMYYYY");
//         }

//         const parsedDate = moment.tz(
//           val,
//           ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
//           true,
//           "Asia/Jakarta"
//         );
//         if (parsedDate.isValid()) {
//           return parsedDate.format("DDMMYYYY");
//         }
//         return val ?? "";
//       };

//       // Prepare selectedData (kode unik) menggunakan separator dari data existing
//       const selectedData = excelData.map((row) =>
//         selectedColumns
//           .map((col) => formatValue(row[col]))
//           .map((value) => extractColon(value))
//           .join(existingData.separator || "-") // Gunakan separator dari data existing
//       );

//       // Prepare kolomSelected data
//       const kolomSelected = excelData.map((row) =>
//         Object.entries(mapping).reduce((mappedRow, [schema, excelCol]) => {
//           let val = row[excelCol] ?? null;
//           if (typeof val === "string" && val.includes(":")) {
//             val = val.split(":")[1]?.trim() ?? val;
//           }
//           mappedRow[schema] = extractColon(val);
//           return mappedRow;
//         }, {})
//       );

//       const payload = {
//         kolomSelected,
//         selectedData
//       };

//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${customerId}`, {
//         method: "PATCH",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();
//       if (result.success) {
//         alert("Data berhasil diupdate!");
//         onClose();
//       } else {
//         alert("Gagal update data: " + result.message);
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Error updating data");
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Update Data Customer</h2>

//       <div className="mb-4">
//         <label className="block mb-2 font-medium">Upload File Excel Baru</label>
//         <input
//           type="file"
//           className="block w-full text-sm text-gray-500
//             file:mr-4 file:py-2 file:px-4
//             file:rounded-md file:border-0
//             file:text-sm file:font-semibold
//             file:bg-blue-50 file:text-blue-700
//             hover:file:bg-blue-100"
//           onChange={handleFileUpload}
//           accept=".xlsx, .xls"
//         />
//       </div>

//       {existingData && (
//         <div className="mb-4 p-3 bg-gray-50 rounded">
//           <h3 className="font-medium mb-2">Informasi Data Sebelumnya</h3>
//           <p><span className="font-semibold">Separator:</span> {existingData.separator || "-"}</p>
//           <p><span className="font-semibold">Kolom Terpilih:</span> {selectedColumns.join(", ") || "Belum dipilih"}</p>
//         </div>
//       )}

//       {existingData && showTable && (
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Mapping Kolom</h3>
//           <p className="text-sm text-gray-600 mb-3">
//             Sesuaikan mapping kolom antara data baru dengan struktur data yang ada
//           </p>
//           {Object.entries(existingData.sourceLabel || {}).map(([schema, excelCol], idx) => (
//             <div key={idx} className="mb-2">
//               <label className="block mb-1 text-sm font-medium">{schema}</label>
//               <select
//                 className="w-full p-2 border rounded text-sm"
//                 value={mapping[schema] || ""}
//                 onChange={(e) =>
//                   setMapping((prev) => ({
//                     ...prev,
//                     [schema]: e.target.value,
//                   }))
//                 }
//               >
//                 <option value="">Pilih Kolom Baru</option>
//                 {excelHeaders.map((col, i) => (
//                   <option key={i} value={col}>
//                     {col} {col === excelCol && "(Sebelumnya: " + excelCol + ")"}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           ))}
//         </div>
//       )}

//       {showTable && (
//         <>
//           <div className="mb-4">
//             <h3 className="font-medium mb-2">Pilih Kolom untuk Kode Unik</h3>
//             <p className="text-sm text-gray-600 mb-3">
//               Pilih kolom yang akan digabungkan menjadi kode unik (menggunakan separator: <span className="font-semibold">{existingData?.separator || "-"}</span>)
//             </p>
//             <div className="flex flex-wrap gap-3">
//               {excelHeaders.map((col, idx) => (
//                 <label key={idx} className="flex items-center gap-2 text-sm">
//                   <input
//                     type="checkbox"
//                     checked={selectedColumns.includes(col)}
//                     onChange={() =>
//                       setSelectedColumns(prev =>
//                         prev.includes(col)
//                           ? prev.filter(c => c !== col)
//                           : [...prev, col]
//                       )
//                     }
//                   />
//                   <span>{col}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="max-h-60 overflow-auto mb-4 border rounded">
//             <table className="min-w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 border text-left text-sm">No</th>
//                   {excelHeaders.map((header, idx) => (
//                     <th key={idx} className="px-4 py-2 border text-left text-sm">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {excelData.slice(0, 5).map((row, index) => (
//                   <tr key={index} className="hover:bg-gray-50">
//                     <td className="px-4 py-2 border text-sm">{index + 1}</td>
//                     {excelHeaders.map((header, colIndex) => (
//                       <td key={colIndex} className="px-4 py-2 border text-sm">
//                         {row[header]?.toString() || ""}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//             {excelData.length > 5 && (
//               <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
//                 Menampilkan 5 dari {excelData.length} baris
//               </div>
//             )}
//           </div>
//         </>
//       )}

//       <div className="flex justify-end gap-2 mt-4">
//         <button
//           onClick={onClose}
//           className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//         >
//           Batal
//         </button>
//         <button
//           onClick={handleUpdate}
//           disabled={!excelData.length || !selectedColumns.length}
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
//         >
//           Update Data
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UpdateForm;
import { useState, useEffect, useMemo } from "react";
import * as XLSX from "xlsx";
import moment from "moment-timezone";
import api from "../../utils/api";
import axios from "axios";

function UpdateForm() {
  const [fileName, setFileName] = useState("");
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [existingCustomersData, setExistingCustomersData] = useState({});
  const [mapping, setMapping] = useState({});
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [customerList, setCustomerList] = useState([]);
  const [selectedCustomerCol, setSelectedCustomerCol] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [dbCustomers, setDbCustomers] = useState([]);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);
  const [showTabel, setShowTabel] = useState(false);
  const [availableCustomers, setAvailableCustomers] = useState([]);

  // const formats = [
  //   "M/D/YYYY",
  //   "D/M/YYYY",
  //   "DD/MM/YYYY",
  //   "MM/DD/YYYY",
  //   "YYYY-MM-DD",
  //   "DD-MM-YYYY",
  //   "D-M-YYYY",
  //   "DD.MM.YYYY",
  //   "DD.MM.YY",
  //   "D.M.YY",
  //   "D.M.YYYY",
  //   "MMMM D, YYYY",
  //   "D MMMM YYYY",
  //   "D MMM YYYY",
  //   moment.ISO_8601,
  // ];
  // const [selectedFormat, setSelectedFormat] = useState(formats[0]);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const result = await api.get(
          `${import.meta.env.VITE_BACKEND_URL}/api/data/selectedCust/db`
        );

        if (result.data.success) {
          console.log(result.data.data);
          setDbCustomers(result.data.data);
        }
      } catch (err) {
        console.error("Gagal fetch customer dari DB", err);
      }
    };
    fetchCustomers();
  }, []);

  useEffect(() => {
    const fetchExistingData = async () => {
      console.log("disini customer", customerList);
      if (customerList.length === 0) return;
      setIsLoading(true);
      // console.log(customerList, "baru");
      try {
        if (customerList.length === 1) {
          const { data } = await api.get(
            `${
              import.meta.env.VITE_BACKEND_URL
            }/api/data/customer/${encodeURIComponent(customerList[0])}`
          );
          console.log(data, "ini customer");

          setExistingCustomersData(data);

          if (data?.success) {
            setMapping(data.data.sourceValueLabel || {});
            setSelectedColumns(data.data.selectedColumns || []);
          }
        } else {
          const promises = customerList.map(async (customer) => {
            const { data } = await api.get(
              `${
                import.meta.env.VITE_BACKEND_URL
              }/api/data/customer/${encodeURIComponent(customer)}`
            );
            return data;
          });

          const results = await Promise.all(promises);
          setExistingCustomersData(results);
          console.log(results, "apa isi hasol");

          if (results[0]?.success) {
            setMapping(results[0].data.sourceValueLabel || {});
            setSelectedColumns(results[0].data.selectedColumns || []);
          }
        }
      } catch (err) {
        console.error("Failed to fetch existing data:", err);
        alert("Data customer tidak ada!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, [customerList]);

  const fetchSODDiagram = async () => {
    try {
      const response = await axios.get(
        "http://192.168.56.1:3000/sodDiagram/api/sod/",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch SOD Diagram:", err);
      return null;
    }
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
    setFileName(nameWithoutExt);

    // const customers = nameWithoutExt.split("&").map((name) => name.trim());
    // setCustomerList(customers);
    // console.log(customers);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: "binary", cellDates: true });
        // const sheetName = workbook.SheetNames[0];
        setSheetNames(workbook.SheetNames); // simpan semua nama sheet
        setSelectedSheet(null);

        setTimeout(() => {
          window.__xlsWorkbook = workbook; // kamu bisa juga pakai state kalau tidak pakai global
        }, 0);
        // const worksheet = workbook.Sheets[sheetName];

        // const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        // setExcelHeaders(jsonData[0] || []);
        // setExcelData(XLSX.utils.sheet_to_json(worksheet));
        // setShowTable(true);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Invalid file format");
      }
    };
    reader.readAsBinaryString(file);
  };

  const findHeaderRowIndex = (data) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const isLikelyHeader =
        row &&
        row.length > 2 &&
        row.every((cell) => typeof cell === "string" && cell.trim() !== "");

      if (isLikelyHeader) {
        return i;
      }
    }
    return 0; // fallback: baris pertama
  };

  const handleSheetSelection = (sheetName) => {
    const workbook = window.__xlsWorkbook;
    if (!workbook) return;

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    const headerRowIndex = findHeaderRowIndex(rawData);

    if (headerRowIndex === -1) return;

    const rawHeaders = rawData[headerRowIndex];
    const rows = rawData.slice(headerRowIndex + 1);

    const seen = {};
    const headers = rawHeaders.map((header) => {
      let cleanHeader = String(header || "Column").trim();
      if (seen[cleanHeader]) {
        const count = seen[cleanHeader]++;
        cleanHeader = `${cleanHeader} ${count}`;
      } else {
        seen[cleanHeader] = 1;
      }
      return cleanHeader;
    });

    console.log(headers, "conoth banyak");

    const structuredRows = rows
      .filter((row) =>
        headers.some((_, idx) => row[idx] !== undefined && row[idx] !== null)
      )
      .map((row) => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = row[idx];
        });
        return obj;
      });
    setExcelHeaders(headers);
    setExcelData(structuredRows);
    setShowTabel(true);
  };

  useEffect(() => {
    const loadSOD = async () => {
      const data = await fetchSODDiagram();

      const uniqueCustomers = [
        ...new Set(data.map((item) => item.customerName.trim())),
      ];
      setAvailableCustomers(uniqueCustomers);
    };

    loadSOD();
  }, []);

  const extractColon = (str) => {
    if (typeof str !== "string") return str;
    return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str;
  };

  const normalize = (str) => {
    if (typeof str !== "string") return str;

    return str
      .toString()
      .toLowerCase()
      .split("/")[0]
      .replace(/[-_]+/g, " ")
      .replace(/([a-zA-Z])(\d)/g, "$1 $2") // pisahin huruf dan angka
      .replace(/\s+/g, " ") //spasi ga double
      .trim();
  };

  function convertTo24HFormat(timeStr) {
    const [time, modifier] = timeStr.trim().split(" ");
    let [hours, minutes] = time.split(":").map(Number);

    if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
    if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:00`;
  }

  function normalizeDeliveryTime(timeRaw) {
    if (!timeRaw) return null;

    console.log(timeRaw, typeof timeRaw, "ini time");

    if (typeof timeRaw === "string") {
      // Jika AM/PM format
      if (
        timeRaw.toLowerCase().includes("am") ||
        timeRaw.toLowerCase().includes("pm")
      ) {
        return convertTo24HFormat(timeRaw); // hasil "HH:MM:SS"
      }

      // Jika format ISO atau 24-jam langsung ambil jam-menit-detiknya
      const date = new Date(timeRaw);
      if (!isNaN(date)) {
        return date.toTimeString().slice(0, 8); // "HH:MM:SS"
      }

      // Jika format "09:09" atau "09:09:00"
      const match = timeRaw.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
      if (match) {
        const [_, h, m, s = "00"] = match;
        return `${String(h).padStart(2, "0")}:${m}:${s}`;
      }
    } else {
      const date = timeRaw instanceof Date ? timeRaw : new Date(timeRaw);

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return `${hours}:${minutes}:${seconds}`;
    }

    return timeRaw;
  }

  function waktuWIBToUTCISOString(timeStrWIB) {
    // Misal: timeStrWIB = "07:52:00"
    if (!(timeStrWIB instanceof Date)) timeStrWIB = new Date(timeStrWIB);
    if (isNaN(timeStrWIB)) return null;

    const hours = timeStrWIB.getHours().toString().padStart(2, "0");
    const minutes = timeStrWIB.getMinutes().toString().padStart(2, "0");
    const seconds = timeStrWIB.getSeconds().toString().padStart(2, "0");

    // const [hh, mm, ss] = timeStrWIB.split(":").map(Number);
    const date = new Date(Date.UTC(1970, 0, 1, hours, minutes, seconds || 0)); // 07:52 UTC

    date.setUTCHours(date.getUTCHours() - 7);

    return date.toISOString(); // Ini hasil UTC yang mewakili 07:52 WIB
  }

  function getSecondsSinceMidnight(dateStrOrObj) {
    const date =
      typeof dateStrOrObj === "string" ? new Date(dateStrOrObj) : dateStrOrObj;
    return (
      date.getUTCHours() * 3600 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds()
    );
  }

  function findClosestCycle(deliveryTime, dataSOD, customerName) {
    if (!deliveryTime || !dataSOD || !customerName) return null;

    const targetTime = new Date(`1970-01-01T${deliveryTime}`);
    let closest = null;

    const targetSeconds = getSecondsSinceMidnight(targetTime);

    dataSOD
      .filter(
        (item) =>
          item.customerName.toLowerCase().trim() ===
            customerName.toLowerCase().trim() &&
          item.processName.toLowerCase() === "truck out"
      )
      .forEach((item) => {
        console.log(item.waktu, "contoh");
        const waktuUntukSubmit = waktuWIBToUTCISOString(item.waktu);
        const sodTime = new Date(waktuUntukSubmit);

        const sodSeconds = getSecondsSinceMidnight(sodTime);
        console.log(
          waktuUntukSubmit,
          sodTime,
          sodSeconds,
          "INI SEMUA PENTINH",
          targetTime,
          deliveryTime
        );
        if (sodSeconds <= targetSeconds) {
          const diff = Math.abs(targetSeconds - sodSeconds);
          if (!closest || diff < closest.diff) {
            closest = { cycle: item.cycle, diff };
          }
        }
      });
    return closest?.cycle ?? 1;
  }

  useEffect(() => {
    console.log("keisi", excelData, dbCustomers);
    if (excelData.length === 0 || dbCustomers.length === 0) return;

    let detectedCol = null;
    const matchedCustomers = new Set();

    dbCustomers.forEach((item) => {
      const col = item.selectedCustomer;
      if (col === "") return;

      console.log(item, "db customer");
      const namaCust = normalize(item.nama);

      const isColExist = excelData.some((row) => row[col] !== undefined);

      if (!isColExist) return; // skip kalau kolomnya ga ada

      const hasMatch = excelData.some((row) => {
        const val = row[col];

        console.log(val, "isi baild");
        return (
          normalize(val)?.includes(namaCust) ||
          namaCust.includes(normalize(val))
        );
      });

      if (hasMatch) {
        detectedCol = col;
        console.log(col);

        excelData.forEach((row, i) => {
          // console.log(`Row ${i}:`, row);
          const val = row[col];
          if (!val) return;

          dbCustomers.forEach((cust) => {
            const name = normalize(cust.nama);
            if (
              normalize(val).includes(name) ||
              name.includes(normalize(val))
            ) {
              console.log(cust.nama, val, "cekaa");
              matchedCustomers.add(cust.nama);
            }
          });
        });
      }
    });
    if (detectedCol) {
      setSelectedCustomerCol(detectedCol);
      setCustomerList(Array.from(matchedCustomers));
    }
  }, [excelData, dbCustomers]);

  const filterData = useMemo(() => {
    if (!excelData && !selectedCustomerCol) return;
    else
      return excelData.filter((row) => {
        return (
          row[selectedCustomerCol] &&
          String(row[selectedCustomerCol]).trim() !== ""
        );
      });
  }, [excelData, selectedCustomerCol]);

  useEffect(() => {
    if (dbCustomers.length == 0) return;
  }, [excelData, selectedCustomerCol, dbCustomers, filterData]);

  const handleUpdate = async () => {
    console.log(
      "bisa update ga",
      typeof existingCustomersData,
      typeof excelData
    );
    if (
      !Array.isArray(excelData) ||
      !existingCustomersData ||
      excelData.length === 0
    )
      return;
    try {
      setIsLoading(true);
      console.log("masuk");
      const formatValue = (val) => {
        console.log(val, "value", typeof val);
        if (val instanceof Date && !isNaN(val)) {
          return moment(val).tz("Asia/Jakarta");
        }

        // const trimmedVal = typeof val === "string" ? val.trim() : val;

        // console.log(trimmedVal, "edit");
        const parsedDate = moment.tz(
          val,
          [
            "M/D/YYYY",
            "D/M/YYYY",
            "DD/MM/YYYY",
            "MM/DD/YYYY",
            "YYYY-MM-DD",
            "D/M/YYYY",
            "DD-MM-YYYY",
            "D-M-YYYY",
            "DD.MM.YYYY",
            "DD.MM.YY",
            "D.M.YY",
            "D.M.YYYY",
            "MMMM D, YYYY",
            "D MMMM YYYY",
            "D MMM YYYY",
            moment.ISO_8601,
          ],
          true,
          "Asia/Jakarta"
        );
        console.log(parsedDate, "tadikedini", parsedDate.isValid());
        if (parsedDate.isValid()) {
          console.log(parsedDate.toDate() instanceof Date, "Date?");
          return parsedDate.toDate();
        }

        return val;
      };

      const dataSOD = await fetchSODDiagram();

      if (customerList.length === 1) {
        const customer = customerList[0];

        const stepCycle = dataSOD.filter((item) =>
          item.customerName.includes(customer)
        );

        const customerData = existingCustomersData;

        console.log(customerData, "ada customer inilah");
        if (!customerData) {
          return Promise.resolve({
            success: false,
            message: `Data not found for ${customer}`,
          });
        } else {
          const separator = customerData.data.separator;

          // const selectedData = excelData.map((row) => {
          //   const values = selectedColumns
          //     .map((col) => formatValue(row[col]))
          //     .map((val) => extractColon(val));
          //   return values.join(separator ?? "");
          // });

          // const selectedData = excelData.map((row) => {
          //   console.log("kesini", selectedColumns);
          //   const values = selectedColumns
          //     .filter((_, index) => index !== 0) // ambil index genap
          //     .map((col) => formatValue(row[col]))
          //     .map((val) => extractColon(val));

          //   return values.join(separator ?? "");
          // });
          const selectedData = excelData.map((row) => {
            console.log("kesini", selectedColumns);

            const values = selectedColumns
              .filter((_, index) => index !== 0) // skip kolom pertama
              .map((col) => {
                let value = formatValue(row[col]);

                if (col === "order_delivery") {
                  const match = value.match(/OD\s+([A-Z0-9]+)/i);
                  if (match) {
                    value = match[1];
                  } else {
                    value = value.trim().split(" ").pop().replace(/\W+$/, "");
                  }
                } else {
                  value = extractColon(value);
                }

                return value;
              });

            console.log(values, "nilai select");
            return values.join(separator ?? "");
          });

          const KolomSelected = excelData.map((row) => {
            const obj = Object.entries(mapping).reduce(
              (acc, [schema, excelCol]) => {
                if (!Object.hasOwn(mapping, "delivery_cycle")) {
                  acc["delivery_cycle"] = 1;
                }
                let val = row[excelCol] ?? null;
                if (typeof val === "string" && val.includes(":")) {
                  val = val.split(":")[1]?.trim() ?? val;
                }
                acc[schema] = extractColon(val);

                if (schema === "delivery_date" || schema === "order_date") {
                  console.log(typeof val, val);
                  console.log(formatValue(val));
                  acc[schema] = formatValue(val); // hanya format di sini
                }
                if (schema === "order_delivery") {
                  const match = acc[schema].match(/OD\s+([A-Z0-9]+)/i);
                  if (match) {
                    acc[schema] = match[1];
                  } else {
                    acc[schema] = acc[schema]
                      .trim()
                      .split(" ")
                      .pop()
                      .replace(/\W+$/, "");
                  }
                }
                return acc;
              },
              {}
            );

            let cleaned = String(obj["delivery_cycle"]).replace(/[^\d]/g, "");

            let cycleVal =
              cleaned !== "" && !isNaN(cleaned) ? parseInt(cleaned) : 1;

            if (!cycleVal && obj["delivery_time"]) {
              console.log("masuk sini");
              const timeRaw = obj["delivery_time"];
              const deliveryTime = normalizeDeliveryTime(timeRaw);

              const matchedCycle = findClosestCycle(
                deliveryTime,
                stepCycle,
                customer
              );

              cycleVal = matchedCycle ?? 1;
            }

            obj["delivery_cycle"] = cycleVal;
            const qty = parseFloat(obj["qty"]);
            obj["qty"] = parseInt(obj["qty"]);
            const orderPcs = parseFloat(obj["order_(pcs)"]);
            obj["order_(pcs)"] = parseInt(obj["order_(pcs)"]);

            obj["qtyKanban"] =
              !isNaN(qty) && qty !== 0 && !isNaN(orderPcs)
                ? Math.round(orderPcs / qty)
                : 1;

            return obj;
          });

          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);

          const payload = {
            kolomSelected: {
              data: KolomSelected,
              createdAt: tomorrow,
              selectedData,
            },
            matchedCycle: stepCycle,
          };

          const response = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/data/${
              customerData.data._id
            }`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const res = await response.json();

          console.log(res, "berhasil");
          if (res.success) {
            alert("Data berhasil diupdate untuk semua customer!");
          } else {
            alert(`Update gagal untuk customer ${customerData.data.nama}`);
          }
        }
      } else {
        const updatePromises = customerList.map(async (customer, index) => {
          const stepCycle = dataSOD.filter((item) =>
            item.customerName.includes(customer)
          );
          // console.log(
          //   dataSOD.filter((item) => item.customerName.includes(customer))
          // );

          // console.log(
          //   existingCustomersData ? existingCustomersData : 0,
          //   "data customer",
          //   customerList
          // );

          const customerData = existingCustomersData.find((c) =>
            c.data.nama.toLowerCase().includes(customer.toLowerCase())
          );

          if (!customerData) {
            return {
              success: false,
              message: `Data not found for ${customer}`,
            };
          }

          console.log(existingCustomersData, customer, "data ad");

          const filteredData = excelData.filter((row) => {
            const customerFieldValue = row[selectedCustomerCol];
            console.log(customerFieldValue, "field cust");
            if (!customerFieldValue) return;

            console.log("disini");
            const normalized = normalize(
              customerFieldValue.toString().toLowerCase()
            );

            return (
              normalized.includes(customer.toLowerCase()) ||
              normalized.replace(/-/g, " ").includes(customer.toLowerCase()) ||
              customer
                .toLowerCase()
                .includes(normalized.replace(/-/g, " ").toLowerCase()) ||
              customer
                .toLowerCase()
                .replace(/\s/g, "")
                .includes(normalized.replace(/-/g, "").toLowerCase())
            );
          });

          const separator = customerData.data.separator;

          // const selectedData = filteredData.map((row) =>

          //   selectedColumns
          //     .map((col) => formatValue(row[col]))
          //     .map((val) => extractColon(val))
          //     .join(separator)
          // );

          // const selectedData = filteredData.map((row) => {
          //   const values = selectedColumns
          //     .map((col) => formatValue(row[col]))
          //     .map((val) => extractColon(val));

          //   return values.join(separator ?? ""); // join("") gabung tanpa spasi
          // });

          // const selectedData = filteredData.map((row) => {
          //   const values = selectedColumns
          //     .filter((_, index) => index % 2 !== 0) // ambil index genap
          //     .map((col) => formatValue(row[col]))
          //     .map((val) => extractColon(val));

          //   return values.join(separator ?? "");
          // });

          const selectedData = filteredData.map((row) => {
            console.log("kesini", selectedColumns);

            const values = selectedColumns
              .filter((_, index) => index !== 0) // skip kolom pertama
              .map((col) => {
                let value = formatValue(row[col]);

                if (col === "order_delivery") {
                  const match = value.match(/OD\s+([A-Z0-9]+)/i);
                  if (match) {
                    value = match[1];
                  } else {
                    value = value.trim().split(" ").pop().replace(/\W+$/, "");
                  }
                } else {
                  value = extractColon(value);
                }

                return value;
              });

            console.log(values, "nilai select");
            return values.join(separator ?? "");
          });

          console.log(selectedData, filteredData, "ini dikirim");

          // const selectedData = filteredData.map((row) =>
          //   selectedColumns
          //     .map((col) => {
          //       const val = formatValue(row[col]);
          //       return separator !== "" ? extractColon(val) : val;
          //     })
          //     .join(separator)
          // );

          const KolomSelected = filteredData.map((row) =>
            Object.entries(mapping).reduce((acc, [schema, excelCol]) => {
              if (!Object.hasOwn(mapping, "delivery_cycle")) {
                acc["delivery_cycle"] = 1; // Nilai default 1
              }
              let val = row[excelCol] ?? null;
              if (typeof val === "string" && val.includes(":")) {
                val = val.split(":")[1]?.trim() ?? val;
              }
              acc[schema] = extractColon(val);

              if (schema === "delivery_date" || schema === "order_date") {
                console.log(
                  formatValue(acc[schema]),
                  typeof formatValue(acc[schema])
                );
                acc[schema] = formatValue(acc[schema]); // hanya format di sini
              }
              if (schema === "order_delivery") {
                const match = acc[schema].match(/OD\s+([A-Z0-9]+)/i);
                if (match) {
                  acc[schema] = match[1];
                } else {
                  acc[schema] = acc[schema]
                    .trim()
                    .split(" ")
                    .pop()
                    .replace(/\W+$/, "");
                }
              }
              return acc;
            }, {})
          );

          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(today.getDate() + 1);

          // console.log(
          //   KolomSelected,
          //   typeof KolomSelected,

          //   "apa kai",
          //   mapping
          // );

          const payload = {
            kolomSelected: {
              data: KolomSelected,
              createdAt: tomorrow,
              selectedData,
            },
            matchedCycle: stepCycle,
            // selectedData,
          };

          console.log(payload, "ini", index);
          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/data/${
              customerData.data._id
            }`,
            {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          return res.json();
        });

        // console.log(updatePromises, "ada");

        const results = await Promise.all(updatePromises);
        console.log(results, "plis");
        const allSuccess = results.every((r) => r.success);

        // console.log(results);
        if (allSuccess) {
          alert("Data berhasil diupdate untuk semua customer!");
        } else {
          const errors = results
            .filter((r) => !r.success)
            .map((r) => r.message);
          alert(`Beberapa update gagal:\n${errors.join("\n")}`);
        }
      }
    } catch (err) {
      console.error("Update error:", err);
      alert("Error updating data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Update Data Customer</h2>

      {isLoading && (
        <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded">
          Memproses data...
        </div>
      )}

      {/* File Upload */}
      <div className="mb-4">
        <label className="block mb-2 font-medium">Upload File Excel Baru</label>
        <input
          type="file"
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          onChange={handleFileUpload}
          accept=".xlsx, .xls, .xlsm"
          disabled={isLoading}
        />
      </div>

      {fileName && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 p-4">
          {availableCustomers.map((name, idx) => (
            <div
              key={idx}
              className="flex items-center p-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <label className="flex items-center cursor-pointer w-full">
                <input
                  type="checkbox"
                  value={name}
                  checked={customerList.includes(name)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    const value = e.target.value;
                    setCustomerList((prev) =>
                      checked
                        ? [...prev, value]
                        : prev.filter((n) => n !== value)
                    );
                  }}
                  className="
            appearance-none w-5 h-5 border-2 border-blue-600 rounded 
            mr-3 cursor-pointer relative flex items-center justify-center
            checked:bg-blue-600 checked:border-blue-600
            hover:border-blue-700 focus:ring-2 focus:ring-blue-200
            focus:outline-none transition-colors
            before:content-[''] before:absolute before:bg-white
            before:w-[6px] before:h-[10px] before:border-r-2 before:border-b-2
            before:border-white before:rotate-45 before:opacity-0
            before:checked:opacity-100 before:-mt-[2px]
          "
                />
                <span className="text-blue-600 text-sm font-medium select-none">
                  {name}
                </span>
              </label>
            </div>
          ))}
        </div>
      )}

      {/* Customer Info */}
      {/* {fileName && (
        <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
          <p className="font-semibold">Nama File: {fileName}</p>
          <p className="mt-1 text-sm">Customer: {customerList.join(", ")}</p>
        </div>
      )} */}

      {/* {existingCustomersData.length > 0 && (
        <div className="mb-4 p-3 bg-gray-50 rounded border">
          <h3 className="font-medium mb-2">Konfigurasi Saat Ini</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            {Object.entries(
              existingCustomersData[0].data.sourceLabel || {}
            ).map(([schema, col], idx) => (
              <div key={idx} className="text-sm">
                <span className="font-semibold">{schema}:</span> {col}
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Separator:</span>{" "}
            {existingCustomersData[0].data.separator || "-"}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Nama Customer:</span>{" "}
            {existingCustomersData[0].data.selectedCustomer || "-"}
          </p>
          <p className="mt-2 text-sm">
            <span className="font-semibold">Kolom Terpilih:</span>{" "}
            {selectedColumns.join(", ")}
          </p>
        </div>
      )} */}

      {/* Data Preview */}
      {showTable && customerList.length > 0 && (
        <div className="mb-4">
          <h3 className="font-medium mb-2">Preview Data</h3>
          <div className="max-h-100 overflow-auto border rounded">
            <table className="min-w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 border text-left text-sm">No</th>
                  {excelHeaders.map((header, idx) => (
                    <th
                      key={idx}
                      className="px-4 py-2 border text-left text-sm"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {excelData.slice(0, 5).map((row, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-2 border text-sm">{index + 1}</td>
                    {excelHeaders.map((header, colIndex) => (
                      <td key={colIndex} className="px-4 py-2 border text-sm">
                        {row[header]?.toString() || "-"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
            {excelData.length > 5 && (
              <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
                Menampilkan 5 dari {excelData.length} baris
              </div>
            )}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        {/* <button
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm"
          disabled={isLoading}
        >
          Batal
        </button> */}
        <button
          onClick={handleUpdate}
          disabled={
            isLoading ||
            excelData.length === 0 ||
            selectedColumns.length < 1 ||
            !selectedCustomerCol
          }
          className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
        >
          {isLoading ? "Memproses..." : "Update Data"}
        </button>
      </div>
    </div>
  );
}

export default UpdateForm;
