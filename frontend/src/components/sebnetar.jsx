// import moment from "moment-timezone";
// import { useState, useRef, useEffect, useCallback } from "react";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";
// import { useParams } from "react-router";
// import api from "../utils/api";
// export default function SmartInputLoop() {
//   const { id } = useParams();
//   console.log(id);
//   const [rows, setRows] = useState(() =>
//     Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
//   );
//   const inputRefs = useRef([]);
//   const [validList, setValidList] = useState([]);
//   const [selectedData, setSelectedData] = useState([]);
//   const [Data, setData] = useState([]);
//   const [createdAtList, setCreatedAtList] = useState([]);
//   const [fullData, setFullData] = useState([]);
//   const [dataLoaded, setDataLoaded] = useState(false);
//   const [summaryTable, setSummaryTable] = useState([]);
//   const [selectedDate, setSelectedDate] = useState(null);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/api/data/${id}`
//         );
//         const data = await res.json();
//         const KolomSelected = data.data.kolomSelected;
//         setSelectedData(data.data.kolomSelected.selectedData);
//         setCreatedAtList(KolomSelected.map((item) => item.createdAt));
//         setFullData(data.data.kolomSelected);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//       }
//     };

//     fetchData();
//   }, [id]);

//   const fetchSavedInputs = useCallback(
//     async (date) => {
//       try {
//         const dateStr = moment(date).format("YYYY-MM-DD");
//         const res = await api.get(`/inputQR?date=${dateStr}&customerId=${id}`);
//         console.log(res);
//         const savedInputs = res.data.data;

//         if (savedInputs && savedInputs.length > 0) {
//           const newRows = Array.from({ length: 20 }, () => ({
//             kanban: "",
//             labelSupplier: "",
//           }));
//           const newValidList = [];

//           savedInputs.forEach((input) => {
//             if (input.index !== undefined && input.index < newRows.length) {
//               newRows[input.index] = {
//                 kanban: input.kanban || "",
//                 labelSupplier: input.labelSupplier || "",
//               };
//               newValidList[input.index] = input.status || false;
//             }
//           });

//           setRows(newRows);
//           setValidList(newValidList);
//         }
//       } catch (error) {
//         console.error("Error fetching saved inputs:", error);
//       }
//     },
//     [id]
//   );

//   // const calculateSummary = useCallback(() => {
//   //   const newValidList = [];

//   //   rows.forEach(({ kanban, labelSupplier }) => {
//   //     const A = kanban.toLowerCase();
//   //     const B = labelSupplier.toLowerCase();
//   //     let isValid = false;

//   //     if (A && B) {
//   //       if (A.includes(B) || B.includes(A)) {
//   //         isValid = true;
//   //       }

//   //       const found = selectedData.find((d) => A.includes(d?.toLowerCase()));
//   //       if (!found) {
//   //         isValid = false;
//   //       }
//   //     }

//   //     newValidList.push(isValid);
//   //   });

//   //   setValidList(newValidList);
//   // }, [rows, selectedData]);

//   // const generateSummaryTable = useCallback(() => {
//   //   const table = data.map((item) => {
//   //     const dn = item.dn_number?.toLowerCase();
//   //     const total = rows.filter((r) => r.kanban.toLowerCase().includes(dn)).length;
//   //     const sisa = rows.filter(
//   //       (r, idx) => r.kanban.toLowerCase().includes(dn) && validList[idx]
//   //     ).length;
//   //     const status = sisa > 0 ? "Open" : "Closed";

//   //     return {
//   //       dn_number: item.dn_number,
//   //       total,
//   //       sisa,
//   //       status,
//   //     };
//   //   });

//   //   setSummaryTable(table);
//   // }, [rows, validList, selectedData]);

//   // const contoh = ["KS1701032MFFUBR-F00C25FAA8|06032025", "MFFUBR-F00C25FAA8|060320250006s"]

//   const handleClickDate = async (Date) => {
//     console.log("date");
//     setSelectedDate(Date);

//     const matchedItem = fullData.find((dataItem) =>
//       moment(dataItem.createdAt).isSame(Date, "day")
//     );

//     if (matchedItem) {
//       console.log("matched item:", matchedItem);

//       setData(matchedItem.data || []);
//       setSelectedData(matchedItem.selectedData || []);
//       setDataLoaded(true);
//       await fetchSavedInputs(Date);
//     } else {
//       console.log("No matching data for selected date");
//       setData([]);
//       setSelectedData([]);
//       setDataLoaded(false);
//       setRows(
//         Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
//       );
//       setValidList([]);
//     }
//   };

//   // const handleSelectData = (index) => {
//   //   console.log(createdAtList[index]);
//   //   setData(fullData[index].data);
//   //   setSelectedData(fullData[index].selectedData);
//   //   setDataLoaded(true);

//   //   console.log(fullData[index].data, fullData[index].selectedData, "ini");

//   //   const fetchSpecificData = async () => {
//   //     try {
//   //       const res = await fetch(
//   //         `${import.meta.env.VITE_BACKEND_URL}/api/data/`
//   //       );
//   //       const jsonData = await res.json();
//   //       const kolomSelected = jsonData.data[Number(idx)].kolomSelected;
//   //       const specificData = kolomSelected[index].data;

//   //       setData(specificData);
//   //       setDataLoaded(true); // supaya mulai generate table
//   //     } catch (error) {
//   //       console.error("Error fetching specific data:", error);
//   //     }
//   //   };

//   //   fetchSpecificData();
//   // };
//   // };

//   const generateSummaryTable = useCallback(() => {
//     if (!dataLoaded) return;
//     console.log("ini");
//     const totalMap = {};
//     Data.forEach((item) => {
//       const dn = item.dn_number;

//       totalMap[dn] = (totalMap[dn] || 0) + 1;
//       console.log(dn, totalMap[dn]);
//     });

//     const sisaMap = {};
//     rows.forEach((row, index) => {
//       if (!validList[index]) return;

//       console.log(selectedData, "akses");
//       selectedData.forEach((item, index) => {
//         console.log(
//           `Index ${index}:`,
//           item,
//           "=>",
//           item.split(/\s+/).some((word) => console.log(word))
//         );
//       });

//       const foundIndex = selectedData.findIndex(
//         (item) =>
//           row.kanban?.toLowerCase().includes(item.toLowerCase()) ||
//           row.kanban
//             ?.toLowerCase()
//             .split(/\s+/)
//             .some((word) => item.toLowerCase().includes(word.toLowerCase()))
//       );
//       console.log(foundIndex, selectedData, row.kanban, "contoh");

//       if (foundIndex !== -1) {
//         const dn_number = Data[foundIndex]?.dn_number;
//         if (dn_number) {
//           sisaMap[dn_number] = (sisaMap[dn_number] || 0) + 1;
//         }
//       }
//     });

//     const dnNumbers = Object.keys(totalMap);

//     const table = dnNumbers.map((dn) => {
//       const total = totalMap[dn];
//       const sisaInput = sisaMap[dn] || 0;
//       const sisa = total - sisaInput;

//       let status = "Closed";
//       if (sisa > 0) status = "Open";
//       else if (sisa < 0) status = "Abnormal";

//       return {
//         dn_number: dn,
//         total,
//         sisa,
//         status,
//       };
//     });

//     setSummaryTable(table);
//   }, [rows, validList, selectedData, Data, dataLoaded]);

//   // useEffect(() => {
//   //   calculateSummary();
//   // }, [rows, selectedData, calculateSummary]);

//   useEffect(() => {
//     generateSummaryTable();
//   }, [validList, generateSummaryTable]);

//   console.log("summary", summaryTable, validList);

//   const handleInput = async (index, field, value) => {
//     const newValue = value.trim();
//     const updatedRows = [...rows];
//     updatedRows[index][field] = newValue;
//     setRows(updatedRows);

//     const A = updatedRows[index].kanban.toLowerCase();
//     const B = updatedRows[index].labelSupplier.toLowerCase().slice(0, -4);
//     let isValid = false;

//     if (A && B) {
//       if (
//         A.includes(B) ||
//         B.includes(A) ||
//         A.split(/\s+/).some((word) => B.includes(word))
//       ) {
//         isValid = true;
//       }

//       const found = selectedData.find(
//         (d) =>
//           A.includes(d?.toLowerCase()) ||
//           A.split(/\s+/).some((word) => B.includes(word))
//       );

//       if (!found) {
//         isValid = false;
//         console.log("huhu");
//       }

//       console.log(found);

//       const dnFound = Data.find(
//         (d) =>
//           A.includes(d.dn_number?.toLowerCase()) ||
//           A.split(/\s+/).some((word) =>
//             d.dn_number?.toLowerCase().includes(word)
//           )
//       );
//       if (!dnFound) {
//         isValid = false;
//         console.log("ga ketemu");
//       }
//     }

//     const updatedValidList = [...validList];
//     updatedValidList[index] = isValid;
//     setValidList(updatedValidList);

//     const changedRow = {
//       ...updatedRows[index],
//       status: isValid,
//     };

//     try {
//       const isRowComplete = rows[index].kanban && rows[index].labelSupplier;

//       if (isRowComplete) {
//         const res = await fetch(
//           `${import.meta.env.VITE_BACKEND_URL}/api/inputQR`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({ row: changedRow, index, id, selectedDate }),
//           }
//         );

//         const result = await res.json();
//         console.log("Submitted row:", changedRow, "Result:", result);
//       }
//     } catch (err) {
//       console.error("Failed to save input:", err);
//     }

//     if (field === "kanban" && newValue !== "") {
//       setTimeout(() => {
//         inputRefs.current[index * 2 + 1]?.focus();
//       }, 0);
//     }

//     if (field === "labelSupplier" && newValue !== "") {
//       const last10Filled = updatedRows
//         .slice(-10)
//         .every((r) => r.kanban && r.labelSupplier);
//       if (last10Filled) {
//         const newRows = Array.from({ length: 10 }, () => ({
//           kanban: "",
//           labelSupplier: "",
//         }));
//         setRows((prev) => [...prev, ...newRows]);

//         setTimeout(() => {
//           inputRefs.current[(index + 1) * 2]?.focus();
//         }, 0);
//       } else {
//         setTimeout(() => {
//           inputRefs.current[(index + 1) * 2]?.focus();
//         }, 0);
//       }
//     }
//   };

//   const dayClassName = (date) => {
//     const dateStr = moment(date).format("YYYY-MM-DD");
//     const isHighlighted = createdAtList.some(
//       (createdAt) => moment(createdAt).format("YYYY-MM-DD") === dateStr
//     );
//     return isHighlighted ? "highlighted-day" : "";
//   };

//   const highlightDates = createdAtList.map(
//     (createdAt) => new Date(moment(createdAt).format("YYYY-MM-DD"))
//   );

//   console.log(selectedData, createdAtList, Data, "creted");

//   return (
//     <div className="p-4">
//       <h1 className="font-bold text-2xl mb-4">SCAN QR</h1>
//       <div className="flex gap-4 mb-6 flex-wrap">
//         {/* {createdAtList.map((createdAt, index) => (
//           <button
//             key={index}
//             onClick={() => handleSelectData(index)}
//             className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//           >
//             {moment(createdAt).tz("Asia/Jakarta").format("DD MMMM YY")}
//           </button>
//         ))} */}
//         <DatePicker
//           selected={selectedDate}
//           onChange={(date) => handleClickDate(date)}
//           dateFormat="yyyy-MM-dd"
//           className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
//           dayClassName={dayClassName}
//           highlightDates={highlightDates}
//           maxDate={new Date()}
//           placeholderText="Pilih tanggal"
//           showYearDropdown
//           dropdownMode="select"
//         />
//       </div>
//       {dataLoaded && (
//         <div className="flex gap-6">
//           <div className="overflow-y-auto max-h-[600px] w-[500px] space-y-2">
//             {rows.map((row, index) => (
//               <div
//                 key={index}
//                 className={`flex flex-col gap-1 border p-2 rounded ${
//                   validList[index] ? "bg-[#27b387]" : "bg-[#f33d3a]"
//                 }`}
//               >
//                 <label className="text-xs text-white font-medium">Kanban</label>
//                 <input
//                   ref={(el) => (inputRefs.current[index * 2] = el)}
//                   type="text"
//                   className={`w-full p-1 border rounded bg-white`}
//                   value={row.kanban}
//                   onInput={(e) =>
//                     handleInput(index, "kanban", e.currentTarget.value)
//                   }
//                 />
//                 <label className="text-xs text-white font-medium">
//                   Label Supplier
//                 </label>
//                 <input
//                   ref={(el) => (inputRefs.current[index * 2 + 1] = el)}
//                   type="text"
//                   className="w-full p-1 border rounded bg-white"
//                   value={row.labelSupplier}
//                   onInput={(e) =>
//                     handleInput(index, "labelSupplier", e.currentTarget.value)
//                   }
//                 />
//                 <div className="text-center items-center">
//                   <p
//                     className={`w-fit h-[30px] px-2 rounded-md text-xl font-bold text-white ${
//                       validList[index] ? "bg-green-700" : "bg-red-800"
//                     }`}
//                     //   ${
//                     //   validList[index] ? "text-[#27b387]" : "text-red-500"
//                     // }
//                     // `}
//                   >
//                     {validList[index] ? "OK" : "NG"}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           <div className="min-w-[200px] space-y-4">
//             <div className="border border-gray-300 p-4 rounded bg-white max-h-[600px] overflow-y-auto">
//               <h2 className="text-lg font-semibold mb-2">Summary Table</h2>
//               <table className="w-full text-sm border-collapse">
//                 <thead>
//                   <tr className="bg-gray-100">
//                     <th className="border px-2 py-1">DN Number</th>
//                     <th className="border px-2 py-1">Total</th>
//                     <th className="border px-2 py-1">Sisa</th>
//                     <th className="border px-2 py-1">Status</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {summaryTable.map((row, i) => (
//                     <tr key={i}>
//                       <td className="border px-2 py-1">{row.dn_number}</td>
//                       <td className="border px-2 py-1">{row.total}</td>
//                       <td className="border px-2 py-1">{row.sisa}</td>
//                       <td
//                         className={`border px-2 py-1 font-semibold ${
//                           row.status === "Open"
//                             ? "text-[#27b387]"
//                             : "text-[#f33d3a]"
//                         }`}
//                       >
//                         {row.status}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
