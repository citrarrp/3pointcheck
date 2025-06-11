
// // kanban
// // "DN-202503-0160MFFOTH-F004N16000|06032025"
// // labelSupplier
// // "MFFOTH-F004N16000|060320250001"




// // import { useState, useEffect } from "react";
// // import * as XLSX from "xlsx";
// // import moment from "moment-timezone";

// // function UpdateForm({ customerId, onClose }) {
// //   const [fileName, setFileName] = useState("");
// //   const [excelHeaders, setExcelHeaders] = useState([]);
// //   const [excelData, setExcelData] = useState([]);
// //   const [existingData, setExistingData] = useState(null);
// //   const [mapping, setMapping] = useState({});
// //   const [selectedColumns, setSelectedColumns] = useState([]);
// //   const [showTable, setShowTable] = useState(false);

// //   // Fetch existing data to get sourceLabel and separator
// //   useEffect(() => {
// //     const fetchExistingData = async () => {
// //       try {
// //         const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${customerId}`);
// //         const data = await res.json();
// //         setExistingData(data);

// //         // Auto-map based on sourceLabel if available
// //         if (data.sourceLabel) {
// //           const autoMapping = {};
// //           Object.entries(data.sourceLabel).forEach(([schema, excelCol]) => {
// //             autoMapping[schema] = excelCol;
// //           });
// //           setMapping(autoMapping);
// //         }

// //         // Auto-select columns for unique code if selectedData exists
// //         if (data.selectedData && data.selectedData.length > 0) {
// //           // Ini perlu disesuaikan dengan logika Anda untuk menentukan kolom yang dipilih
// //           // Contoh sederhana - ambil dari mapping pertama
// //           if (data.sourceLabel) {
// //             const firstMappedCol = Object.values(data.sourceLabel)[0];
// //             if (firstMappedCol) {
// //               setSelectedColumns([firstMappedCol]);
// //             }
// //           }
// //         }
// //       } catch (err) {
// //         console.error("Failed to fetch existing data:", err);
// //       }
// //     };

// //     if (customerId) {
// //       fetchExistingData();
// //     }
// //   }, [customerId]);

// //   const handleFileUpload = (event) => {
// //     const file = event.target.files[0];
// //     if (!file) return;

// //     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
// //     setFileName(nameWithoutExt);

// //     const customers = nameWithoutExt.split("&").map(name => name.trim());

// //     const reader = new FileReader();
// //     reader.onload = (e) => {
// //       const data = e.target.result;
// //       const sheets = XLSX.read(data, { type: "binary", cellDates: true });

// //       const sheetName = sheets.SheetNames[0];
// //       const sheet = sheets.Sheets[sheetName];

// //       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
// //       const columns = jsonData[0];
// //       const rows = XLSX.utils.sheet_to_json(sheet);

// //       setExcelHeaders(columns);
// //       setExcelData(rows);
// //       setShowTable(true);
// //     };
// //     reader.readAsBinaryString(file);
// //   };

// //   const extractColon = (str) => {
// //     if (typeof str !== "string") return str;
// //     return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str;
// //   };

// //   const handleUpdate = async () => {
// //     if (!existingData) return;

// //     try {
// //       const formatValue = (val) => {
// //         if (val instanceof Date && !isNaN(val)) {
// //           return moment(val).tz("Asia/Jakarta").format("DDMMYYYY");
// //         }

// //         const parsedDate = moment.tz(
// //           val,
// //           ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
// //           true,
// //           "Asia/Jakarta"
// //         );
// //         if (parsedDate.isValid()) {
// //           return parsedDate.format("DDMMYYYY");
// //         }
// //         return val ?? "";
// //       };

// //       // Prepare selectedData (kode unik) menggunakan separator dari data existing
// //       const selectedData = excelData.map((row) =>
// //         selectedColumns
// //           .map((col) => formatValue(row[col]))
// //           .map((value) => extractColon(value))
// //           .join(existingData.separator || "-") // Gunakan separator dari data existing
// //       );

// //       // Prepare kolomSelected data
// //       const kolomSelected = excelData.map((row) =>
// //         Object.entries(mapping).reduce((mappedRow, [schema, excelCol]) => {
// //           let val = row[excelCol] ?? null;
// //           if (typeof val === "string" && val.includes(":")) {
// //             val = val.split(":")[1]?.trim() ?? val;
// //           }
// //           mappedRow[schema] = extractColon(val);
// //           return mappedRow;
// //         }, {})
// //       );

// //       const payload = {
// //         kolomSelected,
// //         selectedData
// //       };

// //       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/${customerId}`, {
// //         method: "PATCH",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       const result = await res.json();
// //       if (result.success) {
// //         alert("Data berhasil diupdate!");
// //         onClose();
// //       } else {
// //         alert("Gagal update data: " + result.message);
// //       }
// //     } catch (err) {
// //       console.error("Update error:", err);
// //       alert("Error updating data");
// //     }
// //   };

// //   return (
// //     <div className="p-4 bg-white rounded-lg shadow-lg max-w-3xl mx-auto">
// //       <h2 className="text-xl font-bold mb-4">Update Data Customer</h2>

// //       <div className="mb-4">
// //         <label className="block mb-2 font-medium">Upload File Excel Baru</label>
// //         <input
// //           type="file"
// //           className="block w-full text-sm text-gray-500
// //             file:mr-4 file:py-2 file:px-4
// //             file:rounded-md file:border-0
// //             file:text-sm file:font-semibold
// //             file:bg-blue-50 file:text-blue-700
// //             hover:file:bg-blue-100"
// //           onChange={handleFileUpload}
// //           accept=".xlsx, .xls"
// //         />
// //       </div>

// //       {existingData && (
// //         <div className="mb-4 p-3 bg-gray-50 rounded">
// //           <h3 className="font-medium mb-2">Informasi Data Sebelumnya</h3>
// //           <p><span className="font-semibold">Separator:</span> {existingData.separator || "-"}</p>
// //           <p><span className="font-semibold">Kolom Terpilih:</span> {selectedColumns.join(", ") || "Belum dipilih"}</p>
// //         </div>
// //       )}

// //       {existingData && showTable && (
// //         <div className="mb-4">
// //           <h3 className="font-medium mb-2">Mapping Kolom</h3>
// //           <p className="text-sm text-gray-600 mb-3">
// //             Sesuaikan mapping kolom antara data baru dengan struktur data yang ada
// //           </p>
// //           {Object.entries(existingData.sourceLabel || {}).map(([schema, excelCol], idx) => (
// //             <div key={idx} className="mb-2">
// //               <label className="block mb-1 text-sm font-medium">{schema}</label>
// //               <select
// //                 className="w-full p-2 border rounded text-sm"
// //                 value={mapping[schema] || ""}
// //                 onChange={(e) =>
// //                   setMapping((prev) => ({
// //                     ...prev,
// //                     [schema]: e.target.value,
// //                   }))
// //                 }
// //               >
// //                 <option value="">Pilih Kolom Baru</option>
// //                 {excelHeaders.map((col, i) => (
// //                   <option key={i} value={col}>
// //                     {col} {col === excelCol && "(Sebelumnya: " + excelCol + ")"}
// //                   </option>
// //                 ))}
// //               </select>
// //             </div>
// //           ))}
// //         </div>
// //       )}

// //       {showTable && (
// //         <>
// //           <div className="mb-4">
// //             <h3 className="font-medium mb-2">Pilih Kolom untuk Kode Unik</h3>
// //             <p className="text-sm text-gray-600 mb-3">
// //               Pilih kolom yang akan digabungkan menjadi kode unik (menggunakan separator: <span className="font-semibold">{existingData?.separator || "-"}</span>)
// //             </p>
// //             <div className="flex flex-wrap gap-3">
// //               {excelHeaders.map((col, idx) => (
// //                 <label key={idx} className="flex items-center gap-2 text-sm">
// //                   <input
// //                     type="checkbox"
// //                     checked={selectedColumns.includes(col)}
// //                     onChange={() =>
// //                       setSelectedColumns(prev =>
// //                         prev.includes(col)
// //                           ? prev.filter(c => c !== col)
// //                           : [...prev, col]
// //                       )
// //                     }
// //                   />
// //                   <span>{col}</span>
// //                 </label>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="max-h-60 overflow-auto mb-4 border rounded">
// //             <table className="min-w-full">
// //               <thead className="bg-gray-50">
// //                 <tr>
// //                   <th className="px-4 py-2 border text-left text-sm">No</th>
// //                   {excelHeaders.map((header, idx) => (
// //                     <th key={idx} className="px-4 py-2 border text-left text-sm">
// //                       {header}
// //                     </th>
// //                   ))}
// //                 </tr>
// //               </thead>
// //               <tbody>
// //                 {excelData.slice(0, 5).map((row, index) => (
// //                   <tr key={index} className="hover:bg-gray-50">
// //                     <td className="px-4 py-2 border text-sm">{index + 1}</td>
// //                     {excelHeaders.map((header, colIndex) => (
// //                       <td key={colIndex} className="px-4 py-2 border text-sm">
// //                         {row[header]?.toString() || ""}
// //                       </td>
// //                     ))}
// //                   </tr>
// //                 ))}
// //               </tbody>
// //             </table>
// //             {excelData.length > 5 && (
// //               <div className="text-center py-2 text-sm text-gray-500 bg-gray-50">
// //                 Menampilkan 5 dari {excelData.length} baris
// //               </div>
// //             )}
// //           </div>
// //         </>
// //       )}

// //       <div className="flex justify-end gap-2 mt-4">
// //         <button
// //           onClick={onClose}
// //           className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm"
// //         >
// //           Batal
// //         </button>
// //         <button
// //           onClick={handleUpdate}
// //           disabled={!excelData.length || !selectedColumns.length}
// //           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
// //         >
// //           Update Data
// //         </button>
// //       </div>
// //     </div>
// //   );
// // }

// // export default UpdateForm;
// import { useState, useEffect } from "react";
// import * as XLSX from "xlsx";
// import moment from "moment-timezone";
// import api from "../../utils/api";

// function UpdateForm() {
//   const [fileName, setFileName] = useState("");
//   const [excelHeaders, setExcelHeaders] = useState([]);
//   const [excelData, setExcelData] = useState([]);
//   const [existingCustomersData, setExistingCustomersData] = useState({});
//   const [mapping, setMapping] = useState({});
//   const [selectedColumns, setSelectedColumns] = useState([]);
//   const [showTable, setShowTable] = useState(false);
//   const [customerList, setCustomerList] = useState([]);
//   const [selectedCustomerCol, setSelectedCustomerCol] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const [sheetNames, setSheetNames] = useState([]);
//   const [selectedSheet, setSelectedSheet] = useState(null);

//   useEffect(() => {
//     const fetchExistingData = async () => {
//       if (customerList.length === 0) return;

//       setIsLoading(true);
//       try {
//         const promises = customerList.map(async (customer) => {
//           const { data } = await api.get(
//             `${
//               import.meta.env.VITE_BACKEND_URL
//             }/api/data/customer/${encodeURIComponent(customer)}`
//           );
//           return data;
//         });

//         const results = await Promise.all(promises);
//         setExistingCustomersData(results);

//         if (results[0]?.success) {
//           setMapping(results[0].data.sourceValueLabel || {});
//           setSelectedColumns(results[0].data.selectedColumns || []);
//           setSelectedCustomerCol(results[0].data.selectedCustomer);
//         }
//       } catch (err) {
//         console.error("Failed to fetch existing data:", err);
//         alert("Data customer tidak ada!");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchExistingData();
//   }, [customerList]);

//   const findHeaderRowIndex = (data) => {
//     for (let i = 0; i < data.length; i++) {
//       const row = data[i];
//       const isLikelyHeader =
//         row &&
//         row.length > 2 &&
//         row.every((cell) => typeof cell === "string" && cell.trim() !== "");

//       if (isLikelyHeader) {
//         return i;
//       }
//     }
//     return 0; // fallback: baris pertama
//   };

//   const handleSheetSelection = (sheetName) => {
//     const workbook = window.__xlsWorkbook;
//     if (!workbook) return;

//     const sheet = workbook.Sheets[sheetName];
//     const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

//     //   const filteredData = excelData.filter((row) => {
//     //   return (
//     //     row[selectedCustomer] && String(row[selectedCustomer]).trim() !== ""
//     //   );
//     // });
//     const headerRowIndex = findHeaderRowIndex(rawData);
//     const headers = rawData[headerRowIndex];
//     const rows = rawData.slice(headerRowIndex + 1);

//     // ubah array of array jadi array of object, pakai headers

//     const structuredRows = rows
//       .filter((row) =>
//         headers.some((_, idx) => row[idx] !== undefined && row[idx] !== null)
//       )
//       .map((row) => {
//         const obj = {};
//         headers.forEach((header, idx) => {
//           obj[header] = row[idx];
//         });
//         return obj;
//       });
//     setExcelHeaders(headers);
//     setExcelData(structuredRows);
//     setShowTable(true);
//   };

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
//     setFileName(nameWithoutExt);

//     // const customers = nameWithoutExt.split("&").map((name) => name.trim());

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       try {
//         const data = e.target.result;
//         const workbook = XLSX.read(data, { type: "binary", cellDates: true });
//         // const sheetName = workbook.SheetNames[0];
//         // const worksheet = workbook.Sheets[sheetName];
//         setSheetNames(workbook.SheetNames); // simpan semua nama sheet
//         setSelectedSheet(null); // reset pilihan sebelumnya

//         // Simpan workbook untuk dipakai setelah sheet dipilih
//         setTimeout(() => {
//           window.__xlsWorkbook = workbook; // kamu bisa juga pakai state kalau tidak pakai global
//         }, 0);
//         reader.readAsBinaryString(file);
//       } catch (error) {
//         console.error("Error processing file:", error);
//         alert("Invalid file format");
//       }
//     };
//     reader.readAsBinaryString(file);
//   };

//   const extractColon = (str) => {
//     if (typeof str !== "string") return str;
//     return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str;
//   };

//   const customerListValid = excelData?.map((row) => row[selectedCustomerCol]);
//   console.log(excelData, customerListValid, "valid ini");
//   // setCustomerList();

//   const handleUpdate = async () => {
//     if (!existingCustomersData.length || !excelData.length) return;
//     console.log(existingCustomersData, excelData, "tes lagi");

//     try {
//       setIsLoading(true);

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
//         return parsedDate.isValid() ? parsedDate.format("DDMMYYYY") : val ?? "";
//       };

//       const updatePromises = customerList.map(async (customer) => {
//         const customerData = existingCustomersData.find((c) =>
//           c.data.nama.toLowerCase().includes(customer.toLowerCase())
//         );

//         console.log("nama", customerData);
//         if (!customerData) {
//           return { success: false, message: `Data not found for ${customer}` };
//         }

//         const filteredData = excelData.filter((row) => {
//           const customerFieldValue =
//             row[selectedCustomerCol]?.toString().toLowerCase() || "";
//           return customerFieldValue.includes(customer.toLowerCase());
//         });

//         console.log(filteredData, "tes");
//         const separator = customerData.data.separator || "-";

//         const selectedData = filteredData.map((row) =>
//           selectedColumns
//             .map((col) => formatValue(row[col]))
//             .map((val) => extractColon(val))
//             .join(separator)
//         );

//         const KolomSelected = filteredData.map((row) =>
//           Object.entries(mapping).reduce((acc, [schema, excelCol]) => {
//             console.log(excelCol);
//             let val = row[excelCol] ?? null;
//             if (typeof val === "string" && val.includes(":")) {
//               val = val.split(":")[1]?.trim() ?? val;
//             }
//             acc[schema] = extractColon(val);
//             return acc;
//           }, {})
//         );

//         const today = new Date();
//         const tomorrow = new Date(today);
//         tomorrow.setDate(today.getDate() + 1);

//         console.log(KolomSelected, typeof KolomSelected, "apa kai", mapping);

//         const payload = {
//           kolomSelected: {
//             data: KolomSelected,
//             createdAt: tomorrow,
//             selectedData,
//           },
//           // selectedData,
//         };
//         // console.log(payload, "ini");
//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/api/data/${
//             customerData.data._id
//           }`,
//           {
//             method: "PATCH",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify(payload),
//           }
//         );

//         return res.json();
//       });

//       console.log(updatePromises, "ada");

//       const results = await Promise.all(updatePromises);
//       const allSuccess = results.every((r) => r.success);

//       if (allSuccess) {
//         alert("Data berhasil diupdate untuk semua customer!");
//       } else {
//         const errors = results.filter((r) => !r.success).map((r) => r.message);
//         alert(`Beberapa update gagal:\n${errors.join("\n")}`);
//       }
//     } catch (err) {
//       console.error("Update error:", err);
//       alert("Error updating data");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="p-4 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
//       <h2 className="text-xl font-bold mb-4">Update Data Customer</h2>

//       {isLoading && (
//         <div className="mb-4 p-2 bg-blue-50 text-blue-700 rounded">
//           Memproses data...
//         </div>
//       )}

//       {/* File Upload */}
//       <div className="mb-4">
//         <label className="block mb-2 font-medium">Upload File Excel Baru</label>
//         <input
//           type="file"
//           className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
//           onChange={handleFileUpload}
//           accept=".xlsx, .xls, .xlsm"
//           disabled={isLoading}
//         />
//       </div>

//       {sheetNames.length > 0 && (
//         <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//           <label
//             htmlFor="sheet-select"
//             className="block text-lg font-medium text-gray-600 mb-2"
//           >
//             Pilih Sheet:
//           </label>
//           <select
//             id="sheet-select"
//             onChange={(e) => {
//               const name = e.target.value;
//               setSelectedSheet(name);
//               handleSheetSelection(name);
//             }}
//             className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
//           >
//             <option value=""> Pilih </option>
//             {sheetNames.map((name, idx) => (
//               <option key={idx} value={name}>
//                 {name}
//               </option>
//             ))}
//           </select>
//         </div>
//       )}
//       {/* Customer Info */}
//       {/* {fileName && (
//         <div className="mb-4 p-3 bg-blue-50 rounded border border-blue-200">
//           <p className="font-semibold">Nama File: {fileName}</p>
//           <p className="mt-1 text-sm">Customer: {customerList.join(", ")}</p>
//         </div>
//       )} */}

//       {/* {existingCustomersData.length > 0 && (
//         <div className="mb-4 p-3 bg-gray-50 rounded border">
//           <h3 className="font-medium mb-2">Konfigurasi Saat Ini</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
//             {Object.entries(
//               existingCustomersData[0].data.sourceLabel || {}
//             ).map(([schema, col], idx) => (
//               <div key={idx} className="text-sm">
//                 <span className="font-semibold">{schema}:</span> {col}
//               </div>
//             ))}
//           </div>
//           <p className="mt-2 text-sm">
//             <span className="font-semibold">Separator:</span>{" "}
//             {existingCustomersData[0].data.separator || "-"}
//           </p>
//           <p className="mt-2 text-sm">
//             <span className="font-semibold">Nama Customer:</span>{" "}
//             {existingCustomersData[0].data.selectedCustomer || "-"}
//           </p>
//           <p className="mt-2 text-sm">
//             <span className="font-semibold">Kolom Terpilih:</span>{" "}
//             {selectedColumns.join(", ")}
//           </p>
//         </div>
//       )} */}

//       {/* Data Preview */}
//       {showTable && selectedSheet && (
//         <div className="mb-4">
//           <h3 className="font-medium mb-2">Preview Data</h3>
//           <div className="max-h-100 overflow-auto border rounded">
//             <table className="min-w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-2 border text-left text-sm">No</th>
//                   {excelHeaders.map((header, idx) => (
//                     <th
//                       key={idx}
//                       className="px-4 py-2 border text-left text-sm"
//                     >
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
//                         {row[header]?.toString() || "-"}
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
//         </div>
//       )}

//       <div className="flex justify-end gap-2 mt-4">
//         {/* <button
//           className="px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300 text-sm"
//           disabled={isLoading}
//         >
//           Batal
//         </button> */}
//         <button
//           onClick={handleUpdate}
//           disabled={
//             isLoading ||
//             !excelData.length ||
//             !selectedColumns.length ||
//             (customerList.length > 1 && !selectedCustomerCol)
//           }
//           className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 disabled:bg-blue-300 text-sm"
//         >
//           {isLoading ? "Memproses..." : "Update Data"}
//         </button>
//       </div>
//     </div>
//   );
// }

// export default UpdateForm;
