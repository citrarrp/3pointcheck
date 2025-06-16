// import React, { useRef, useEffect, useState } from "react";
// import { useReactToPrint } from "react-to-print";
// import { HiChevronDown } from "react-icons/hi";
// import Tabel from "./Tabellabel";
// const Printlabel = () => {
//   let componentRef = useRef(null);
//   const [data, setData] = useState([])

//   const fetchData = async () => {
//     try {
//       const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`);
//       const data = await res.json();
//       setData(data.data[0]);
//     } catch (err) {
//       console.error("Failed to fetch schema fields:", err);
//     }
//   };
//   useEffect(() => {
//     fetchData();
//   }, []);

//   const handlePrint = useReactToPrint({
//     content: () => componentRef.current,
//     onPrintError: () => alert("there is an error when printing"),
//   });

//   return (
//     <section
//       className="min-h-[85vh] p-4 lg:p-8 max-w-4xl mx-auto"
//       ref={componentRef}
//     >
//       <div
//         // key={data.id}
//         className="bg-white rounded-md p-3 lg:p-8 relative print:mt-12"
//       >
//         <h1 className="font-bold mb-8 mt-12 lg:mt-0 print:text-3xl">
//           Data Details
//         </h1>

//         <div className="border-b border-gray-900/10 pb-12">
//           <h2 className="text-base/7 font-semibold text-gray-900">
//             Cetak Label
//           </h2>

//           <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
//             <div className="sm:col-span-3">
//               <label
//                 htmlFor="sequence.No"
//                 className="block text-sm/6 font-medi um text-gray-900"
//               >
//                 Sequence No.
//               </label>

//               <div className="mt-2">
//                 <input
//                   id="sequence.No"
//                   name="Sequence No."
//                   type="text"
//                   className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
//                 />
//               </div>
//             </div>

//             <div className="sm:col-span-3">
//               <label
//                 htmlFor="PIC"
//                 className="block text-sm/6 font-medium text-gray-900"
//               >
//                 Dibuat Oleh
//               </label>

//               <div className="mt-2 grid grid-cols-1">
//                 <select
//                   id="PIC"
//                   name="PIC"
//                   className="col-start-1 row-start-1 w-full appearance-none rounded-md bg:white py-1.5 px-8 pl-3 text-base text-gray-900 outline-1 outline-offset-1 outline-gray-300 focus:outline-2 focus:outline-offset-2 focus:outline-blue-600 sm:text-sm/6"
//                 >
//                   <option>Nama</option>
//                 </select>
//                 <HiChevronDown
//                   aria-hidden="true"
//                   className="pointer-events-none col-start-1 row-start-1 mx-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
//                 />
//               </div>
//             </div>
//           </div>
//         </div>

//         <Tabel data={data} selectedData={data.selectedData} shift={shift} staff={nama} sequence={sequenceNo}/>

//         <div className="print:hidden">
//           <button
//             onClick={handlePrint}
//             className="bg-cyan-500 px-6 py-2 text-white border border-cyan-500 font-bold rounded-md mb-3 w-full lg:w-fit my-6 max-w-sm"
//           >
//             Print
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default Printlabel;

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { HiChevronDown } from "react-icons/hi";
import PDFTable from "./Tabellabel";
import api from "../utils/api";

const Cetaklabel = ({ data, qty, date, code, sequenceFirst, separator }) => {
  const [shouldPrint, setShouldPrint] = useState(false);
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await api.get(
        "/user?roles=production-user&roles=production-admin"
      );
      setUsers(res.data.data || []);
    } catch (err) {
      console.error("Gagal menghapus user", err);
    }
  };

  const contentRef = useRef(null);
  // const contentRef = useRef <HTMLDivElement> null;
  const reactToPrintFn = useReactToPrint({
    content: () => contentRef.current,
    contentRef: contentRef,
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Terjadi kesalahan saat mencetak dokumen.");
    },
    documentTitle: "Laporan Print",
    removeAfterPrint: true,
  });
  

  const { register, handleSubmit, watch } = useForm();
  // const handlePrint = useReactToPrint({
  //   content: () => componentRef.current,
  //   onPrintError: () => alert("There is an error when printing"),
  // });

  // const onSubmit = () => {
  //   handlePrint();
  // };

  const shiftOptions = [
    "Shift 1 (00:00 - 07:40)",
    "Shift 2 (07:30 - 16:10)",
    "Shift 3 (16:00 - 00:10)",
  ];

  const sequenceNo = watch("sequenceNo") || 0;
  const PIC = watch("PIC") || null;
  const shift = watch("shift") || null;
  // console.log(sequenceFirst, "seq");

  const onSubmit = () => {
    setShouldPrint(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (shouldPrint) {
      reactToPrintFn();
      setShouldPrint(false);
    }
  }, [shouldPrint]);

  // const matchingIndexes = selectedData
  //   .map((item, index) => (item === code ? index : -1))
  //   .filter((index) => index !== -1);

  // console.log(matchingIndexes);
  // const matchedKolom = matchingIndexes.map((i) => data?.kolomSelected?.data[i]);
  // const SelectedColumn = [...new Set(matchedKolom)];
  // console.log(matchingIndexes, matchedKolom, SelectedColumn, "unik ini");
  return (
    <>
      <section className="min-h-[85vh] p-4 lg:p-8 max-w-4xl mx-4">
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-row gap-4">
            <div className="bg-white rounded-md p-3 lg:p-8 relative print:mt-12 w-full">
              <h1 className="font-bold mb-8 mt-12 lg:mt-0 print:text-3xl">
                Data Details
              </h1>

              <div className="mb-10">
                <h2 className="text-base font-semibold text-gray-900">
                  Cetak Label
                </h2>

                <div className="mt-2 grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
                  <div className="sm:col-span-3">
                    <label
                      htmlFor="sequenceNo"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Sequence No.
                    </label>
                    <input
                      id="sequenceNo"
                      {...register("sequenceNo")}
                      defaultValue={sequenceFirst}
                      type="text"
                      className="mt-2 block w-full rounded-md border-gray-300 border-1 p-2 text-base text-gray-900"
                    />
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="PIC"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Dibuat Oleh
                    </label>
                    <select
                      id="PIC"
                      {...register("PIC")}
                      className="mt-2 block w-full rounded-md border-gray-300 border-1 py-2 pl-3 text-base text-gray-900"
                    >
                      <option value="">Pilih Nama</option>
                      {users.map((user, id) => (
                        <option key={id} value={user.username}>
                          {user.username}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-3">
                    <label
                      htmlFor="shift"
                      className="block text-sm font-medium text-gray-900"
                    >
                      Shift
                    </label>
                    <select
                      id="shift"
                      {...register("shift")}
                      className="mt-2 block w-full rounded-md border-gray-300 border-1 py-2 text-base text-gray-900"
                    >
                      {shiftOptions.map((s, i) => (
                        <option key={i} value={i}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* <div className="print:hidden">
                  <button
                    type="submit"
                    className="bg-cyan-500 px-6 py-2 text-white border border-cyan-500 font-bold rounded-md mb-3 w-full lg:w-fit my-6 max-w-sm"
                  >
                    Print
                  </button>
                </div> */}
              </div>

              <div className="">
                {" "}
                <div>
                  <button
                    type="submit"
                    // onClick={() => reactToPrintFn()}
                    className="pointer-events-auto cursor-pointer py-3 px-6 hover:bg-[#105bdf] bg-[#2c64c7] text-white font-semibold mb-10 rounded-md"
                  >
                    Print
                  </button>

                  <div ref={contentRef} className="w-full m-10">
                    <PDFTable
                      data={data}
                      qty={qty}
                      // selectedDate={date}
                      code={code}
                      shift={shift}
                      staff={PIC}
                      sequence={sequenceNo}
                      FirstSeq={Number(sequenceFirst)}
                      pembagi={separator}
                    />
                  </div>
                </div>
                {/* <PDFTable
                  // data={data}
                  // selectedData={SelectedColumn}
                  // code={code}
                  // shift={shift}
                  // staff={PIC}
                  // sequence={sequenceNo}
                /> */}
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Cetaklabel;
