// return (
//     <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
//       {/* File Upload Section */}
//       <div className="mb-8">
//         <label
//           htmlFor="dropzone-file"
//           className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-blue-300 rounded-xl cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
//         >
//           <div className="flex flex-col items-center justify-center pt-5 pb-6">
//             <svg
//               className="w-12 h-12 mb-4 text-blue-500"
//               aria-hidden="true"
//               xmlns="http://www.w3.org/2000/svg"
//               fill="none"
//               viewBox="0 0 20 16"
//             >
//               <path
//                 stroke="currentColor"
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//               />
//             </svg>
//             <h1 className="mb-2 text-2xl font-semibold text-gray-700">
//               <span className="text-blue-600">Click to upload</span> or drag and drop
//             </h1>
//             <p className="text-lg text-gray-500">
//               .xlsx or .xls (Max. 10MB)
//             </p>
//           </div>
//           <input
//             id="dropzone-file"
//             type="file"
//             className="hidden"
//             onChange={handleFileUpload}
//             accept=".xlsx, .xls"
//           />
//         </label>

//         {fileName && (
//           <div className="mt-4 p-4 bg-blue-50 rounded-lg">
//             <p className="text-lg">
//               Uploaded file:{" "}
//               <span className="font-bold text-blue-700">
//                 {fileName.toUpperCase()}
//               </span>
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Customer Selection */}
//       {customerList.length > 1 && (
//         <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//           <label className="block text-lg font-medium text-gray-700 mb-2">Select Customer:</label>
//           <select
//             className="w-full p-3 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             value={selectedCustomer}
//             onChange={(e) => setSelectedCustomer(e.target.value)}
//           >
//             <option value="">Select Customer</option>
//             {excelHeaders.length > 0 &&
//               excelHeaders.map((column, idx) => (
//                 <option key={idx} value={column}>
//                   {column}
//                 </option>
//               ))}
//           </select>
//         </div>
//       )}

//       {/* Column Mapping */}
//       {excelHeaders.length > 0 && (
//         <div className="mb-8 p-6 bg-gray-50 rounded-lg">
//           <h3 className="text-xl font-semibold text-gray-800 mb-4">Map Columns</h3>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//             {schemaFields.data.map((schema, idx) => (
//               <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   {schema.label}
//                 </label>
//                 <select
//                   className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                   value={mapping[schema.value] || ""}
//                   onChange={(e) =>
//                     setMapping((prev) => ({
//                       ...prev,
//                       [schema.value]: e.target.value,
//                     }))
//                   }
//                 >
//                   <option value="">Select Field</option>
//                   {excelHeaders.map((column, index) => (
//                     <option key={index} value={column}>
//                       {column}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             ))}
//           </div>

//           <div className="mt-6">
//             {!showSchemaForm ? (
//               <button
//                 className="flex items-center gap-2 text-blue-600 hover:text-blue-800"
//                 onClick={handleAddSchemaClick}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//                 </svg>
//                 Add New Field
//               </button>
//             ) : (
//               <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
//                 <h4 className="text-lg font-medium text-gray-700 mb-2">Add New Field</h4>
//                 <div className="flex gap-2">
//                   <input
//                     type="text"
//                     placeholder="Field label"
//                     className="flex-1 p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                     value={newSchemaLabel}
//                     onChange={(e) => setNewSchemaLabel(e.target.value)}
//                   />
//                   <button
//                     type="submit"
//                     className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
//                     onClick={handleSubmitNewSchema}
//                   >
//                     Add
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Data Preview */}
//       {showTabel && (
//         <div className="mb-8">
//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <label className="block text-lg font-medium text-gray-700 mb-2">Data Separator:</label>
//             <input
//               type="text"
//               className="w-full p-2 border border-gray-300 rounded-md max-w-xs"
//               value={separator}
//               onChange={handleSeparatorChange}
//               placeholder="e.g., , ; |"
//             />
//           </div>

//           <div className="mb-6 p-4 bg-gray-50 rounded-lg">
//             <h3 className="text-xl font-semibold text-gray-800 mb-3">Select Unique Identifier Columns</h3>
//             <div className="flex flex-wrap gap-3">
//               {excelHeaders.map((col, idx) => (
//                 <label key={idx} className="inline-flex items-center">
//                   <input
//                     type="checkbox"
//                     className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
//                     checked={selectedColumns.includes(col)}
//                     onChange={() => ColumnSelection(col)}
//                   />
//                   <span className="ml-2 text-gray-700">{col}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
//             <div className="overflow-x-auto max-h-[400px]">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50 sticky top-0">
//                   <tr>
//                     <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       No
//                     </th>
//                     {excelHeaders.map((header, idx) => (
//                       <th key={idx} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         {header}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {excelData.map((row, index) => (
//                     <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                         {index + 1}
//                       </td>
//                       {excelHeaders.map((header, colIndex) => (
//                         <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
//                           {row[header] !== undefined ? row[header].toString() : ""}
//                         </td>
//                       ))}
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Submit Button */}
//       <div className="text-center">
//         <button
//           className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//           onClick={handleSubmit}
//         >
//           Process Data
//         </button>
//       </div>
//     </div>
//   );

// import React from "react";
// import { useForm, useFieldArray } from "react-hook-form";

// const defaultSteps = [
//   "Received Order",
//   "Start Preparation",
//   "Waiting Post",
//   "Inspection",
//   "Finish Preparation",
//   "Ready to Shipping Area",
//   "Create Surat Jalan",
//   "Arrived Truck",
//   "Departure Truck",
// ];

// const TimeInput = ({ value, onChange, className }) => {
//   const formatTime = (timeString) => {
//     if (!timeString) return { hours: '', minutes: '' };
//     const [hours, minutes] = timeString.split(':');
//     return { hours, minutes };
//   };

//   const [time, setTime] = React.useState(formatTime(value));

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     const newTime = { ...time, [name]: value };
//     setTime(newTime);

//     if (newTime.hours && newTime.minutes) {
//       onChange(`${newTime.hours.padStart(2, '0')}:${newTime.minutes.padStart(2, '0')}`);
//     } else {
//       onChange('');
//     }
//   };

//   return (
//     <div className={`flex items-center space-x-1 bg-white border rounded-md px-2 py-1 ${className}`}>
//       <input
//         type="number"
//         name="hours"
//         min="0"
//         max="23"
//         value={time.hours}
//         onChange={handleChange}
//         placeholder="HH"
//         className="w-10 text-center border-none focus:ring-0 p-0"
//       />
//       <span>:</span>
//       <input
//         type="number"
//         name="minutes"
//         min="0"
//         max="59"
//         value={time.minutes}
//         onChange={handleChange}
//         placeholder="MM"
//         className="w-10 text-center border-none focus:ring-0 p-0"
//       />
//     </div>
//   );
// };

// export default function CycleUpdateForm({ onSubmit }) {
//   const {
//     register,
//     control,
//     handleSubmit,
//     formState: { errors }
//   } = useForm({
//     defaultValues: {
//       cycles: [
//         {
//           numberCycle: 1, // Default value 1
//           stepCycle: defaultSteps.map((step) => ({
//             nama: step,
//             waktu_standar: "",
//           })),
//         },
//       ],
//     },
//   });

//   const { fields, append, remove } = useFieldArray({
//     control,
//     name: "cycles",
//   });

//   const checkNumberCycleUnique = (data) => {
//     const numbers = data.cycles.map((c) => c.numberCycle);
//     const hasDuplicates = new Set(numbers).size !== numbers.length;
//     return !hasDuplicates;
//   };

//   const handleFormSubmit = (data) => {
//     if (!checkNumberCycleUnique(data)) {
//       alert("Error: Cycle number must be unique!");
//       return;
//     }
//     onSubmit(data.cycles);
//   };

//   return (
//     <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6 max-w-4xl mx-auto">
//       {fields.map((cycle, index) => (
//         <div key={cycle.id} className="border p-4 rounded-lg shadow-md bg-white">
//           <div className="mb-4">
//             <label className="block font-bold text-gray-700 mb-1">Cycle Number</label>
//             <input
//               type="number"
//               min="1"
//               {...register(`cycles.${index}.numberCycle`, {
//                 required: "Cycle number is required",
//                 min: {
//                   value: 1,
//                   message: "Cycle number must be at least 1"
//                 }
//               })}
//               className={`border px-3 py-2 rounded w-32 ${errors.cycles?.[index]?.numberCycle ? 'border-red-500' : 'border-gray-300'}`}
//             />
//             {errors.cycles?.[index]?.numberCycle && (
//               <p className="text-red-500 text-sm mt-1">
//                 {errors.cycles[index].numberCycle.message}
//               </p>
//             )}
//           </div>

//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Process Name
//                   </th>
//                   <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Standard Time
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {defaultSteps.map((stepName, stepIndex) => (
//                   <tr key={stepIndex} className="hover:bg-gray-50">
//                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                       {stepName}
//                     </td>
//                     <td className="px-4 py-3 whitespace-nowrap">
//                       <input
//                         type="time"
//                         step="60"
//                         {...register(
//                           `cycles.${index}.stepCycle.${stepIndex}.waktu_standar`
//                         )}
//                         className="border px-3 py-2 rounded w-32"
//                       />
//                       <input
//                         type="hidden"
//                         value={stepName}
//                         {...register(
//                           `cycles.${index}.stepCycle.${stepIndex}.nama`
//                         )}
//                       />
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <div className="mt-4 text-right">
//             <button
//               type="button"
//               onClick={() => remove(index)}
//               className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                 <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//               </svg>
//               Remove This Cycle
//             </button>
//           </div>
//         </div>
//       ))}

//       <div className="flex gap-4">
//         <button
//           type="button"
//           onClick={() =>
//             append({
//               numberCycle: fields.length > 0
//                 ? Math.max(...fields.map(f => f.numberCycle)) + 1
//                 : 1,
//               stepCycle: defaultSteps.map((step) => ({
//                 nama: step,
//                 waktu_standar: "",
//               })),
//             })
//           }
//           className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
//           </svg>
//           Add New Cycle
//         </button>

//         <button
//           type="submit"
//           className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-sm flex items-center gap-1"
//         >
//           <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//             <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
//           </svg>
//           Submit All Cycles
//         </button>
//       </div>
//     </form>
//   );
// }

// // import { FaSquareXmark } from "react-icons/fa6";

// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import { useParams } from "react-router-dom";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function DataTrackingTable() {
//   const [dataCust, setDataCust] = useState([]);
//   const [searchValue, setSearchValue] = useState("");
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   const [loading, setLoading] = useState(false);
//   const { customerId, cycleNumber } = useParams();
//   // const [currentPage, setCurrentPage] = useState(1);
//   // const [totalPages, setTotalPages] = useState(1);

//   // const controllerRef = useRef(null);

//   console.log("masuk sini", customerId, cycleNumber);

//   useEffect(() => {
//     // const delayDebounce = setTimeout(() => {
//     //   setLoading(true);

//     //   if (controllerRef.current) {
//     //     controllerRef.current.abort();
//     //   }

//     //   const controller = new AbortController();
//     //   controllerRef.current = controller;

//     const fetchData = async () => {
//       try {
//         setLoading(true);
//         const formattedDate = selectedDate.toISOString().split("T")[0];
//         const data = await api.get(
//           `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//         );
//         setDataCust(data.data.data);
//         console.log(data, "masuk");
//       } catch (err) {
//         if (err.name !== "AbortError") {
//           console.error("Fetch error:", err);
//         }
//       } finally {
//         setLoading(false);
//       }
//     };
//     // fetch(
//     //   `${
//     //     import.meta.env.VITE_BACKEND_URL
//     //   }/api/data?search=${encodeURIComponent(
//     //     searchValue
//     //   )}&page=${currentPage}&limit=1`,
//     //   { signal: controller.signal }
//     // )
//     //   .then((res) => {
//     //     if (!res.ok) throw new Error("Network response was not ok");
//     //     return res.json();
//     //   })
//     // .then((json) => {
//     //   setData(json.data);
//     //   setTotalPages(json.totalPages);
//     //   setLoading(false);
//     // })
//     // .catch((err) => {
//     //   if (err.name !== "AbortError") {
//     //     console.error("Fetch error:", err);
//     //     setLoading(false);
//     //   }
//     // });
//     // }, 500);

//     fetchData();

//     // return () => clearTimeout(delayDebounce);
//   }, [customerId, cycleNumber, selectedDate]);

//   const proses = [
//     "Received Order",
//     "Waiting Post",
//     "Start Preparation",
//     "Inspection",
//     "Finish Preparation",
//     "Ready to Shipping Area",
//     "Create Surat Jalan",
//     "Arrived Truck",
//     "Departure Truck",
//   ];

//   const getProcessData = (processName) => {
//     return (
//       dataCust.find((item) => item.nama === processName) || {
//         nama: processName,
//         waktuStandar: "-",
//         waktuAktual: "-",
//         delay: "-",
//         status: "-",
//       }
//     );
//   };

//   const groupByDN = (data) => {
//     const grouped = {};
//     data.forEach((item) => {
//       if (!grouped[item.dnNumber]) {
//         grouped[item.dnNumber] = [];
//       }
//       grouped[item.dnNumber].push(item);
//     });
//     return grouped;
//   };

//   const groupedData = groupByDN(dataCust);

//   console.log(dataCust)

//   // const [data, setData] = useState([
//   //   {
//   //     nama: "Received Order",
//   //     waktuStandar: "08:00",
//   //     waktuAktual: "08:05",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Waiting Post",
//   //     waktuStandar: "08:10",
//   //     waktuAktual: "08:10",
//   //     delay: "0 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Start Preparation",
//   //     waktuStandar: "08:15",
//   //     waktuAktual: "08:20",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Inspection",
//   //     waktuStandar: "08:40",
//   //     waktuAktual: "08:50",
//   //     delay: "10 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Finish Preparation",
//   //     waktuStandar: "08:50",
//   //     waktuAktual: "09:00",
//   //     delay: "10 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Ready to Shipping Area",
//   //     waktuStandar: "09:00",
//   //     waktuAktual: "09:15",
//   //     delay: "15 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Create Surat Jalan",
//   //     waktuStandar: "09:30",
//   //     waktuAktual: "09:35",
//   //     delay: "5 menit",
//   //     status: "done",
//   //   },
//   //   {
//   //     nama: "Arrived Truck",
//   //     waktuStandar: "09:50",
//   //     waktuAktual: "10:10",
//   //     delay: "20 menit",
//   //     status: "pending",
//   //   },
//   //   {
//   //     nama: "Departure Truck",
//   //     waktuStandar: "10:30",
//   //     waktuAktual: "-",
//   //     delay: "-",
//   //     status: "pending",
//   //   },
//   // ]);

//   console.log(dataCust, "customer");

//   //   return (
//   //     <div className="overflow-x-auto">
//   //       <input
//   //         type="text"
//   //         placeholder="Cari data..."
//   //         className="mb-4 p-2 border rounded w-full max-w-md"
//   //         value={searchValue}
//   //         onChange={(e) => setSearchValue(e.target.value)}
//   //       />

//   //       {loading && <p className="text-sm text-gray-500 mb-2">Loading...</p>}

//   //       <table className="table-fixed w-full border-collapse border">
//   //         <thead className="bg-gray-100">
//   //           <tr>
//   //             <th className="p-2 border w-1/5">Nama Proses</th>
//   //             <th className="p-2 border w-1/5">Waktu Standar</th>
//   //             <th className="p-2 border w-1/5">Waktu Aktual</th>
//   //             <th className="p-2 border w-1/5">Delay</th>
//   //             <th className="p-2 border w-1/5">Status</th>
//   //           </tr>
//   //         </thead>
//   //         <tbody className="w-full">
//   //           {dataCust.length === 0 && !loading ? (
//   //             <tr>
//   //               <td colSpan={5} className="text-center p-4 text-gray-500">
//   //                 Data tidak ditemukan
//   //               </td>
//   //             </tr>
//   //           ) : (
//   //             dataCust.map((item, idx) => (
//   //               <tr key={idx} className="text-center border-t">
//   //                 <td className="p-2 border">{item.nama}</td>
//   //                 <td className="p-2 border">{item.waktuStandar}</td>
//   //                 <td className="p-2 border">{item.waktuAktual}</td>
//   //                 <td className="p-2 border">{item.delay}</td>
//   //                 <td className="p-2 border">{item.status}</td>
//   //                  {/* <td className="p-2 border">
//   //                   {item.status === true || item.status === "done" ? (
//   //                     <FaCheckSquare className="text-green-500 inline" />
//   //                   ) : (
//   //                     <MdCheckBoxOutlineBlank className="text-gray-400 inline" />
//   //                   )}
//   //                 </td> */}
//   //               </tr>
//   //             ))
//   //           )}
//   //         </tbody>
//   //       </table>
//   //       {/* <div className="flex justify-center items-center gap-2 mt-4">
//   //         {Array.from({ length: totalPages }, (_, idx) => (
//   //           <button
//   //             key={idx}
//   //             className={`px-3 py-1 border rounded ${
//   //               currentPage === idx + 1 ? "bg-[#2c64c7] text-white" : "bg-white"
//   //             }`}
//   //             onClick={() => setCurrentPage(idx + 1)}
//   //           >
//   //             {idx + 1}
//   //           </button>
//   //         ))}
//   //       </div> */}
//   //     </div>
//   //   );
//   // };

//   // {excelHeaders
//   //   .filter((col) =>
//   //     col.toLowerCase().includes(searchTerm.toLowerCase())
//   //   )
//   //   .map((col, idx) => (
//   return (
//     <div>
//       {Object.entries(groupedData).map(([dnNumber, items]) => (
//         <div key={dnNumber} className="mb-6 border rounded shadow p-4">
//           <h2 className="text-lg font-bold mb-3">DN Number: {dnNumber}</h2>
//           <table className="min-w-full border-collapse border">
//             <thead className="bg-gray-100">
//               <tr> {/* header sama seperti sebelumnya */} </tr>
//             </thead>
//             <tbody>
//               {proses.map((prosesName, idx) => {
//                 const item = items.find((i) => i.nama === prosesName);
//                 return (
//                   <tr key={idx}>
//                     <td>{idx + 1}</td>
//                     <td>{prosesName}</td>
//                     <td>{dnNumber}</td>
//                     <td>{item?.waktuStandar || "-"}</td>
//                     <td>{item?.waktuAktual || "-"}</td>
//                     <td>{item?.delay || "-"}</td>
//                     <td>{item?.status || "-"}</td>
//                     <td>{item?.ket || "-"}</td>
//                   </tr>
//                 );
//               })}
//             </tbody>
//           </table>
//         </div>
//       ))}
//     </div>
//   );
// }

// // export default DataTrackingTable;

// // import TabelLabel from "../components/Tabellabel";
// import { useContext, useRef } from "react";
// import { AuthContext } from "../context/auth.js";
// import { useEffect, useState } from "react";
// import api from "../utils/api";
// import moment from "moment-timezone";
// import { useReactToPrint } from "react-to-print";
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";

// export default function HistoryPage() {
//   const { user } = useContext(AuthContext);

//   const [absensiData, setAbsensiData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(new Date());
//   // const [dataCust, setDataCust] = useState([]);
//   // const [selectedDate, setSelectedDate] = useState(new Date());
//   const contentRef = useRef();

//   // const proses = [
//   //   "Received Order",
//   //   "Waiting Post",
//   //   "Start Preparation",
//   //   "Inspection",
//   //   "Finish Preparation",
//   //   "Ready to Shipping Area",
//   //   "Create Surat Jalan",
//   //   "Arrived Truck",
//   //   "Departure Truck",
//   // ];

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);
//   //       setError(null);
//   //       const formattedDate = moment(absensiData.timestamp).format(
//   //         "YYYY-MM-DD"
//   //       );
//   //       const response = await api.get(
//   //         `/track/${customerId}/${cycleNumber}?tanggal=${formattedDate}`
//   //       );

//   //       if (response.data.data && response.data.data.length > 0) {
//   //         setDataCust(response.data.data);
//   //       } else {
//   //         setDataCust([]);
//   //         setError("No data found for the selected date");
//   //       }
//   //     } catch (err) {
//   //       setError(err.response?.data?.message || "Failed to fetch data");
//   //       setDataCust([]);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchData();
//   // }, [customerId, cycleNumber, selectedDate, absensiData]);

//   // const groupByDN = (data) => {
//   //   const grouped = {};
//   //   data.forEach((item) => {
//   //     if (!grouped[item.dnNumber]) {
//   //       grouped[item.dnNumber] = [];
//   //     }
//   //     grouped[item.dnNumber].push(item);
//   //   });
//   //   return grouped;
//   // };

//   // const groupedData = groupByDN(dataCust);

//   // const formatTimeString = (dateString) => {
//   //   console.log(dateString);
//   //   if (!dateString) return "-";

//   //   return moment(dateString).format("HH:mm");
//   // };

//   // const filteredProses = proses.filter((prosesName) =>
//   //   prosesName.toLowerCase().includes("Arrived")
//   // );

//   const handleDateChange = (date) => {
//     setSelectedDate(date);
//   };

//   useEffect(() => {
//     const fetchAbsensiData = async () => {
//       try {
//         setLoading(true);
//         const dateStr = moment(selectedDate).format("YYYY-MM-DD");
//         const response = await api.get(`/absensi/all?tanggal=${dateStr}`);

//         if (response.data.data && response.data.data.length > 0) {
//           setAbsensiData(response.data.data);
//         } else {
//           setAbsensiData([]);
//           setError("No data found for the selected date");
//         }
//       } catch (err) {
//         setError(err.message);
//         setError(err.response?.data?.message || "Failed to fetch data");
//         setAbsensiData([]);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAbsensiData();
//   }, [selectedDate]);

//   // useEffect (() => {
//   //   if (absensiData.length > 0) {
//   //     const filtered = absensiData.filter(item => {
//   //       const itemDate = item.timestamp.toDateString();
//   //       const selectedDatestr = selectedDate.toDateString()
//   //       return itemDate === selectedDatestr;
//   //     })

//   //     const mappedData = filtered.map(item => {
//   //       return {
//   //         ...item,
//   //         process: item.scanType === "In" ? "Arrived Truck" : "Departure Truck"
//   //       }
//   //     })
//   //   }
//   // })

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

//   //   if (loading) {
//   //     return <div className="text-center py-8">Memuat data...</div>;
//   //   }

//   //   if (error) {
//   //     return (
//   //       <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
//   //         Error: {error}
//   //       </div>
//   //     );
//   //   }

//   return (
//     <div className="p-4 max-w-6xl mx-auto">
//       <h1 className="text-2xl font-bold mb-6">Riwayat Absensi Truk</h1>

//       <div className="mb-4">
//         <DatePicker
//           selected={selectedDate}
//           onChange={handleDateChange}
//           dateFormat="yyyy-MM-dd"
//           className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
//           maxDate={new Date()}
//           placeholderText="Pilih tanggal"
//           showYearDropdown
//           dropdownMode="select"
//         />
//       </div>

//       <div className="bg-white shadow overflow-hidden">
//         <div ref={contentRef} className="overflow-x-auto">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Nama Truk
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tanggal
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Kedatangan Truk
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Keberangkatan Truk
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Rute
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Tujuan
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Jenis
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Scan
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Status
//                 </th>
//                 <th
//                   rowSpan={2}
//                   className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//                 >
//                   Hasil
//                 </th>
//               </tr>
//               <tr>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Waktu Aktual
//                 </th>
//                 <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Waktu Plan
//                 </th>
//               </tr>
//             </thead>

//             <tbody className="bg-white divide-y divide-gray-200">
//               {loading ? (
//                 <tr>
//                   <td colSpan={10} className="px-6 py-4 text-center">
//                     Memuat Data...
//                   </td>
//                 </tr>
//               ) : absensiData.length > 0 ? (
//                 absensiData.map((item) => {
//                   const hasOutScan = absensiData.some(
//                     (scan) => scan.scanType === "Out"
//                   );
//                   // const outScanStatus = absensiData.find(
//                   //   (scan) => scan.scanType === "Out"
//                   // )?.status;
//                   return (
//                     <tr key={item._id} className="hover:bg-gray-50">
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <div className="font-medium text-gray-900">
//                           {item.truckName}
//                         </div>
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {formatDate(item.timestamp)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {formatTime(item.timestamp)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {datetoUTCtoLocal(item.waktuStandar)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.route}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.destination}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.typeTruck}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         {item.scanType}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span
//                           className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(
//                             item.status
//                           )}`}
//                         >
//                           {item.status}
//                         </span>
//                       </td>
//                       {item.scanType === "In" && (
//                         <td rowSpan={hasOutScan ? 2 : 1} key={item.customerId}>
//                           {hasOutScan
//                             ? (item.scanType === "Out" &&
//                                 item.status === "On Time") ||
//                               item.status === "Advanced"
//                               ? "Good"
//                               : "Not Good"
//                             : "-"}
//                         </td>
//                       )}
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan={10} className="px-6 py-4 text-center">
//                     {error ? error : "Tidak ada data absensi"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
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


