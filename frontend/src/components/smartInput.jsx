import moment from "moment-timezone";
import { useState, useRef, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router";
import api from "../utils/api";
import QRCode from "react-qr-code";
import axios from "axios";
export default function SmartInputLoop() {
  const { id } = useParams();
  console.log(id);
  const [rows, setRows] = useState(() =>
    Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
  );
  const inputRefs = useRef([]);
  const [validList, setValidList] = useState([]);
  const [jumlahKanban, setValidKanban] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [Data, setData] = useState([]);
  const [createdAtList, setCreatedAtList] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [summaryTable, setSummaryTable] = useState([]);
  const [orderQty, setJumlahOrder] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [allDnClosed, setAllDnClosed] = useState(false);
  const [shift, setShift] = useState(null);
  const [waktuAktual, setWaktuAktual] = useState(null);
  const [qrCode, setqrCode] = useState(null);
  const [kanban, setKanban] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/data/${id}`
        );
        const data = await res.json();
        const KolomSelected = data.data.kolomSelected;
        setSelectedData(data.data.kolomSelected.selectedData);
        setCreatedAtList(
          kanban
            ? KolomSelected.map((item) => item.createdAt)
            : KolomSelected.flatMap((kolom) =>
                kolom.data.map((item) => item.delivery_date)
              )
        );
        setFullData(data.data.kolomSelected);
        setKanban(data.data.kanban);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [id, kanban]);

  const fetchShift = async () => {
    try {
      const res = await axios.get(
        `http://localhost:3000/sodDiagram/api/shift/`
      );
      console.log(res);
      const savedInputs = res.data.data;
      return savedInputs;
    } catch (error) {
      console.error("Error in fetch shift", error);
    }
  };

  const checkProsesSekarang = useCallback(async () => {
    const dataWaktu = await fetchShift();
    const now = moment.utc();
    console.log(dataWaktu, now, "sekarang");

    return dataWaktu.find((item) => {
      const mulai = moment.utc(
        `${now.format("YYYY-MM-DD")}T${moment
          .utc(item.jam_mulai)
          .format("HH:mm:ss")}`
      );
      const selesai = moment.utc(
        `${now.format("YYYY-MM-DD")}T${moment
          .utc(item.jam_selesai)
          .format("HH:mm:ss")}`
      );

      if (selesai.isBefore(mulai)) {
        selesai.add(1, "day");
      }

      // if (prosesSekarang) {
      //   console.log("Waktu sekarang masuk ke:", prosesSekarang);
      // } else {
      //   console.log("Tidak ada proses yang cocok dengan waktu sekarang.");
      //   return null;
      // }
      return now.isBetween(mulai, selesai, null, "[)");
    });
  }, []);

  const fetchSavedInputs = useCallback(
    async (date) => {
      try {
        const dateStr = moment(date).format("YYYY-MM-DD");
        const res = await api.get(`/inputQR?date=${dateStr}&customerId=${id}`);
        console.log(res);
        const savedInputs = res.data.data;

        if (savedInputs && savedInputs.length > 0) {
          const newRows = Array.from({ length: 20 }, () => ({
            kanban: "",
            labelSupplier: "",
          }));
          const newValidList = [];

          if (kanban) {
            savedInputs.forEach((input) => {
              if (input.index !== undefined && input.index < newRows.length) {
                newRows[input.index] = {
                  kanban: input.kanban || "",
                  labelSupplier: kanban ? input.labelSupplier : "",
                };
                newValidList[input.index] = input.status || false;
              }
            });

            setRows(newRows);
            setValidList(newValidList);
          } else if (!kanban) {
            savedInputs.forEach((input) => {
              if (input.index !== undefined && input.index < newRows.length) {
                newRows[input.index] = {
                  kanban: input.kanban || "",
                  labelSupplier: "",
                };
                newValidList[input.index] = input.status || false;
              }
            });

            setRows(newRows);
            setValidList(newValidList);
          }
        }
      } catch (error) {
        console.error("Error fetching saved inputs:", error);
      }
    },
    [id, kanban]
  );

  const handleClickDate = async (Date) => {
    console.log("date");
    setSelectedDate(Date);

    if (!kanban) {
      const itemQTY = fullData.flatMap((kolom) =>
        kolom.data
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => moment(item.delivery_date).isSame(Date, "day"))
          .map(({ item, index }) => ({ ...item, index }))
      );

      if (itemQTY) {
        setData(itemQTY || []);
        setDataLoaded(true);
        console.log(itemQTY, "ITEM", fullData);
        fullData.flatMap((kolom) =>
          kolom.data.map((item) => console.log(item))
        );
        const indicesToSelect = itemQTY.map((item) => item.index);

        console.log(indicesToSelect);

        setSelectedData(
          fullData.flatMap(
            (kolom) =>
              kolom.selectedData.filter((_, index) =>
                indicesToSelect.includes(index)
              ) || []
          )
        );
        console.log(
          Data.filter((_, index) => indicesToSelect.includes(index)) || []
        );
        await fetchSavedInputs(Date);
      } else {
        console.log("No matching data for selected date");
        setData([]);
        setDataLoaded(false);
        setRows(
          Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
        );
        setValidList([]);
      }
    } else {
      const matchedItem = fullData.find((dataItem) =>
        moment(dataItem.createdAt).isSame(Date, "day")
      );
      if (matchedItem) {
        console.log("matched item:", matchedItem);

        setData(matchedItem.data || []);
        setSelectedData(matchedItem.selectedData || []);
        setDataLoaded(true);
        await fetchSavedInputs(Date);
      } else {
        console.log("No matching data for selected date");
        setData([]);
        setSelectedData([]);
        setDataLoaded(false);
        setRows(
          Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
        );
        setValidList([]);
      }
    }
  };

  const updateDnStatus = useCallback(
    async (dn, total, sudahInput) => {
      const percent =
        sudahInput === 0 ? 0 : Math.round((sudahInput / total) * 100);

      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber: dn,
          persentase: percent,
        };

        let res;

        if (sudahInput === 1 && total - sudahInput === 0) {
          const proses = await checkProsesSekarang();
          const currentShift = proses?.kode_shift || "-";

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "first",
              shift: currentShift,
            }
          );

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "done",
              shift: currentShift,
            }
          );
        } else {
          const status =
            sudahInput === 1
              ? "first"
              : total - sudahInput === 0
              ? "done"
              : "-";

          let currentShift = shift;
          if (!currentShift || currentShift === "-") {
            const proses = await checkProsesSekarang();
            currentShift = proses?.kode_shift || "-";
          }
          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status,
              shift: currentShift,
            }
          );
        }

        console.log(res, "kode");

        setqrCode(res.data.verificationCode || res.data.data.verificationCode);
        setShift(res.data.shift);
        setWaktuAktual(res.data.waktuAktual);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
          {
            customerId: id,
            tanggal: moment(selectedDate).format("YYYY-MM-DD"),
            code: res.data.verificationCode || null,
          }
        );
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, shift, checkProsesSekarang]
  );

  const updateODStatus = useCallback(
    async (order_no, sudahInputOD, totalKanban) => {
      console.log(sudahInputOD, totalKanban, "data masuk");
      const percent =
        sudahInputOD === 0 ? 0 : Math.round((sudahInputOD / totalKanban) * 100);

      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber: order_no.split(",")[0],
          persentase: percent,
        };

        let res;

        // Jika dua kondisi terpenuhi
        if (sudahInputOD === 1 && totalKanban - sudahInputOD === 0) {
          const proses = await checkProsesSekarang();
          console.log(proses, " shift");
          const currentShift = proses?.kode_shift || "-";

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "first",
              shift: currentShift,
            }
          );

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "done",
              shift: currentShift,
            }
          );
        } else {
          const status =
            sudahInputOD === 1
              ? "first"
              : totalKanban - sudahInputOD === 0
              ? "done"
              : "-";

          let currentShift = shift;
          if (!currentShift || currentShift === "-") {
            const proses = await checkProsesSekarang();
            currentShift = proses?.kode_shift || "-";
          }
          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status,
              shift: currentShift,
            }
          );
        }

        console.log(res, "kode");

        setqrCode(res.data.verificationCode || res.data.data.verificationCode);
        setShift(res.data.shift);
        setWaktuAktual(res.data.waktuAktual);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
          {
            customerId: id,
            tanggal: moment(selectedDate).format("YYYY-MM-DD"),
            code: res.data.verificationCode || null,
          }
        );
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, shift, checkProsesSekarang]
  );

  const generateSummaryTable = useCallback(async () => {
    if (!dataLoaded) return;
    console.log("ini table kanban true");
    const totalMap = {};
    Data.forEach((item) => {
      const dn = item.dn_number;
      totalMap[dn] = (totalMap[dn] || 0) + 1;
      console.log(dn, totalMap[dn]);
    });

    const sisaMap = {};
    rows.forEach((row, index) => {
      if (!validList[index]) return;

      console.log(selectedData, "akses");
      selectedData.forEach((item, index) => {
        console.log(
          `Index ${index}:`,
          item,
          "=>",
          item.split(/\s+/).some((word) => console.log(word))
        );
      });

      const foundIndex = Data.findIndex((item) => {
        console.log("masuk sini", row.kanban?.toLowerCase());
        return row.kanban?.toLowerCase().includes(item.dn_number.toLowerCase());
      });

      console.log(foundIndex, selectedData, row.kanban, "contoh");

      if (foundIndex !== -1) {
        const unique = selectedData[foundIndex];
        if (unique) {
          sisaMap[Data[foundIndex].dn_number] =
            (sisaMap[Data[foundIndex].dn_number] || 0) + 1;
          console.log(String(Data[foundIndex].dn_number), "dn");
        }
      }
    });

    const dnNumbers = Object.keys(totalMap);
    let allClosed = true;

    console.log(dnNumbers, "kenap");

    const table = dnNumbers.map((dn) => {
      const total = totalMap[dn];
      const sisaInput = sisaMap[dn] || 0;
      const sisa = total - sisaInput;

      console.log(sisaInput, sisa, "sisa input", dn, "aoa");

      let status = "Closed";
      if (sisa > 0) {
        status = "Open";
        allClosed = false;
        updateDnStatus(dn, total, sisaInput);
      } else if (sisa < 0) status = "Abnormal";

      if (sisa === 0 && status === "Closed") {
        updateDnStatus(dn, total, sisaInput);
      }
      return {
        dn_number: dn,
        total,
        sisa,
        status,
      };
    });

    setSummaryTable(table);
    setAllDnClosed(allClosed);
  }, [rows, validList, selectedData, Data, dataLoaded, updateDnStatus]);

  const generateSummaryTableNoKanban = useCallback(async () => {
    if (!dataLoaded) return;
    console.log("ini table no kanban");
    const totalMap = {};
    const jumlahQTY = {};
    Data.forEach((item) => {
      console.log(item, Data);
      const dn = item.dn_number;
      const job = item.job_no;
      totalMap[dn + "," + job] =
        (totalMap[dn + "," + job] || 0) + Number(item.qtyKanban);
      jumlahQTY[dn + "," + job] =
        (jumlahQTY[dn + "," + job] || 0) + Number(item[`order_(pcs)`]);
      console.log(dn, totalMap[dn + "," + job], "dn");
    });
    setValidKanban(totalMap);
    setJumlahOrder(jumlahQTY);

    const sisaMap = {};
    rows.forEach((row, index) => {
      console.log(validList[index], "masuk rows");
      if (!validList[index]) return;

      console.log("ke cari index");
      const foundIndex = Data.findIndex((item) =>
        // row.kanban?.toLowerCase().includes(item.dn_number.toLowerCase()) &&
        row.kanban?.toLowerCase().includes(item.job_no.toLowerCase())
      );

      console.log(foundIndex);

      console.log(foundIndex, row.kanban, "contoh");

      if (foundIndex !== -1) {
        console.log(foundIndex);
        sisaMap[`${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`] =
          (sisaMap[
            `${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`
          ] || 0) + 1;

        console.log(String(Data[foundIndex].dn_number), "dn sisa", sisaMap);
      }
    });

    const dnNumbersKanban = Object.keys(totalMap);
    let allClosed = true;

    const table = dnNumbersKanban.map((unique) => {
      const total = totalMap[unique];
      const sisaInput = sisaMap[unique] || 0;
      const sisa = total - sisaInput;

      console.log(sisaInput, sisa, "sisa input");

      let status = "Closed";
      if (sisa > 0) {
        status = "Open";
        allClosed = false;
        updateODStatus(unique, sisaInput, total);
      } else if (sisa < 0) return;

      if (sisa === 0 && status === "Closed") {
        updateODStatus(unique, sisaInput, total);
      }

      if (sisa < 0) {
        return {
          dn_number: unique,
          jumlah_order: jumlahQTY[unique],
          total,
          sisa: 0,
          status,
        };
      }

      console.log(dnNumbersKanban, "kenap", totalMap, sisaMap);
      return {
        dn_number: unique,
        jumlah_order: jumlahQTY[unique],
        total,
        sisa,
        status,
      };
    });

    setSummaryTable(table);
    setAllDnClosed(allClosed);
  }, [rows, validList, Data, dataLoaded, updateODStatus]);

  useEffect(() => {
    if (kanban === true) {
      generateSummaryTable();
    } else {
      generateSummaryTableNoKanban();
    }
  }, [validList, generateSummaryTable, kanban, generateSummaryTableNoKanban]);

  console.log("summary", summaryTable, validList);

  const handleInput = async (index, field, value) => {
    const newValue = value.trim();
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const A = updatedRows[index].kanban.toLowerCase();
    const B = updatedRows[index].labelSupplier.toLowerCase().slice(0, -4);
    let isValid = false;

    if (A && B) {
      if (
        A.includes(B) ||
        B.includes(A) ||
        A.split(/\s+/).some((word) => B.includes(word))
      ) {
        isValid = true;
      }

      const found = selectedData.find(
        (d) =>
          A.includes(d?.toLowerCase()) ||
          A.split(/\s+/).some((word) => B.includes(word))
      );

      if (!found) {
        isValid = false;
        console.log("huhu");
      }

      console.log(found);

      const dnFound = Data.find(
        (d) =>
          A.includes(d.dn_number?.toLowerCase()) ||
          A.split(/\s+/).some((word) =>
            d.dn_number?.toLowerCase().includes(word)
          )
      );
      if (!dnFound) {
        isValid = false;
        console.log("ga ketemu");
      }
    }

    const updatedValidList = [...validList];
    updatedValidList[index] = isValid;
    setValidList(updatedValidList);

    const changedRow = {
      ...updatedRows[index],
      status: isValid,
    };

    try {
      const isRowComplete = rows[index].kanban && rows[index].labelSupplier;

      const dnFound = Data.find(
        (d) =>
          rows[index].kanban.includes(d.dn_number?.toLowerCase()) ||
          rows[index].kanban
            .split(/\s+/)
            .some((word) => d.dn_number?.toLowerCase().includes(word))
      );

      if (isRowComplete) {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/inputQR`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              row: changedRow,
              index,
              id,
              selectedDate,
              dnFound,
            }),
          }
        );

        const result = await res.json();
        console.log("Submitted row:", changedRow, "Result:", result);
      }
    } catch (err) {
      console.error("Failed to save input:", err);
    }

    if (field === "kanban" && newValue !== "") {
      setTimeout(() => {
        inputRefs.current[index * 2 + 1]?.focus();
      }, 0);
    }

    if (field === "labelSupplier" && newValue !== "") {
      const last10Filled = updatedRows
        .slice(-10)
        .every((r) => r.kanban && r.labelSupplier);
      if (last10Filled) {
        const newRows = Array.from({ length: 10 }, () => ({
          kanban: "",
          labelSupplier: "",
        }));
        setRows((prev) => [...prev, ...newRows]);

        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 0);
      } else {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 0);
      }
    }
  };

  const handleInputKanban = async (index, field, value) => {
    const newValue = value.trim();
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const A = updatedRows[index].kanban.toLowerCase().trim();
    let isValid = false;
    console.log(Data, fullData);
    // const dnFound = Data.find((d) => {
    //   console.log(
    //     d.dn_number,
    //     d,
    //     A,
    //     "match",
    //     typeof d.dn_number,
    //     typeof A,
    //     d.dn_number + d.job_no === A.toUpperCase()
    //   );
    //   return (
    //     A.includes(d.dn_number.trim().toLowerCase()) &&
    //     A.includes(d.job_no.trim().toLowerCase())
    //   );
    // });

    console.log(selectedData, "select");

    const found = selectedData[0].split(",").findIndex((d) => {
      console.log(d, A);
      return A.includes(d?.toLowerCase().trim());
    });

    if (found == -1) {
      isValid = false;
    }

    if (found !== -1) {
      isValid = true;
      console.log(found, "kesini");
      jumlahKanban[Data[found].dn_number] =
        (jumlahKanban[Data[found].dn_number] || 0) + 1;
      console.log(String(Data[found].dn_number), "dn");

      // Data.forEach((item) => {
      //   const dn = item.dn_number;
      //   const job = item.job_no;
      //   jumlahKanban[dn + "," + job] -= 1;
      //   console.log(
      //     jumlahKanban,
      //     "termasuk",
      //     jumlahKanban[dn + "," + job],
      //     found
      //   );
      if (jumlahKanban[Data[found].dn_number] < 0) {
        isValid = false;
      }
      // });
    }
    const updatedValidList = [...validList];
    updatedValidList[index] = isValid;
    console.log(updatedValidList, "valid ksh");
    setValidList(updatedValidList);

    const changedRow = {
      ...updatedRows[index],
      status: isValid,
    };

    try {
      const isRowComplete = rows[index].kanban;

      // const dnFound = Data.find(
      //   (d) =>
      //     rows[index].kanban.includes(d.dn_number?.toLowerCase()) ||
      //     rows[index].kanban
      //       .split(/\s+/)
      //       .some((word) => d.dn_number?.toLowerCase().includes(word))
      // );

      if (isRowComplete) {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/inputQR`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              row: changedRow,
              index,
              id,
              selectedDate,
            }),
          }
        );

        const result = await res.json();
        console.log("Submitted row:", changedRow, "Result:", result);
      }
    } catch (err) {
      console.error("Failed to save input:", err);
    }

    if (field === "kanban" && newValue !== "") {
      setTimeout(() => {
        inputRefs.current[index * 2 + 2]?.focus();
      }, 0);
    }
    const last10Filled = updatedRows
      .slice(-10)
      .every((r) => r.kanban && r.labelSupplier);
    if (last10Filled) {
      const newRows = Array.from({ length: 10 }, () => ({
        kanban: "",
        labelSupplier: "",
      }));
      setRows((prev) => [...prev, ...newRows]);

      setTimeout(() => {
        inputRefs.current[(index + 1) * 2]?.focus();
      }, 0);
    } else {
      setTimeout(() => {
        inputRefs.current[(index + 1) * 2]?.focus();
      }, 0);
    }
  };

  const dayClassName = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const isHighlighted = createdAtList.some(
      (createdAt) => moment(createdAt).format("YYYY-MM-DD") === dateStr
    );
    return isHighlighted ? "highlighted-day" : "";
  };

  const highlightDates = createdAtList.map(
    (createdAt) => new Date(moment(createdAt).format("YYYY-MM-DD"))
  );

  console.log(selectedData, createdAtList, Data, "creted");

  return (
    <div className="p-4">
      <h1 className="font-bold text-2xl mb-4">SCAN QR</h1>
      <div className="flex gap-4 mb-6 flex-wrap">
        <DatePicker
          selected={selectedDate}
          onChange={(date) => handleClickDate(date)}
          dateFormat="yyyy-MM-dd"
          className="border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full"
          dayClassName={dayClassName}
          highlightDates={highlightDates}
          maxDate={new Date()}
          placeholderText="Pilih tanggal"
          showYearDropdown
          dropdownMode="select"
        />
      </div>

      {allDnClosed && qrCode && dataLoaded && (
        <div className="mb-6 p-4 border rounded-lg bg-white flex flex-col items-center">
          <h2 className="text-lg font-semibold mb-2">
            Scan QR Code untuk verifikasi
          </h2>
          <QRCode
            size={150}
            style={{ height: "auto" }}
            value={qrCode}
            viewBox={`0 0 256 256`}
          />
          <p>{qrCode}</p>
        </div>
      )}

      {dataLoaded && kanban && (
        <div className="flex gap-6">
          <div className="overflow-y-auto max-h-[600px] w-[500px] space-y-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 border p-2 rounded ${
                  validList[index] ? "bg-[#27b387]" : "bg-[#f33d3a]"
                }`}
              >
                <label className="text-xs text-white font-medium">Kanban</label>
                <input
                  ref={(el) => (inputRefs.current[index * 2] = el)}
                  type="text"
                  className={`w-full p-1 border rounded bg-white`}
                  value={row.kanban}
                  disabled={qrCode !== null}
                  onInput={(e) =>
                    handleInput(index, "kanban", e.currentTarget.value)
                  }
                />
                <label className="text-xs text-white font-medium">
                  Label Supplier
                </label>
                <input
                  ref={(el) => (inputRefs.current[index * 2 + 1] = el)}
                  type="text"
                  className="w-full p-1 border rounded bg-white"
                  value={row.labelSupplier}
                  disabled={qrCode !== null}
                  onInput={(e) =>
                    handleInput(index, "labelSupplier", e.currentTarget.value)
                  }
                />
                <div className="text-center items-center">
                  <p
                    className={`w-fit h-[30px] px-2 rounded-md text-xl font-bold text-white ${
                      validList[index] ? "bg-green-700" : "bg-red-800"
                    }`}
                  >
                    {validList[index] ? "OK" : "NG"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-[200px] space-y-4">
            <div className="border border-gray-300 p-4 rounded bg-white max-h-[600px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Summary Table</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">DN Number</th>
                    <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Sisa</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{row.dn_number}</td>
                      <td className="border px-2 py-1">{row.total}</td>
                      <td className="border px-2 py-1">{row.sisa}</td>
                      <td
                        className={`border px-2 py-1 font-semibold ${
                          row.status === "Open"
                            ? "text-[#27b387]"
                            : "text-[#f33d3a]"
                        }`}
                      >
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="my-6 h-[60px]">
                <thead>
                  <tr>
                    <th className="text-xs w-[150px]">Waktu Selesai: </th>
                    <th className="text-xs">Shift</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {shift &&
                        `${moment()
                          .tz("Asia/Jakarta")
                          .format("DD-MM-YYYY")} ${waktuAktual}`}
                    </td>

                    <td>{shift}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
      {dataLoaded && !kanban && (
        <div className="flex gap-6">
          <div className="overflow-y-auto max-h-[600px] w-[500px] space-y-2">
            {rows.map((row, index) => (
              <div
                key={index}
                className={`flex flex-col gap-1 border p-2 rounded ${
                  validList[index] ? "bg-[#27b387]" : "bg-[#f33d3a]"
                }`}
              >
                <label className="text-xs text-white font-medium">Kanban</label>
                <input
                  ref={(el) => (inputRefs.current[index * 2] = el)}
                  type="text"
                  className={`w-full p-1 border rounded bg-white`}
                  value={row.kanban}
                  disabled={qrCode !== null}
                  onInput={(e) =>
                    handleInputKanban(index, "kanban", e.currentTarget.value)
                  }
                />
                <div className="text-center items-center">
                  <p
                    className={`w-fit h-[30px] px-2 rounded-md text-xl font-bold text-white ${
                      validList[index] ? "bg-green-700" : "bg-red-800"
                    }`}
                  >
                    {validList[index] ? "OK" : "NG"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-[200px] space-y-4">
            <div className="border border-gray-300 p-4 rounded bg-white max-h-[600px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Summary Table</h2>
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-2 py-1">Job No</th>
                    <th>Qty Order</th>
                    <th className="border px-2 py-1">Qty Kanban</th>
                    <th className="border px-2 py-1">Sisa Kanban</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">
                        {row.dn_number.split(",")[1]}
                      </td>
                      <td className="border px-2 py-1">{row.jumlah_order}</td>
                      <td className="border px-2 py-1">{row.total}</td>
                      <td className="border px-2 py-1">{row.sisa}</td>
                      <td
                        className={`border px-2 py-1 font-semibold ${
                          row.status === "Open"
                            ? "text-[#27b387]"
                            : "text-[#f33d3a]"
                        }`}
                      >
                        {row.status}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <table className="my-6 h-[60px]">
                <thead>
                  <tr>
                    <th className="w-[150px]">Waktu Selesai: </th>
                    <th>Shift</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      {shift &&
                        `${moment()
                          .tz("Asia/Jakarta")
                          .format("DD-MM-YYYY")} ${waktuAktual}`}
                    </td>
                    <td>{shift}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
