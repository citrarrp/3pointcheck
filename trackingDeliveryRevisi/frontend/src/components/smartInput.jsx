import moment from "moment-timezone";
import { useState, useRef, useEffect, useCallback } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router";
import api from "../utils/api";
import QRCode from "react-qr-code";
import axios from "axios";
import {
  MdFileCopy,
  MdOutlineDoNotDisturbOnTotalSilence,
} from "react-icons/md";
export default function SmartInputLoop() {
  const { id } = useParams();
  // console.log(id);
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
  const [endDN, setSudahSelesai] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [allDnClosed, setAllDnClosed] = useState(false);
  const [shift, setShift] = useState(null);
  const [waktuAktual, setWaktuAktual] = useState(null);
  const [qrCodes, setqrCodes] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [kanban, setKanban] = useState(null);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);

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
          KolomSelected.flatMap((kolom) =>
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
  }, [id]);

  const fetchShift = async () => {
    try {
      const res = await axios.get(
        `http://192.168.56.1:3000/sodDiagram/api/shift/`
      );
      const savedInputs = res.data.data;
      return savedInputs;
    } catch (error) {
      console.error("Error in fetch shift", error);
    }
  };

  const handleCopy = (index) => {
    if (qrCodes.length === 0) return;

    if (!navigator.clipboard) {
      alert("Clipboard API tidak tersedia");
      return;
    }
    navigator.clipboard.writeText(qrCodes[index]).then(() => {
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(null), 1500); // Reset setelah 1.5 detik
    });
    // if (navigator.clipboard && window.isSecureContext) {
    // navigator.clipboard
    //   .writeText(qrCodes[index])
    //   .then(() => setCopiedIndex(index));
    // .catch(() => fallbackCopy(qrCodes[index], index));
    // }
    // } else {
    //   fallbackCopy(qrCodes[index], index);
    // }
  };

  const fallbackCopy = (text, index) => {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
    setCopiedIndex(index);
  };

  const checkProsesSekarang = useCallback(async () => {
    const dataWaktu = await fetchShift();
    const now = moment();
    return dataWaktu.find((item) => {
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
        const savedInputs = res.data.data;

        if (savedInputs && savedInputs.length > 0) {
          const roundedLength = Math.ceil(savedInputs.length / 10) * 10;
          const newRows = Array.from({ length: roundedLength }, () => ({
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
        setShouldAutoFocus(true);
      } catch (error) {
        console.error("Error fetching saved inputs:", error);
      }
    },
    [id, kanban]
  );

  const handleClickDate = async (Date) => {
    setDataLoaded(false);
    // setData([]);
    // setRows(
    //   Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
    // );
    // setValidList([]);
    // setqrCode(null);
    // setSummaryTable([]);
    // setShift(null);
    // setWaktuAktual(null);
    setSelectedDate(Date);

    if (!kanban) {
      const itemQTY = fullData.flatMap((kolom) =>
        kolom.data
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => moment(item.delivery_date).isSame(Date, "day"))
          .map(({ item, index }) => ({ ...item, index }))
      );

      if (itemQTY.length > 0) {
        setData(itemQTY);
        setDataLoaded(true);
        // console.log(itemQTY, "ITEM", fullData);
        // fullData.flatMap((kolom) =>
        //   kolom.data.map((item) => console.log(item))
        // );
        const indicesToSelect = itemQTY.map((item) => item.index);

        // console.log(indicesToSelect);

        setSelectedData(
          fullData.flatMap(
            (kolom) =>
              kolom.selectedData.filter((_, index) =>
                indicesToSelect.includes(index)
              ) || []
          )
        );
        // console.log(
        //   Data.filter((_, index) => indicesToSelect.includes(index)) || []
        // );
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
      const matchedItem = fullData.flatMap((kolom) =>
        kolom.data
          .map((item, index) => ({ item, index }))
          .filter(({ item }) => moment(item.delivery_date).isSame(Date, "day"))
          .map(({ item, index }) => ({ ...item, index }))
      );
      if (matchedItem.length > 0) {
        setData(matchedItem);
        // setSelectedData(matchedItem.selectedData);
        const indicesToSelect = matchedItem.map((item) => item.index);

        setDataLoaded(true);
        setSelectedData(
          fullData.flatMap(
            (kolom) =>
              kolom.selectedData.filter((_, index) =>
                indicesToSelect.includes(index)
              ) || []
          )
        );
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
    async (dn, total, sudahInput, sudahInputAll, totalMaplength) => {
      if (total - sudahInput < 0) return;

      const percent =
        sudahInput === 0
          ? 0
          : sudahInput > total
          ? 100
          : Math.round((sudahInput / total) * 100);

      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber: dn,
          persentase: percent,
        };

        let res;

        let currentShift = shift;
        if (sudahInput === 1 && total - sudahInput === 0) {
          const proses = await checkProsesSekarang();
          currentShift = proses?.kode_shift;

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "first",
              shift: null,
              sudahAll: false,
            }
          );

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "done",
              shift: sudahInputAll === totalMaplength ? currentShift : null,
              sudahAll: false,
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
            currentShift = proses?.kode_shift;
          }
          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status,
              shift: sudahInputAll === totalMaplength ? currentShift : null,
              sudahAll: sudahInputAll === totalMaplength ? true : false,
            }
          );
        }

        let statusInput;
        if (sudahInput === 1) {
          statusInput = "first";
        } else if (total - sudahInput === 0) {
          statusInput = "done";
        } else {
          statusInput = "-";
        }

        if (
          res?.data?.verificationCode &&
          (sudahInput === total || statusInput === "done")
        ) {
          setqrCodes((prev) => {
            const newCode =
              res.data.verificationCode || res.data.data.verificationCode;
            return prev.includes(newCode) || newCode == null
              ? prev
              : [...prev, newCode];
          });
        }

        if (res.data.shift !== shift) {
          setShift(res.data.shift);
        }

        setWaktuAktual(res.data.waktuAktual);

        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
          {
            customerId: id,
            tanggal: moment(selectedDate).format("YYYY-MM-DD"),
            code: res.data.verificationCode || null,
            dnNumber: dn,
          }
        );
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, shift, checkProsesSekarang]
  );

  const updateODStatus = useCallback(
    async (
      order_no,
      sudahInputOD,
      totalKanban,
      totalMaplength,
      sudahInputAll
    ) => {
      if (sudahInputAll == null || totalMaplength == null) return; // true jika null atau undefined

      // if (totalKanban - sudahInputOD < 0) return;
      if (totalKanban - sudahInputOD < 0) return;
      const percent =
        sudahInputOD === 0
          ? 0
          : sudahInputOD > totalKanban
          ? 100
          : Math.round((sudahInputOD / totalKanban) * 100);

      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber: order_no.split(",")[0],
          persentase: percent,
        };

        let res;

        // Jika dua kondisi terpenuhi
        let currentShift = shift;
        if (sudahInputOD === 1 && totalKanban - sudahInputOD === 0) {
          currentShift = shift;
          const proses = await checkProsesSekarang();
          currentShift = proses?.kode_shift;
          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "first",
              shift: null,
              sudahAll: false,
            }
          );

          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status: "done",
              shift: sudahInputAll === totalMaplength ? currentShift : null,
              sudahAll: false,
            }
          );

          let statusInput;
          if (sudahInputOD === 1) {
            statusInput = "first";
          } else if (totalKanban - sudahInputOD === 0) {
            statusInput = "done";
          } else {
            statusInput = "-";
          }

          if (
            res?.data?.verificationCode &&
            (sudahInputOD === totalKanban || statusInput === "done")
          ) {
            setqrCodes((prev) => {
              const newCode =
                res.data.verificationCode || res.data.data.verificationCode;
              return prev.includes(newCode) || newCode == null
                ? prev
                : [...prev, newCode];
            });
          }

          // setqrCodes((prev) => [
          //   ...prev,
          //   res.data.verificationCode || res.data.data.verificationCode,
          // ]);
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
            currentShift = proses?.kode_shift;
          }
          res = await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track`,
            {
              ...basePayload,
              status,
              shift: sudahInputAll === totalMaplength ? currentShift : null,
              sudahAll: sudahInputAll === totalMaplength ? true : false,
            }
          );
        }

        let statusInput;
        if (sudahInputOD === 1) {
          statusInput = "first";
        } else if (totalKanban - sudahInputOD === 0) {
          statusInput = "done";
        } else {
          statusInput = "-";
        }

        if (
          res?.data?.verificationCode &&
          sudahInputOD === totalKanban &&
          statusInput === "done"
        ) {
          setqrCodes((prev) => {
            const newCode =
              res.data.verificationCode || res.data.data.verificationCode;
            return prev.includes(newCode) || newCode == null
              ? prev
              : [...prev, newCode];
          });
        }

        // setqrCodes((prev) => [
        //   ...prev,
        //   res.data.verificationCode || res.data.data.verificationCode,
        // ]);
        if (
          !shift &&
          res.data.shift !== shift &&
          sudahInputAll === totalMaplength
        ) {
          setShift(res.data.shift); // hanya update kalau beda
        }

        setWaktuAktual(res.data.waktuAktual);

        // if (sudahInputAll && totalMaplength) {
        await axios.put(
          `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
          {
            customerId: id,
            tanggal: moment(selectedDate).format("YYYY-MM-DD"),
            code: res.data.verificationCode || null,
            dnNumber: order_no.split(",")[0],
          }
        );
        // }
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, shift, checkProsesSekarang]
  );

  const lastCharAfterSpace = (str) => {
    if (!str) return "";
    const parts = str.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts;
  };

  const generateSummaryTable = useCallback(async () => {
    if (!dataLoaded) return;
    const totalMap = {};
    const jumlahQTY = {};
    Data.forEach((item) => {
      const dn = item?.dn_number;

      totalMap[dn] =
        (totalMap[dn] || 0) +
        Math.round(Number(item[`order_(pcs)`] / item.qty));
      jumlahQTY[dn] = (jumlahQTY[dn] || 0) + Number(item[`order_(pcs)`]);
    });
    setValidKanban(sisaMap);
    setJumlahOrder(jumlahQTY);
    setSudahSelesai(totalMap);

    const sisaMap = {};
    rows.forEach((row, index) => {
      if (!validList[index]) return;
      // selectedData.forEach((item, index) => {
      //   console.log(
      //     `Index ${index}:`,
      //     item,
      //     "=>",
      //     item.split(/\s+/).some((word) => console.log(word))
      //   );
      // });

      const foundIndex = Data.findIndex((item) => {
        const jobNoPart = lastCharAfterSpace(item?.job_no).toLowerCase();
        const partNoPart = item?.part_no.toLowerCase();

        if (!jobNoPart || !partNoPart) return false;

        const kanban = row.kanban?.toLowerCase();
        const labelSupplier = row.labelSupplier?.toLowerCase();
        const labelTrimmed = labelSupplier?.slice(0, -4)?.split("|")[0];

        const matchKanban = kanban?.includes(jobNoPart);
        const matchLabel1 = labelTrimmed === partNoPart;

        return matchKanban && matchLabel1;
      });

      // console.log(foundIndex, selectedData, row.kanban, "contoh");

      if (Data[foundIndex])
        if (foundIndex !== -1) {
          const unique = selectedData[foundIndex];
          if (unique) {
            sisaMap[Data[foundIndex].dn_number] =
              (sisaMap[Data[foundIndex].dn_number] || 0) + 1;
            // console.log(String(Data[foundIndex].dn_number), "dn");
          }
        }
    });

    const dnNumbers = Object.keys(totalMap);
    let allClosed = true;

    const table = dnNumbers.map((dn) => {
      const total = totalMap[dn];
      const sisaInput = sisaMap[dn] || 0;
      const sisa = total - sisaInput;

      // console.log(sisaInput, sisa, "sisa input", dn, "aoa");

      const sudahInputDN = Object.keys(sisaMap).filter(
        (v) => v[dn] === totalMap[dn].length
      );

      let status = "Closed";
      if (sisa > 0) {
        status = "Open";
        allClosed = false;
        updateDnStatus(
          dn,
          total,
          sisaInput,
          Object.keys(totalMap).length,
          sudahInputDN.length
        );
      } else if (sisa < 0) status = "Abnormal";

      if (sisa === 0 && status === "Closed") {
        updateDnStatus(
          dn,
          total,
          sisaInput,
          Object.keys(totalMap).length,
          sudahInputDN.length
        );
      }

      if (sisa < 0) {
        return {
          dn_number: dn,
          jumlah_order: jumlahQTY[dn],
          total,
          sisa: 0,
          status,
        };
      }

      // console.log(dnNumbersKanban, "kenap", totalMap, sisaMap);
      return {
        dn_number: dn,
        jumlah_order: jumlahQTY[dn],
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
    const totalMap = {};
    const jumlahQTY = {};
    Data.forEach((item) => {
      const dn = item.dn_number;
      const job = item.job_no;
      totalMap[dn + "," + job] =
        (totalMap[dn + "," + job] || 0) +
        Number(item[`order_(pcs)`] / item.qty);
      jumlahQTY[dn + "," + job] =
        (jumlahQTY[dn + "," + job] || 0) + Number(item[`order_(pcs)`]);
      // console.log(dn, totalMap[dn + "," + job], "dn");
    });
    // setValidKanban(totalMap);
    setJumlahOrder(jumlahQTY);
    setSudahSelesai(totalMap);

    // console.log(jumlahQTY, totalMap, "qty");

    const sisaMap = {};
    rows.forEach((row, index) => {
      // console.log(validList[index], "masuk rows");
      if (!validList[index]) return;

      const foundIndex = Data.findIndex((item) =>
        // row.kanban?.toLowerCase().includes(item.dn_number.toLowerCase()) &&
        row.kanban?.toLowerCase().includes(item?.job_no.toLowerCase())
      );
      if (foundIndex !== -1) {
        // if (
        //   sisaMap[
        //     `${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`
        //   ] ===
        //   totalMap[`${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`]
        // )
        //   return;

        sisaMap[`${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`] =
          (sisaMap[
            `${Data[foundIndex].dn_number},${Data[foundIndex].job_no}`
          ] || 0) + 1;

        // console.log(String(Data[foundIndex].dn_number), "dn sisa", sisaMap);
      }
    });
    setValidKanban(sisaMap);

    const dnNumbersKanban = Object.keys(totalMap);
    let allClosed = true;

    const table = dnNumbersKanban.map((unique) => {
      const total = totalMap[unique];
      // console.log(totalMap[unique], unique, "unik");
      const sisaInput = sisaMap[unique] || 0;

      const sisa = total - sisaInput;

      const sudahInputDN = Object.keys(sisaMap).filter(
        (v) => v[unique] === totalMap[unique].length
      );

      let status = "Closed";
      if (sisa > 0) {
        status = "Open";
        allClosed = false;
        updateODStatus(
          unique,
          sisaInput,
          total,
          Object.keys(totalMap).length,
          sudahInputDN.length
        );
      } else if (sisa === 0 && status === "Closed") {
        updateODStatus(
          unique,
          sisaInput,
          total,
          Object.keys(totalMap).length,
          sudahInputDN.length
        );
      } else if (sisa < 0) {
        return {
          dn_number: unique,
          jumlah_order: jumlahQTY[unique],
          total,
          sisa: 0,
          status,
        };
      }

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

  // console.log("summary", summaryTable, validList);

  const handleInput = async (index, field, value) => {
    const newValue = value.trim();
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const A = updatedRows[index].kanban.toLowerCase();
    const B = updatedRows[index].labelSupplier
      .toLowerCase()
      .slice(0, -4)
      .split("|")[0];
    let isValid = false;

    if (A && B) {
      // if (
      //   A.includes(B) ||
      //   B.includes(A) ||
      //   A.split(/\s+/).some((word) => B.includes(word))
      // ) {
      //   isValid = true;
      // }

      // const found = selectedData.find(
      //   (d) =>
      //     A.includes(d?.toLowerCase()) ||
      //     A.split(/\s+/).some((word) => B.includes(word))
      // );
      const found = selectedData[0].split(",").findIndex((d) => {
        return A.includes(lastCharAfterSpace(d)?.toLowerCase());
      });

      if (!found) {
        isValid = false;
      }
      // const dnFound = Data.find(
      //   (d) =>
      //     A.includes(d?.job_no?.toLowerCase()) ||
      //     (A.split(/\s+/).some((word) =>
      //       d?.job_no?.toLowerCase().includes(word)
      //     ) &&
      //       B === d.part_no?.toLowerCase())
      // );

      const dnFound = Data.find((d) => {
        const jobLower = d?.job_no?.toLowerCase();
        const partLower = d?.part_no?.toLowerCase();
        const lastChar = lastCharAfterSpace(jobLower);

        const isIncluded = A.includes(lastChar);
        const isSamePart = B === partLower;
        return isIncluded && isSamePart;
      });

      if (dnFound) {
        isValid = true;
      } else {
        isValid = false;
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

      // const dnFound = Data.find((d) => {
      //   const jobLower = d?.job_no?.toLowerCase();
      //   const lastChar = lastCharAfterSpace(jobLower);

      //   return (
      //     rows[index].kanban.includes(lastChar) &&
      //     rows[index].labelSupplier === d?.part_no?.toLowerCase()
      //   );
      // });

      const dnFound = Data.find((d) => {
        const jobLower = d?.job_no?.toLowerCase();
        const partLower = d?.part_no?.toLowerCase();
        const lastChar = lastCharAfterSpace(jobLower);

        const isIncluded = rows[index].kanban.toLowerCase().includes(lastChar);
        const isSamePart =
          rows[index].labelSupplier.toLowerCase().slice(0, -4).split("|")[0] ===
          partLower;

        return isIncluded && isSamePart;
      });

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
        // console.log("Submitted row:", changedRow, "Result:", result);
      }
    } catch (err) {
      console.error("Failed to save input:", err);
    }
    if (field === "kanban" && newValue !== "") {
      // setTimeout(() => {
      //   inputRefs.current[index * 2 + 1]?.focus();
      // }, 3);
      if (value.length >= 8 || value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 10);
      }
    }

    if (field === "labelSupplier" && newValue !== "") {
      const last10Filled = updatedRows
        .slice(-10)
        .every((r) => r.kanban && r.labelSupplier);
      // console.log("last10Filled:", last10Filled);
      // console.log("last 10 rows:", updatedRows.slice(-10));

      if (last10Filled) {
        const newRows = Array.from({ length: 10 }, () => ({
          kanban: "",
          labelSupplier: "",
        }));
        setRows((prev) => [...prev, ...newRows]);

        if (value.length >= 8 || value.endsWith("\n")) {
          setTimeout(() => {
            inputRefs.current[(index + 1) * 2]?.focus();
          }, 10);
        }
      } else {
        if (value.length >= 8 || value.endsWith("\n")) {
          setTimeout(() => {
            inputRefs.current[(index + 1) * 2]?.focus();
          }, 10);
        }
      }
    }
  };

  const handleInputKanban = async (index, field, value) => {
    const newValue = value.trim();
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const A = updatedRows[index].kanban
      .toLowerCase()
      .trim()
      .slice(0, -4)
      .split("|")[0];
    let isValid = false;
    // console.log(Data, fullData);
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

    const found = selectedData[0].split(",").findIndex((d) => {
      return A.includes(d?.toLowerCase().trim());
    });

    if (found == -1) {
      isValid = false;
    }

    if (found !== -1) {
      isValid = true;
      if (
        jumlahKanban[`${Data[found].dn_number},${Data[found].job_no}`] >=
        endDN[`${Data[found].dn_number},${Data[found].job_no}`]
      ) {
        isValid = false;
      }

      jumlahKanban[`${Data[found].dn_number},${Data[found].job_no}`] =
        (jumlahKanban[`${Data[found].dn_number},${Data[found].job_no}`] || 0) +
        1;
      // console.log(String(Data[found].dn_number), "dn");

      // Data.forEach((item) => {
      //   const dn = item.dn_number;
      //   const job = item.job_no;
      //   jumlahKanban[dn + "," + job] -= 1;
      //   console.log(
      //     jumlahKanban,
      //     "termasuk",
      //     jumlahKanban[dn + "," + job],
      //     found
      //   )

      // });
    }
    const updatedValidList = [...validList];
    updatedValidList[index] = isValid;
    // console.log(updatedValidList, "valid ksh");
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
        // console.log("Submitted row:", changedRow, "Result:", result);
      }
    } catch (err) {
      console.error("Failed to save input:", err);
    }
    if (field === "kanban" && newValue !== "") {
      // setTimeout(() => {
      //   inputRefs.current[index * 2 + 2]?.focus();
      // }, 3);

      if (value.length >= 8 || value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 2) * 2]?.focus();
        }, 10);
      }
    }
    const last10Filled = updatedRows.slice(-10).every((r) => r.kanban);
    // console.log("last10Filled:", last10Filled);
    // console.log("last 10 rows:", updatedRows.slice(-10));

    if (last10Filled) {
      const newRows = Array.from({ length: 10 }, () => ({
        kanban: "",
        labelSupplier: "",
      }));
      setRows((prev) => [...prev, ...newRows]);

      // setTimeout(() => {
      //   inputRefs.current[(index + 1) * 2]?.focus();
      // }, 3);
      if (value.length >= 8 || value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 10);
      }
    } else {
      // setTimeout(() => {
      //   inputRefs.current[(index + 1) * 2]?.focus();
      // }, 3);
      if (value.length >= 8 || value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 10);
      }
    }
  };

  const dayClassName = (date) => {
    const dateStr = moment(date).format("YYYY-MM-DD");
    const isHighlighted = createdAtList.some(
      (createdAt) =>
        moment.tz(createdAt, "Asia/Jakarta").format("YYYY-MM-DD") === dateStr
    );
    return isHighlighted ? "highlighted-day" : "";
  };

  const highlightDates = createdAtList.map(
    (createdAt) => new Date(moment(createdAt).format("YYYY-MM-DD"))
  );

  // console.log(selectedData, createdAtList, Data, "creted");

  useEffect(() => {
    if (shouldAutoFocus && rows.length > 0) {
      const lastIndexWithValue = rows.findIndex((row) => !row.kanban);
      const focusIndex =
        lastIndexWithValue !== -1 ? lastIndexWithValue : rows.length;
      const inputEl = inputRefs.current[focusIndex * 2];
      if (inputEl) {
        inputEl.focus();
      }
      setShouldAutoFocus(false); // jadi ga focus terus kecuali udah fetch
    }
  }, [rows, shouldAutoFocus]);

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
      {qrCodes.length > 0 && dataLoaded && (
        <>
          <div className="items-center">
            <h2 className="text-lg font-semibold mb-2">
              Scan QR Code untuk verifikasi
            </h2>
            <div className="mb-6 p-4 border rounded-lg bg-white flex flex-row gap-5 items-center">
              {qrCodes.map((qrCode, index) => {
                return (
                  <div>
                    <QRCode
                      size={150}
                      style={{ height: "auto" }}
                      value={qrCode}
                      viewBox={`0 0 256 256`}
                    />
                    <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg my-5 py-3">
                      <button
                        onClick={() => handleCopy(index)}
                        className="text-gray-600 hover:text-black"
                        title="Salin kode"
                      >
                        <MdFileCopy size={18} />
                      </button>
                      {copiedIndex === index && (
                        <span className="text-emerald-700 text-sm">
                          Tersalin!
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
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
                  disabled={shift}
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
                  disabled={shift}
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
                    {/* <th className="border px-2 py-1">Total</th>
                    <th className="border px-2 py-1">Sisa</th>
                    <th className="border px-2 py-1">Status</th> */}
                    <th>Qty Order</th>
                    <th className="border px-2 py-1">Qty Kanban</th>
                    <th className="border px-2 py-1">Sisa Kanban</th>
                    <th className="border px-2 py-1">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {summaryTable.map((row, i) => (
                    <tr key={i}>
                      <td className="border px-2 py-1">{row.dn_number}</td>
                      {/* <td className="border px-2 py-1">{row.total}</td>
                      <td className="border px-2 py-1">{row.sisa}</td> */}
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
                  disabled={shift}
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
                        {row?.dn_number.split(",")[1]}
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
                          .format("DD-MM-YYYY")} ${moment(waktuAktual).format(
                          "HH:mm"
                        )}`}
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
