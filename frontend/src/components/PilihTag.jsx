import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";
import { useReactToPrint } from "react-to-print";
import { HiChevronDown } from "react-icons/hi";
import api from "../utils/api";
import moment from "moment-timezone";
import TagMTM from "./autoPrintTag.jsx";
import { AuthContext } from "../context/auth";
import DatePicker from "react-datepicker";
import html2canvas from "html2canvas";
import IminPrinter from "../assets/imin-printer.esm.browser.js";

const CetakTag = ({ dataAsli, data, lineAt, code, customer }) => {
  const [shouldPrint, setShouldPrint] = useState(false);
  const [isPrint, setIsPrinting] = useState(false);
  const [tableComponent, setTableComponent] = useState(null);
  const { user, loading } = useContext(AuthContext);
  // const [customerName, setCustomerName] = useState("");

  const [printer, setPrinter] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  const [tag, setTag] = useState([]);
  const checkProsesSekarang = async () => {
    const now = moment();
    return shiftOptions.find((item) => {
      const mulai = moment(
        `${now.format("YYYY-MM-DD")}T${moment
          .utc(item.jam_mulai)
          .format("HH:mm:ss")}`
      );
      const selesai = moment(
        `${now.format("YYYY-MM-DD")}T${moment
          .utc(item.jam_selesai)
          .format("HH:mm:ss")}`
      );

      if (selesai.isBefore(mulai)) {
        selesai.add(1, "day");
      }

      return now.isBetween(mulai, selesai, null, "[)");
    });
  };

  const { register, handleSubmit, watch, control } = useForm({
    defaultValues: {
      kanban: false, // Default value untuk kanban
    },
  });

  const shiftOptions = [
    "Shift 1 (00:00 - 07:40)",
    "Shift 2 (07:30 - 16:10)",
    "Shift 3 (16:00 - 00:10)",
  ];

  const contentRef = useRef(null);

  const shift = watch("shift") || null;
  const date = watch("date");
  //   const line = watch("line") || "";

  const printDiv = useRef(null);
  // const handlePrint = () => {
  //   const text = printDiv.current.innerText;
  //   window.imin?.printText(text); // jika dari iMin WebView
  // };
  // const printerIP = "ws://localhost:8081";
  useEffect(() => {
    const initPrinter = async () => {
      const instance = new IminPrinter();
      const connected = await instance.connect();
      if (connected) {
        await instance.initPrinter();
        setPrinter(instance);
        setIsConnected(true);
        console.log("Printer connected");
      } else {
        console.log("Failed to connect");
      }
    };

    initPrinter();
  }, []);

  const reactToPrintFn = useReactToPrint({
    content: () => printDiv.current,
    contentRef: printDiv,
    onPrintError: (error) => {
      console.error("Print error:", error);
      alert("Terjadi kesalahan saat mencetak dokumen.");
    },
    documentTitle: "Laporan Print",
    removeAfterPrint: true,
  });

  const handlePrint = async () => {
    console.log("masuk");
    // if (!printer || !isConnected) return;

    const content = printDiv.current.innerHTML;

    if (
      window.IminPrinterPlugin &&
      typeof window.IminPrinterPlugin.printText === "function"
    ) {
      window.IminPrinterPlugin.printText(content);
    } else {
      // await printer.setFontSize(0); // default
      // await printer.printText("Hello Imin Printer\n");
      // await printer.printText(content);
      // await printer.printAndFeed(3);
      // await printer.cutPaper();

      if (!printDiv.current) return;
      // const canvas = await html2canvas(printDiv.current, { scale: 0.95 });
      // const imgData = canvas.toDataURL("image/png");
      const canvas = await html2canvas(printDiv.current, {
        scale: 2,
      });

      const imgData = canvas.toDataURL("image/png", 1.0);

      const html = printDiv.current.outerHTML;
      setIsPrinting(true); // bisa memicu style visibility

      // try {
      //   await api.post("/print-tag", { image: imgData });
      // } catch (err) {
      //   console.error("Gagal print:", err);
      //   alert("Gagal print");
      // reactToPrintFn();
      const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

      await delay(300); // tunggu visibility & render selesai

      // await delay(500); // tunggu dulu setengah detik
      reactToPrintFn();

      setIsPrinting(false);
    }

    // const canvas = await html2canvas(element, {
    //   scale: 2, // resolusi lebih tajam
    //   backgroundColor: "#fff", // penting untuk hasil thermal
    // });

    // const image = canvas.toDataURL("image/png");

    // const win = window.open();
    // win.document.write(
    //   `<img src="${imgData}" onload="window.print(); window.close()" />`
    // );
  };

  // const handlePrint = () => {
  // const text = printDiv.current?.innerHTML || "";
  // if (
  //   window.IminPrinterPlugin &&
  //   typeof window.IminPrinterPlugin.printText === "function"
  // ) {
  //   window.IminPrinterPlugin.printText(text);
  // } else {
  //   console.log("disini");
  //   reactToPrintFn();
  //   // Cek browser support
  //   if ("usb" in navigator) {
  //     console.log("✅ WebUSB supported!");
  //     // Lihat device yang tersedia
  //     navigator.usb.getDevices().then((devices) => {
  //       console.log("Connected USB devices:", devices.length);
  //       devices.forEach((device) => {
  //         console.log("Device:", {
  //           vendorId: device.vendorId,
  //           productId: device.productId,
  //           productName: device.productName,
  //           manufacturerName: device.manufacturerName,
  //         });
  //       });
  //     });
  //   } else {
  //     console.log("❌ WebUSB not supported");
  //   }
  // const html = printDiv.current.innerHTML;
  // window.electronAPI.sendPrint(html);
  // }
  // };

  // const fetchCustomer = async () => {
  //   try {
  //     const res = await api.get(`/data/${customer}`);
  //     setCustomerName(res.data.data.nama || "");
  //   } catch (err) {
  //     console.error("Gagal menghapus user", err);
  //   }
  // };

  const fetchLabelTag = useCallback(async () => {
    try {
      const res = await api.get("/production", {
        params: {
          customer: customer || "",
          material: code,
          line: lineAt?.split("-")[0] || "",
          shift,
          date,
        },
      });

      if (res.data.success) {
        setTag(res.data.data); // ambil 1 data
      }
    } catch (err) {
      console.error("error :", err);
    }
  }, [customer, code, lineAt, shift, date]);

  useEffect(() => {
    if (shift && date) {
      fetchLabelTag();
    }
  }, [shift, date, lineAt, fetchLabelTag]);

  // useEffect(() => {
  //   fetchCustomer();
  // }, []);

  const onSubmit = async (formData) => {
    try {
      const res = await api.post("/production/update", {
        customer,
        material: code,
        line: lineAt.split("-")[0],
        shift,
        operator: user.fullname,
        date: date,
      });

      if (res.data.success) {
        setTableComponent(
          <TagMTM
            tagData={tag || res.data.data}
            dataCust={dataAsli}
            dataPart={data}
            code={code}
            line={lineAt.split("-")[0]}
            date={date}
            shift={formData.shift}
            kanban={data.kanban}
            user={user}
            customer={customer}
            idx={lineAt.split("-")[1]}
          />
        );
        fetchLabelTag();
        setShouldPrint(true);
      } else {
        alert("Gagal update: " + res.data.message);
      }
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Terjadi kesalahan saat mengirim data ke server");
    }
  };

  useEffect(() => {
    if (shouldPrint) {
      handlePrint();
      setShouldPrint(false);
    }
  }, [shouldPrint]);

  return (
    <>
      <section className="min-h-[85vh] p-4 lg:p-8 max-w-5xl mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-6">
          <h1 className="text-2xl font-bold mb-6 text-gray-800 pb-4">
            Cetak Label
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-6">
              <div className="sm:col-span-3">
                <label
                  htmlFor="date"
                  className="block text-[16px] font-medium text-gray-700 mb-1"
                >
                  Tanggal
                </label>
                {/* <input
                  type="date"
                  id="date"
                  {...register("date")}
                  defaultValue={
                    new Date().toISOString().split("T")[0] ||
                    moment.tz("Asia/Jakarta").format("DD/MM/YYYY")
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border py-2 px-3 text-base focus:ring-blue-500 focus:border-blue-500"
                /> */}
                <Controller
                  name="date"
                  control={control}
                  defaultValue={new Date()}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      id="date"
                      selected={field.value}
                      onChange={(date) => field.onChange(date)}
                      dateFormat="dd/MM/yyyy"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border py-2 px-3 text-base focus:ring-blue-500 focus:border-blue-500"
                      // placeholderText="Pilih tanggal"
                    />
                  )}
                />
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="shift"
                  className="block text-[16px] font-medium text-gray-700 mb-1"
                >
                  Shift
                </label>
                <select
                  id="shift"
                  {...register("shift")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border py-2 px-3 text-base focus:ring-blue-500 focus:border-blue-500"
                >
                  {shiftOptions.map((s, i) => (
                    <option key={i} value={Number(i + 1)}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>

              {/* <div className="sm:col-span-3">
                <label
                  htmlFor="line"
                  className="block text-[16px] font-medium text-gray-700 mb-1"
                >
                  Line
                </label>
                <input
                  type="text"
                  id="line"
                  {...register("line")}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border py-2 px-3 text-base focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Masukkan line"
                />
              </div> */}
              <div className="sm:col-span-3">
                <p>Jumlah : {tag[0]?.qty ?? 0}</p>
              </div>
            </div>

            <div className="flex flex-col justify-between items-center">
              <div
                ref={printDiv}
                // className="border border-gray-200 rounded-lg p-4 bg-gray-50"
              >
                {tableComponent}
              </div>
              <button
                type="submit"
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-[16px] font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg
                  className="-ml-1 mr-2 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
                Cetak Label
              </button>
            </div>
          </div>
        </form>
      </section>
    </>
  );
};

export default CetakTag;
