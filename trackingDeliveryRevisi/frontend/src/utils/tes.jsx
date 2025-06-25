import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { HiChevronDown } from "react-icons/hi";
import PDFTable from "./Tabellabel";

const Cetaklabel = ({ data, qty, code, sequenceFirst, separator }) => {
  const contentRef = useRef(null);

  const reactToPrintFn = useReactToPrint({
    content: () => {
      if (!contentRef.current) {
        console.log("Content ref is not ready!");
        alert("Dokumen belum siap untuk dicetak.");
        return null;
      }
      return contentRef.current;
    },
    contentRef: contentRef,
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Terjadi kesalahan saat mencetak dokumen.");
    },
    documentTitle: "Laporan Print",
    removeAfterPrint: true,
  });

  const { register, handleSubmit, watch } = useForm();
  // console.log(data, "selecte");

  const shiftOptions = [
    "Shift 1 (00:00 - 07:40)",
    "Shift 2 (07:30 - 16:10)",
    "Shift 3 (16:00 - 00:10)",
  ];

  const sequenceNo = watch("sequenceNo") || 0;
  const PIC = watch("PIC") || null;
  const shift = watch("shift") || null;
  // console.log(sequenceFirst, "seq");

  return (
    <>
      <section className="min-h-[85vh] p-4 lg:p-8 max-w-4xl mx-auto">
        <form onSubmit={handleSubmit(() => reactToPrintFn())}>
          <div className="flex flex-row gap-4">
            <div className="bg-white rounded-md p-3 lg:p-8 relative print:mt-12 w-1/2">
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
                    <div className="mt-2 grid grid-cols-1 relative">
                      <select
                        id="PIC"
                        {...register("PIC")}
                        className="w-full appearance-none rounded-md border-gray-300 border-1 py-2 pl-3 text-base text-gray-900"
                      >
                        <option value="">Pilih Nama</option>
                        <option value="Citra RRP">Citra RRP</option>
                        <option value="Anggota 1">Anggota 1</option>
                        <option value="Anggota 2">Anggota 2</option>
                      </select>
                      <HiChevronDown
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        aria-hidden="true"
                      />
                    </div>
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
              </div>

              <div className="">
                {" "}
                <div>
                  <button
                    type="submit"
                    // onClick={() => reactToPrintFn()}
                    className="pointer-events-auto cursor-pointer p-3 bg-[#105bdf] text-white font-semibold mb-10 rounded-md"
                  >
                    Print
                  </button>

                  <div ref={contentRef}>
                    <PDFTable
                      data={data}
                      qty={qty}
                      code={code}
                      shift={shift}
                      staff={PIC}
                      sequence={sequenceNo}
                      FirstSeq={Number(sequenceFirst)}
                      pembagi={separator}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default Cetaklabel;
