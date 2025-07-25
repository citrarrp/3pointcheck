import moment from "moment-timezone";
import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useParams } from "react-router";
import api from "../utils/api";
import QRCode from "react-qr-code";
import axios from "axios";
import { MdFileCopy } from "react-icons/md";
import { useContext } from "react";
import { FaChevronDown } from "react-icons/fa6";
import { SidebarContext } from "../context/sidebar-context";

export default function InputSmartLoop() {
  const { id } = useParams();
  const [rows, setRows] = useState(() =>
    Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
  );
  const inputRefs = useRef([]);
  const [validList, setValidList] = useState([]);
  const [partListReal, setPartListReal] = useState([]);
  const [jumlahKanban, setValidKanban] = useState({});
  const [selectedData, setSelectedData] = useState([]);
  const [Data, setData] = useState([]);
  const [createdAtList, setCreatedAtList] = useState([]);
  const [fullData, setFullData] = useState([]);
  const [uniqueColumn, setSelectedColumn] = useState([]);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [summaryTable, setSummaryTable] = useState([]);
  const [endDN, setSudahSelesai] = useState({});
  const [selectedDate, setSelectedDate] = useState(null);
  const [isDnOpen, setIsDnOpen] = useState(false);
  // const [shift, setShift] = useState(null);
  // const [waktuAktual, setWaktuAktual] = useState(null);
  const [qrCodes, setqrCodes] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [kanban, setKanban] = useState(null);
  const [shouldAutoFocus, setShouldAutoFocus] = useState(false);
  const [cycleFilter, setCycleFilter] = useState(1);
  const [dnFilter, setDNFilter] = useState([]);
  const [shiftWaktuMap, setShiftWaktuMap] = useState({});
  const [separator, setSeparator] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dataReal, setDataReal] = useState({});
  const [selectedFields, setSelectedFields] = useState([]);
  const isFirst = useRef(true);
  const [refreshInputs, setRefreshInputs] = useState(false);

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
        setSeparator(data.data.separator);
        setDataReal(data.data.dataReal);
        setSelectedFields(data.data.selectedFields);
        // console.log(data, data.data.selectedColumns, "data dapat");
        setSelectedColumn(data.data.selectedColumns);
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

  function normalizeText(str, sep) {
    if (!str || typeof str !== "string") return "";

    if (!sep) return str.replace("/[.*+?^${}()|[]\\]/g", "").toLowerCase();
    const escapedSep = sep.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    const regex = new RegExp(escapedSep, "g");

    return str.replace(regex, "").toLowerCase();
  }

  const generateSummary = useCallback(
    (data, selectedFields, separator = "_") => {
      const singleFieldMap = {}; // { fieldName: Map<fieldValue, totalQty> }
      const comboFieldMap = new Map(); // Map<joinedKey, totalQty>
      const dnMap = new Map(); // Map<dn_number, totalQty>
      const currentProgressMap = new Map(); // key = combo dari selectedFields
      const currentDNMap = new Map();
      const currentsingleFieldMap = {};
      const comboToDNMap = new Map(); // Tambahan baru
      const jumlahOrderDNMap = new Map();
      const jumlahOrderComboField = new Map();

      Data.map((item) =>
        console.log(
          item.delivery_cycle,
          cycleFilter,
          item.delivery_cycle === cycleFilter
        )
      );
      Data.filter(
        (item) =>
          (!cycleFilter || item.delivery_cycle === cycleFilter) &&
          (!dnFilter || dnFilter.includes(item.dn_number))
      ).forEach((item) => {
        const qty = item.qty || 1;
        console.log(item.dn_number, "ini conoth dn");
        const orderQty = item?.["order_(pcs)"];

        const totalQty = Math.round(orderQty / qty);

        selectedFields.forEach((field) => {
          const value = item[field];
          if (!value) return;

          if (!singleFieldMap[field] && !currentsingleFieldMap[field]) {
            singleFieldMap[field] = new Map();
            currentsingleFieldMap[field] = new Map();
          }

          const map = singleFieldMap[field];
          const currentMap = currentsingleFieldMap[field];
          currentMap.set(value, 0);
          map.set(value, (map.get(value) || 0) + totalQty);
        });

        const values = selectedFields.map((f) => item[f]);
        if (values.some((v) => !v)) return; // skip jika ada field kosong
        const comboKey = values.join(separator);

        // const comboKey = selectedFields.map((f) => item[f]).join(separator);
        if (
          comboKey.includes("undefined") ||
          comboKey.includes("null") ||
          comboKey.endsWith("_")
        ) {
          console.warn("Invalid comboKey:", comboKey, "from item:", item);
        }
        comboFieldMap.set(
          comboKey,
          (comboFieldMap.get(comboKey) || 0) + totalQty
        );
        // currentProgressMap.set(comboKey, 0);

        // if (isFirst.current) {
        comboFieldMap.forEach((_, comboKey) => {
          console.log("awalnya disini ya");
          currentProgressMap.set(comboKey, 0); // Set awal
        });
        //   isFirst.current = false;
        // }
        jumlahOrderComboField.set(
          comboKey,
          (jumlahOrderComboField.get(comboKey) || 0) + orderQty
        );

        const dn = item.dn_number;
        if (dn) {
          currentDNMap.set(dn, 0);
          dnMap.set(dn, (dnMap.get(dn) || 0) + totalQty);
          jumlahOrderDNMap.set(dn, (jumlahOrderDNMap.get(dn) || 0) + orderQty);
          comboToDNMap.set(comboKey, dn);
        }
      });

      console.log(
        singleFieldMap,
        comboFieldMap,
        dnMap,
        comboToDNMap,
        currentDNMap,
        "currentprogress",
        currentProgressMap,
        currentsingleFieldMap,
        jumlahOrderComboField,
        jumlahOrderDNMap,
        "ini infonya"
      );
      return {
        singleFieldMap,
        comboFieldMap,
        dnMap,
        comboToDNMap,
        currentDNMap,
        currentProgressMap,
        currentsingleFieldMap,
        jumlahOrderComboField,
        jumlahOrderDNMap,
      };
    },
    [cycleFilter, dnFilter, Data]
  );

  const generateCurrentProgressMap = (rows, comboFieldMap) => {
    const progressMap = new Map();

    rows.forEach((row, index) => {
      if (validList[index] !== true) return;

      const kanban = row.kanban?.toLowerCase();
      const supplier = row.labelSupplier?.toLowerCase();

      if (!kanban || !supplier || kanban === supplier) return;

      for (const [comboKey] of comboFieldMap.entries()) {
        const comboParts = comboKey.split("_");
        const kanbanSlice = kanban
          .slice(0, dataReal.kanbanlength)
          .toLowerCase();

        const containsAll = comboParts.every((part) =>
          kanbanSlice.includes(part.toLowerCase())
        );

        if (containsAll) {
          const current = progressMap.get(comboKey) || 0;
          progressMap.set(comboKey, current + 1);
          break; // hanya satu combo per row
        }
      }
    });

    return progressMap;
  };
  function matchEntryWithMergedData(
    // dataArray,
    comboFieldMap,
    ProgressMap,
    row,
    comboToDNMap,
    dnMap
    // startDate,
    // endDate,
    // pemisah
  ) {
    console.log(
      comboFieldMap,
      ProgressMap,
      dataReal,
      row,
      comboToDNMap,
      "ni data"
    );
    const kanban = row.kanban?.toLowerCase();
    const supplier = row.labelSupplier?.toLowerCase();
    console.log(dataReal, "isi data real", comboFieldMap);

    console.log(
      kanban.slice(0, dataReal.kanbanlength).includes(supplier),
      kanban.slice(0, 23),
      dataReal.kanbanlength
    );
    const kanbanMatch =
      kanban.slice(0, dataReal.kanbanlength).includes(supplier) &&
      kanban.length >= dataReal.kanbanlength;
    const supplierMatch = supplier.length >= dataReal.labelLength;
    console.log("ga coock", supplierMatch, supplier.length);

    if (!kanbanMatch || !supplierMatch) {
      console.log("ga coock");
      return { matchFound: false };
    }
    console.log(comboFieldMap);
    for (const [comboKey, targetQty] of comboFieldMap.entries()) {
      const comboParts = comboKey.split("_");

      const containsAll = comboParts.every((part) =>
        kanban
          .slice(0, dataReal.kanbanlength)
          .toLowerCase()
          .includes(part.toLowerCase())
      );

      if (containsAll) {
        console.log(comboToDNMap, comboKey, comboToDNMap.get(comboKey));
        const matchedDN = comboToDNMap.get(comboKey);
        console.log(matchedDN, "contoh isinya");
        const currentQty = ProgressMap.get(comboKey) || 0;
        const overLimit = currentQty > targetQty;
        console.log("CURRENT", currentQty);
        if (overLimit) {
          return { matchFound: false, matchedDN };
        }
        return {
          matchFound: true,
          comboKey,
          targetQty,
          matchedDN,
        };
      }
    }
    return { matchFound: false, pesan: "DN tidak termasuk" };
  }

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
          console.log(new Date(), "waktu ambil");
          const roundedLength = Math.ceil(savedInputs.length / 10) * 10;
          const newRows = Array.from({ length: roundedLength }, () => ({
            kanban: "",
            labelSupplier: "",
            pesan: "",
          }));
          const newValidList = [];

          if (kanban) {
            console.log(savedInputs, "simpan rows");
            savedInputs.forEach((input) => {
              if (input.index !== undefined && input.index < newRows.length) {
                newRows[input.index] = {
                  kanban: input.kanban || "",
                  labelSupplier: kanban ? input.labelSupplier : "",
                  pesan: input.pesan,
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
                  pesan: input.pesan,
                };
                newValidList[input.index] = input.status || false;
              }
            });

            setRows(newRows);
            setValidList(newValidList);
          }
          console.log(newRows, "ini row awal");
        }
        setShouldAutoFocus(true);
      } catch (error) {
        console.error("Error fetching saved inputs:", error);
      }
    },
    [id, kanban]
  );

  useEffect(() => {
    if (refreshInputs) {
      fetchSavedInputs(selectedDate);
      setRefreshInputs(false); // reset lagi
    }
  }, [refreshInputs, fetchSavedInputs, selectedDate]);

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
    try {
      const formattedDate = moment(Date).format("YYYY-MM-DD");

      const res = await axios.get(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/data/byDate?customer=${id}&date=${formattedDate}`
      );

      console.log(res, "response", separator);
      const result = res.data.data || [];

      if (result.length > 0) {
        setData(result);
        setSelectedData(
          result.map(
            (item) => normalizeText(item.selectedData || ""),
            separator
          )
        );
        setDataLoaded(true);

        await fetchSavedInputs(Date);
      } else {
        setData([]);
        setSelectedData([]);
        setDataLoaded(false);
        setRows(
          Array.from({ length: 20 }, () => ({
            kanban: "",
            labelSupplier: "",
          }))
        );
        setValidList([]);
      }
    } catch (err) {
      console.error("Error fetching data by date:", err);
      setData([]);
      setSelectedData([]);
      setDataLoaded(false);
      setRows(
        Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
      );
      setValidList([]);
    }

    // if (!kanban) {
    //   const itemQTY = fullData.flatMap((kolom) =>
    //     kolom.data
    //       .map((item, index) => ({ item, index }))
    //       .filter(({ item }) => moment(item.delivery_date).isSame(Date, "day"))
    //       .map(({ item, index }) => ({ ...item, index }))
    //   );

    //   if (itemQTY.length > 0) {
    //     setData(itemQTY);
    //     setDataLoaded(true);
    //     // console.log(itemQTY, "ITEM", fullData);
    //     // fullData.flatMap((kolom) =>
    //     //   kolom.data.map((item) => console.log(item))
    //     // );
    //     const indicesToSelect = itemQTY.map((item) => item.index);

    //     // console.log(indicesToSelect);

    //     setSelectedData(
    //       fullData.flatMap(
    //         (kolom) =>
    //           kolom.selectedData.filter((_, index) =>
    //             indicesToSelect.includes(index)
    //           ) || []
    //       )
    //     );
    //     // console.log(
    //     //   Data.filter((_, index) => indicesToSelect.includes(index)) || []
    //     // );
    //     await fetchSavedInputs(Date);
    //   } else {
    //     // console.log("No matching data for selected date");
    //     setData([]);
    //     setDataLoaded(false);
    //     setRows(
    //       Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
    //     );
    //     setValidList([]);
    //   }
    // } else {
    //   const matchedItem = fullData.flatMap((kolom) =>
    //     kolom.data
    //       .map((item, index) => ({ item, index }))
    //       .filter(({ item }) => moment(item.delivery_date).isSame(Date, "day"))
    //       .map(({ item, index }) => ({ ...item, index }))
    //   );
    //   // console.log(matchedItem, "klik disini");
    //   if (matchedItem.length > 0) {
    //     setData(matchedItem);
    //     // setSelectedData(matchedItem.selectedData);
    //     const indicesToSelect = matchedItem.map((item) => item.index);

    //     setDataLoaded(true);
    //     setSelectedData(
    //       fullData.flatMap(
    //         (kolom) =>
    //           kolom.selectedData.filter((_, index) =>
    //             indicesToSelect.includes(index)
    //           ) || []
    //       )
    //     );
    //     // console.log(
    //     //   "filter",
    //     //   fullData.flatMap(
    //     //     (kolom) =>
    //     //       kolom.selectedData.filter((_, index) =>
    //     //         indicesToSelect.includes(index)
    //     //       ) || []
    //     //   ),
    //     //   kanban
    //     // );
    //     await fetchSavedInputs(Date);
    //   } else {
    //     // console.log("No matching data for selected date", "ada disini");
    //     setData([]);
    //     setSelectedData([]);
    //     setDataLoaded(false);
    //     setRows(
    //       Array.from({ length: 20 }, () => ({ kanban: "", labelSupplier: "" }))
    //     );
    //     setValidList([]);
    //   }
    // }
  };

  const updateDnStatus = useCallback(
    async (
      dn,
      total,
      sudahInput,
      // totalDN,
      sudahInputAll,
      totalMaplength,
      totalDNCycle,
      // totalJobInDN === dnClosedStatus[dn + "_" + cycle],
      sudahClosedDNCycle,
      forceFinish = false,
      qtyNow,
      qtyAll
    ) => {
      console.log("disini apa dn");
      if (sudahInputAll == null || totalMaplength == null) return;
      // console.log(
      //   dn,
      //   total,
      //   sudahInput,
      //   totalDN,
      //   sudahInputAll,
      //   totalMaplength,
      //   "NAH INI DN"
      // );
      if (total - sudahInput < 0) return;
      // console.log(
      //   "total dn",
      //   totalDN,
      //   "TOTAL SEMUA",
      //   sudahInputAll,
      //   totalMaplength
      // );

      // console.log(
      //   "contoh map",
      //   dn,
      //   total,
      //   sudahInput,
      //   totalDN,
      //   sudahInputAll,
      //   totalMaplength,
      //   forceFinish,
      //   qtyNow,
      //   "payload"
      // );

      console.log(qtyNow, "jumlah qty", sudahInputAll, dn);
      const percent =
        sudahInputAll === 0
          ? 0
          : sudahInputAll > qtyAll
          ? 100
          : Math.round((sudahInputAll / qtyAll) * 100);

      let currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber: dn,
          persentase: percent,
          qty: qtyNow,
        };

        console.log(basePayload, "dasar payload");
        let res;

        if (sudahInput === 1 && totalMaplength - sudahInputAll === 0) {
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
              sudahAll: sudahInputAll === totalMaplength,
            }
          );

          let statusInput;
          if (totalMaplength - sudahInputAll === 0) {
            statusInput = "done";
          } else if (sudahInputAll === 1) {
            statusInput = "first";
          } else {
            statusInput = "-";
          }
          console.log(res, "hasil reponse");
          if (
            res?.data?.verificationCode &&
            (sudahInputAll === totalMaplength || statusInput === "done")
          ) {
            setqrCodes((prev) => {
              const newCode =
                res.data.verificationCode || res.data.data.verificationCode;
              return prev.includes(newCode) || newCode == null
                ? prev
                : [...prev, newCode];
            });
          }
        } else {
          // console.log(totalMaplength, sudahInputAll, "bener ga");
          const status =
            sudahInput === 1
              ? "first"
              : totalMaplength - sudahInputAll === 0
              ? "done"
              : "-";

          let currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
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
              sudahAll: sudahInputAll === totalMaplength,
            }
          );
        }

        let statusInput;

        if (totalMaplength - sudahInputAll === 0) {
          statusInput = "done";
        } else if (sudahInput === 1) {
          statusInput = "first";
        } else {
          statusInput = "-";
        }

        if (
          res?.data?.verificationCode &&
          sudahInputAll === totalMaplength &&
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
        // const found = Data.find((d) => d.dn_number === dn);
        // const cycle = found?.delivery_cycle || found?.cycle;
        if (
          !shiftWaktuMap?.[cycleFilter || 1]?.shift &&
          res.data.shift !== shiftWaktuMap?.[cycleFilter || 1]?.shift &&
          forceFinish
        ) {
          // if (res.data.shift) {
          //   setShiftMap((prev) => ({
          //     ...prev,
          //     [cycle]: shift,
          //   }));
          // }

          // if (res.data.waktuAktual) {
          //   setWaktuAktualMap((prev) => ({
          //     ...prev,
          //     [cycle]: moment(res.data.waktuAktual).format("DD-MM-YYYY HH:mm"),
          //   }));
          // }

          if (res.data.shift && forceFinish) {
            setShiftWaktuMap((prev) => ({
              ...prev,
              [cycleFilter]: {
                waktuAktual: res.data.waktuAktual
                  ? moment(res.data.waktuAktual).format("DD-MM-YYYY HH:mm")
                  : " ",
                shift:
                  totalDNCycle === sudahClosedDNCycle ? res.data.shift : " ",
              },
            }));
          }
        }

        console.log(res, "hasil reponse");

        if (forceFinish && res.data.verificationCode) {
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
            {
              customerId: id,
              tanggal: moment(selectedDate).format("YYYY-MM-DD"),
              codeOD: res.data.verificationCode || null,
              dnNumber: dn,
            }
          );
        }
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, checkProsesSekarang, cycleFilter, shiftWaktuMap]
  );

  const updateODStatus = useCallback(
    async (
      order_no,
      sudahInputOD,
      totalKanban,
      totalMaplength,
      sudahInputAll,
      finishAll = false,
      qtyNow = 0
    ) => {
      if (sudahInputAll == null || totalMaplength == null) return; // true jika null atau undefined

      if (totalKanban < sudahInputOD) return;
      const percent =
        sudahInputOD === 0
          ? 0
          : sudahInputOD > totalKanban
          ? 100
          : Math.round((sudahInputOD / totalKanban) * 100);

      console.log(
        "contoh map",
        order_no,
        sudahInputOD,
        totalKanban,
        totalMaplength,
        sudahInputAll,
        finishAll,
        qtyNow
      );

      const dnNumber = order_no.split(",")[0];

      try {
        const basePayload = {
          customerId: id,
          tanggal: moment(selectedDate).format("YYYY-MM-DD"),
          dnNumber,
          persentase: percent,
          qty: qtyNow,
        };

        let res;

        // Jika dua kondisi terpenuhi
        let currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
        if (sudahInputOD === 1) {
          currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
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

          if (totalKanban - sudahInputOD === 0) {
            res = await axios.put(
              `${import.meta.env.VITE_BACKEND_URL}/api/track`,
              {
                ...basePayload,
                status: "done",
                shift: sudahInputAll === totalMaplength ? currentShift : null,
                sudahAll: sudahInputAll === totalMaplength,
              }
            );
            console.log("Res pertama", res);
          }
          let statusInput;

          if (totalKanban - sudahInputOD === 0) {
            statusInput = "done";
          } else if (sudahInputOD === 1) {
            statusInput = "first";
          } else {
            statusInput = "-";
          }

          console.log(statusInput, "pertama astatus");
          if (
            res?.data?.verificationCode &&
            sudahInputOD === totalKanban &&
            statusInput === "done"
          ) {
            console.log(res.data.verificationCode, "KENAPA GA ADA");
            const newCode =
              res.data.verificationCode || res.data.data?.verificationCode;
            setqrCodes((prev) =>
              prev.includes(newCode) || !newCode ? prev : [...prev, newCode]
            );
          }

          // if (!shift && res.data.shift && sudahInputAll === totalMaplength) {
          //   setShift(res.data.shift);
          // }

          // setqrCodes((prev) => [
          //   ...prev,
          //   res.data.verificationCode || res.data.data.verificationCode,
          // ]);
          if (
            !shiftWaktuMap?.[cycleFilter || 1]?.shift &&
            res.data.shift !== shiftWaktuMap?.[cycleFilter || 1]?.shift &&
            finishAll
          ) {
            setShiftWaktuMap((prev) => ({
              ...prev,
              [cycleFilter || 1]: {
                waktuAktual: res.data.waktuAktual
                  ? moment(res.data.waktuAktual).format("DD-MM-YYYY HH:mm")
                  : " ",
                shift: res.data.shift || " ",
              },
            }));
          }
        } else {
          const status = totalKanban - sudahInputOD === 0 ? "done" : "-";

          console.log("kesini", sudahInputAll, totalMaplength, status);
          let currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
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
              sudahAll: sudahInputAll === totalMaplength,
            }
          );
          console.log(res, "status", status, sudahInputAll === totalMaplength);
        }

        let statusInput;
        if (totalKanban - sudahInputOD === 0) {
          statusInput = "done";
        } else if (sudahInputOD === 1) {
          statusInput = "first";
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
          !shiftWaktuMap?.[cycleFilter || 1]?.shift &&
          res.data.shift !== shiftWaktuMap?.[cycleFilter || 1]?.shift &&
          finishAll
        ) {
          //   setShift(res.data.shift); // hanya update kalau beda
          // }

          // setWaktuAktual(res.data.waktuAktual);

          setShiftWaktuMap((prev) => ({
            ...prev,
            [cycleFilter || 1]: {
              waktuAktual: res.data.waktuAktual
                ? moment(res.data.waktuAktual).format("DD-MM-YYYY HH:mm")
                : " ",
              shift: res.data.shift || " ",
            },
          }));
        }

        console.log(res.data.verificationCode, "Ada ga");
        if (finishAll && res.data.verificationCode) {
          await axios.put(
            `${import.meta.env.VITE_BACKEND_URL}/api/track/finish`,
            {
              customerId: id,
              tanggal: moment(selectedDate).format("YYYY-MM-DD"),
              codeOD: res.data.verificationCode || null,
              dnNumber: order_no.split(",")[0],
            }
          );
        }
      } catch (error) {
        console.error("Error updating DN status:", error);
      }
    },
    [id, selectedDate, shiftWaktuMap, checkProsesSekarang, cycleFilter]
  );

  const lastCharAfterSpace = (str) => {
    if (!str) return "";
    const parts = str.trim().split(" ");
    return parts.length > 1 ? parts[parts.length - 1] : parts;
  };

  const summary = useMemo(() => {
    if (!Data || !selectedFields?.length) return null;
    return generateSummary(Data, selectedFields, "_");
  }, [Data, selectedFields, generateSummary]);

  const generateSummaryTable = useCallback(async () => {
    if (
      !dataLoaded &&
      (!uniqueColumn || uniqueColumn.length < 1) &&
      (!Array.isArray(selectedFields) || selectedFields.length === 0)
    )
      return;

    if (!summary) return;

    const {
      singleFieldMap,
      comboFieldMap,
      dnMap,
      comboToDNMap,
      currentDNMap,
      currentProgressMap,
      currentsingleFieldMap,
      jumlahOrderComboField,
      jumlahOrderDNMap,
    } = summary;

    // Clone the mutable maps to avoid mutating memoized summary
    const clonedCurrentDNMap = new Map(currentDNMap);
    const clonedCurrentProgressMap = new Map(currentProgressMap);

    rows.forEach((row, index) => {
      if (!validList[index]) return;

      const kanban = row.kanban?.toLowerCase();
      const supplier = row.labelSupplier?.toLowerCase();

      if (!kanban || !supplier || kanban === supplier) return;

      let comboMatch = null;

      for (const [comboKey, targetQty] of comboFieldMap.entries()) {
        const comboParts = comboKey.split("_");
        const kanbanSlice = kanban
          .slice(0, dataReal.kanbanlength)
          .toLowerCase();

        const containsAll = comboParts.every((part) =>
          kanbanSlice.includes(part.toLowerCase())
        );

        if (containsAll) {
          comboMatch = { comboKey, targetQty };
          break;
        }
      }

      if (
        comboMatch &&
        supplier.length >= dataReal.labelLength &&
        kanban.length >= dataReal.kanbanlength
      ) {
        const { comboKey } = comboMatch;
        console.log(comboKey);
        const dn = comboToDNMap.get(comboKey);

        if (dn) {
          clonedCurrentDNMap.set(dn, (clonedCurrentDNMap.get(dn) || 0) + 1);
          clonedCurrentProgressMap.set(
            comboKey,
            (clonedCurrentProgressMap.get(comboKey) || 0) + 1
          );
        }
      }

      console.log("kesini", clonedCurrentProgressMap, clonedCurrentDNMap);
    });

    const seenDN = new Set();
    const summaryTable = [];

    for (const [comboKey] of comboFieldMap.entries()) {
      const dn = comboToDNMap.get(comboKey) || "-";
      if (seenDN.has(dn)) continue;
      seenDN.add(dn);

      const totalQty = dnMap.get(dn);
      const currentQty = clonedCurrentDNMap.get(dn);
      const sisa = Math.max(totalQty - currentQty, 0);
      const status = sisa === 0 ? "Closed" : "Open";
      const orderQty = jumlahOrderDNMap.get(dn);

      summaryTable.push({
        dn_number: dn,
        jumlah_order: orderQty,
        total: totalQty,
        sisa,
        status,
      });
      // }

      //   }
      //   setSummaryTable(summaryTable);
      // }, [
      //   rows,
      //   validList,
      //   dataLoaded,
      //   uniqueColumn,
      //   selectedFields,
      //   summary,
      //   dataReal,
      // ]);

      // for (const [comboKey, _] of comboFieldMap.entries()) {
      //   // const currentQty = validProgressMap.get(comboKey) || 0;
      //   const dn = comboToDNMap.get(comboKey) || "-";
      //   console.log(dnMap.get(dn), currentDNMap.get(dn));
      //   const totalQty = dnMap.get(dn);
      //   const currentQty = currentDNMap.get(dn);
      //   const sisa = Math.max(totalQty - currentQty, 0);
      //   const status = sisa === 0 ? "Closed" : "Open";

      //   const fields = comboKey.split(separator);
      //   const combinedKey = selectedFields.reduce((obj, field, i) => {
      //     obj[field] = fields[i] || "";
      //     return obj;
      //   }, {});

      //   console.log(jumlahOrderDNMap, "ini kaanya aada sisinya");
      //   const orderQty = jumlahOrderDNMap.get(dn);

      //   summaryTable.push({
      //     ...combinedKey,
      //     dn_number: dn,
      //     jumlah_order: orderQty,
      //     total: totalQty,
      //     sisa,
      //     status,
      //   });
      //   console.log(summaryTable, "tambag ga");
      // }

      // const dnToCycleMap = new Map();
      // // console.log(Data, "ada table data", uniqueColumn);
      // Data.filter((item) => item.delivery_cycle === cycleFilter || 1).forEach(
      //   (item) => {
      //     const dn = item.dn_number;
      //     const key = `${dn}_${item?.selectedData}_${item.delivery_cycle || 1}`;

      //     const orderQty = Number(item["order_(pcs)"]) || 0;
      //     const qty = Number(item.qty) || 1;
      //     const totalQty = Math.round(orderQty / qty);

      //     if (!dnToCycleMap.has(key)) {
      //       dnToCycleMap.set(key, item.delivery_cycle || item.cycle || 0);
      //     }

      //     totalMap[key] = (totalMap[key] || 0) + totalQty;
      //     jumlahQTY[key] = (jumlahQTY[key] || 0) + orderQty;

      //     if (!jobCountPerDN[dn + "_" + (item?.delivery_cycle || "1")])
      //       jobCountPerDN[dn + "_" + (item?.delivery_cycle || "1")] = new Set();
      //     jobCountPerDN[dn + "_" + (item?.delivery_cycle || "1")].add(
      //       item?.selectedData
      //     );
      //     jobMap.set(key, item);

      //     totalMapDN[dn + "_" + (item?.delivery_cycle || "1")] =
      //       (totalMapDN[dn + "_" + (item?.delivery_cycle || "1")] || 0) +
      //       Math.round(orderQty / qty);
      //     jumlahQTYDN[dn + "_" + (item?.delivery_cycle || "1")] =
      //       (jumlahQTYDN[dn + "_" + (item?.delivery_cycle || "1")] || 0) +
      //       orderQty;
      //     qtyPerJob[key] = totalQty * qty;
      //     qtyPerDNBerjalan[dn + "_" + (item?.delivery_cycle || "1")] =
      //       (qtyPerDNBerjalan[dn + "_" + (item?.delivery_cycle || "1")] || 0) +
      //       qtyPerJob[key];
      //   }
      // );
      // // setJumlahOrder(jumlahQTY);
      // setSudahSelesai(totalMap);
      // const sisaMap = {};
      // rows.forEach((row, index) => {
      //   if (!validList[index]) return;

      //   const kanban = row.kanban?.toLowerCase();
      //   const labelSupplier = row.labelSupplier?.toLowerCase();
      //   const labelTrimmed = labelSupplier?.split("|")[0];

      //   if (kanban === labelSupplier) return;

      //   const foundIndex = Data.findIndex((item) => {
      //     const partNo = item?.part_no?.toLowerCase();

      //     const material = item?.material?.toLowerCase();

      //     const jobPart = lastCharAfterSpace(item?.job_no?.toLowerCase());
      //     const isMatchKanban = kanban?.includes(
      //       normalizeText(item.selectedData.toLowerCase(), separator)
      //     );
      //     const isMatchLabel =
      //       new RegExp(`\\b${jobPart}\\b`, "i").test(labelTrimmed) ||
      //       (partNo && new RegExp(`\\b${partNo}\\b`, "i").test(labelTrimmed)) ||
      //       (material &&
      //         new RegExp(`\\b${material}\\b`, "i").test(labelTrimmed)) ||
      //       item?.selectedData
      //         ?.toLowerCase()
      //         .includes(labelTrimmed.toLowerCase()) ||
      //       new RegExp(`${item?.selectedData}`, "i").test(labelTrimmed);

      //     return isMatchKanban && isMatchLabel;
      //   });

      //   console.log(foundIndex, "cari indeks", sisaMap);
      //   if (foundIndex !== -1 && selectedData[foundIndex]) {
      //     const dn = Data[foundIndex]?.dn_number;

      //     const key =
      //       dn +
      //       "_" +
      //       selectedData[foundIndex].toUpperCase() +
      //       "_" +
      //       Data[foundIndex].delivery_cycle;

      //     sisaMap[key] = (sisaMap[key] || 0) + 1;
      //   }
      // });
      // setValidKanban(sisaMap);
      // setSudahSelesai(totalMap);

      // const summaryTable = [];

      // const dnClosedStatus = {};

      // for (const key of Object.keys(totalMap)) {
      //   const [dn, dnUnique, cycle] = key.split("_");
      //   const total = totalMap[key];
      //   const sisaInput = sisaMap[key] || 0;

      //   console.log(jobMap.get(key)?.qty, "ada aktual", sisaInput);
      //   const currentProgressQty = sisaInput * jobMap.get(key)?.qty; // Ini qty aktual

      //   const sisa = Math.max(total - sisaInput, 0);

      //   const jumlah = jumlahQTY[key];

      //   const status = sisa === 0 ? "Closed" : "Open";

      //   summaryTable.push({
      //     dn_number: dnUnique,
      //     cycle: dnToCycleMap.get(key) || 1,
      //     jumlah_order: jumlah,
      //     total,
      //     sisa,
      //     status,
      //   });

      //   if (status === "Closed") {
      //     dnClosedStatus[dn + "_" + cycle] =
      //       (dnClosedStatus[dn + "_" + cycle] || 0) + 1;
      //   }

      //   const totalJobInDN = jobCountPerDN[dn + "_" + cycle]?.size || 0;

      //   const willBeClosedDNCount = Object.values(dnClosedStatus).filter(
      //     (count, idx) => {
      //       const dnKey = Object.keys(dnClosedStatus)[idx];

      //       return count === jobCountPerDN[dnKey]?.size;
      //     }
      //   ).length;

      //   const allDNsInCurrentCycle = Object.keys(jobCountPerDN).filter(
      //     (k) => k.split("_")[1] === cycle
      //   );

      //   const closedDNsInCurrentCycle = allDNsInCurrentCycle.filter((dnKey) => {
      //     return dnClosedStatus[dnKey] === jobCountPerDN[dnKey]?.size;
      //   });

      //   const jumlahDNDalamCycleIni = allDNsInCurrentCycle.length;
      //   const jumlahDNClosedDalamCycleIni = closedDNsInCurrentCycle.length;

      //   const isAllDNClosed = willBeClosedDNCount === totalJobInDN;
      //   const qtyAll = jumlahQTYDN[dn + "_" + cycle];

      //   await updateDnStatus(
      //     dn,
      //     total,
      //     sisaInput,
      //     totalJobInDN,
      //     dnClosedStatus[dn + "_" + cycle],
      //     jumlahDNDalamCycleIni,
      //     jumlahDNClosedDalamCycleIni,
      //     jumlahDNDalamCycleIni === jumlahDNClosedDalamCycleIni,
      //     currentProgressQty,
      //     qtyAll
      //     // Object.values(sisaMap).reduce((a, b) => a + b, 0),
      //     // Object.keys(totalMap).length
      //   );
      // }

      // const filteredTable = cycleFilter
      //   ? summaryTable.filter((row) => row.cycle === cycleFilter)
      //   : summaryTable;
      console.log(comboToDNMap, "ini kombinasi");
      let closedCount = 0;
      for (const [comboKey, targetQty] of comboFieldMap.entries()) {
        const currentQty = clonedCurrentProgressMap.get(comboKey) || 0;
        if (currentQty >= targetQty) closedCount++;
      }

      console.log(
        closedCount,
        dn,
        totalQty,
        currentQty,
        comboToDNMap.size,
        closedCount,
        dnMap.size,
        closedCount,
        closedCount === comboToDNMap.size, // apa dn sudah ada semua, dnMap, dan
        jumlahOrderDNMap.get(dn), // jumlah qty DN
        jumlahOrderDNMap.get(dn)
      );
      // await updateDnStatus(
      //   dn,
      //   totalQty,
      //   currentQty,
      //   comboToDNMap.size,
      //   closedCount,
      //   dnMap.size,
      //   closedCount,
      //   closedCount === dnMap.size, // apa dn sudah ada semua, dnMap, dan
      //   jumlahOrderDNMap.get(dn), // jumlah qty DN
      //   jumlahOrderDNMap.get(dn) //jumlah order nya
      // );
    }
    setSummaryTable(summaryTable);
  }, [
    rows,
    validList,
    // selectedData,
    dataLoaded,
    // updateDnStatus,
    uniqueColumn,
    updateDnStatus,
    // separator,
    selectedFields,
    summary,
    // selectedFields.length,
    dataReal,
    // dataReal.kanbanlength,
    // generateSummary,
  ]);

  // const generateSummaryTableCycleDN = useCallback(async () => {
  //   if (!dataLoaded && (!uniqueColumn || uniqueColumn.length < 1)) return;
  //   const totalMap = {};
  //   const jumlahQTY = {};
  //   const CountPerDN = {};
  //   const jobMap = new Map();
  //   const qtyPerJob = {};
  //   const qtyPerDNBerjalan = {};
  //   const jumlahQTYDN = new Map();
  //   const dnToCycleMap = new Map();

  //   Data.filter((item) => item.delivery_cycle === cycleFilter || 1).forEach(
  //     (item) => {
  //       const dn = item.dn_number;
  //       console.log(item.dn_number, "ini conoth dn");
  //       const key = `${dn}_${item?.selectedData}_${item.delivery_cycle || 1}`;

  //       const orderQty = Number(item["order_(pcs)"]) || 0;
  //       const qty = Number(item.qty) || 1;
  //       const totalQty = Math.round(orderQty / qty);

  //       if (!dnToCycleMap.has(dn)) {
  //         dnToCycleMap.set(dn, item.delivery_cycle || item.cycle || 0);
  //       }

  //       totalMap[key] = (totalMap[key] || 0) + totalQty;
  //       jumlahQTY[key] = (jumlahQTY[key] || 0) + orderQty;

  //       if (!CountPerDN[dn + (item?.delivery_cycle || "1")])
  //         CountPerDN[dn + "_" + (item?.delivery_cycle || "1")] = new Set();
  //       CountPerDN[dn + "_" + (item?.delivery_cycle || "1")].add(
  //         item?.selectedData
  //       );

  //       const dnQTY = jumlahQTYDN.get(dn);
  //       if (dnQTY) {
  //         jumlahQTYDN.set(dn, dnQTY + totalQty);
  //       } else {
  //         jumlahQTYDN.set(dn, totalQty);
  //       }

  //       jobMap.set(key, item);

  //       qtyPerJob[key] = totalQty * qty;
  //       qtyPerDNBerjalan[dn + "_" + (item?.delivery_cycle || "1")] =
  //         (qtyPerDNBerjalan[dn + "_" + (item?.delivery_cycle || "1")] || 0) +
  //         qtyPerJob[key];

  //       jumlahQTYDN[dn];
  //     }
  //   );

  //   setSudahSelesai(totalMap);
  //   const sisaMap = {};
  //   rows.forEach((row, index) => {
  //     if (!validList[index]) return;
  //     const kanban = row.kanban?.toLowerCase();
  //     const labelSupplier = row.labelSupplier?.toLowerCase();
  //     const labelTrimmed = labelSupplier?.split("|")[0];

  //     if (kanban === labelSupplier) return;

  //     const foundIndex = Data.findIndex((item) => {
  //       const partNo = item?.part_no?.toLowerCase();
  //       const material = item?.material?.toLowerCase();
  //       const jobPart = lastCharAfterSpace(item?.job_no?.toLowerCase());
  //       const isMatchKanban = kanban?.includes(
  //         normalizeText(item.selectedData.toLowerCase(), separator)
  //       );

  //       const isMatchLabel =
  //         new RegExp(`\\b${jobPart}\\b`, "i").test(labelTrimmed) ||
  //         (partNo && new RegExp(`\\b${partNo}\\b`, "i").test(labelTrimmed)) ||
  //         (material &&
  //           new RegExp(`\\b${material}\\b`, "i").test(labelTrimmed)) ||
  //         item?.selectedData
  //           ?.toLowerCase()
  //           .includes(labelTrimmed.toLowerCase()) ||
  //         new RegExp(`${item?.selectedData}`, "i").test(labelTrimmed);

  //       return isMatchKanban && isMatchLabel;
  //     });

  //     console.log(foundIndex, "cari indeks", sisaMap);
  //     if (foundIndex !== -1 && selectedData[foundIndex]) {
  //       const dn = Data[foundIndex]?.dn_number;
  //       const key =
  //         dn +
  //         "_" +
  //         selectedData[foundIndex].toUpperCase() +
  //         "_" +
  //         Data[foundIndex].delivery_cycle;

  //       sisaMap[key] = (sisaMap[key] || 0) + 1;
  //     }
  //   });
  //   setValidKanban(sisaMap);
  //   setSudahSelesai(totalMap);

  //   const summaryTableCycleDN = [];
  //   const dnClosedStatus = {};

  //   for (const key of Object.keys(totalMap)) {
  //     const [dn, dnUnique, cycle] = key.split("_");
  //     const total = totalMap[key];
  //     const sisaInput = sisaMap[key] || 0;
  //     console.log(jobMap.get(key)?.qty, "ada aktual", sisaInput);
  //     const currentProgressQty = sisaInput * jobMap.get(key)?.qty;

  //     const sisa = Math.max(total - sisaInput, 0);
  //     const jumlah = jumlahQTY[key];

  //     const status = sisa === 0 ? "Closed" : "Open";

  //     summaryTableCycleDN.push({
  //       dn_number: dn,
  //       cycle: dnToCycleMap.get(key) || 1,
  //       jumlah_order: jumlah,
  //       total,
  //       sisa,
  //       status,
  //     });

  //     if (status === "Closed") {
  //       dnClosedStatus[dn] = (dnClosedStatus[dn] || 0) + 1;
  //     }

  //     const totalInDN = CountPerDN[dn]?.size || 0;

  //     const willBeClosedDNCount = Object.values(dnClosedStatus).filter(
  //       (count, idx) => {
  //         const dnKey = Object.keys(dnClosedStatus)[idx];
  //         return count === CountPerDN[dnKey]?.size;
  //       }
  //     ).length;

  //     const allDNsInCurrentCycle = Object.keys(CountPerDN).filter(
  //       (k) => k.split("_")[1] === cycle
  //     );

  //     const closedDNsInCurrentCycle = allDNsInCurrentCycle.filter((dnKey) => {
  //       return dnClosedStatus[dnKey] === CountPerDN[dnKey]?.size;
  //     });

  //     const jumlahDNDalamCycleIni = allDNsInCurrentCycle.length;
  //     const jumlahDNClosedDalamCycleIni = closedDNsInCurrentCycle.length;

  //     const isAllDNClosed = willBeClosedDNCount === totalJobInDN;
  //     const qtyAll = jumlahQTYDN[dn + "_" + cycle];

  //     await updateDnStatus(
  //       dn,
  //       total,
  //       sisaInput,
  //       totalJobInDN,
  //       dnClosedStatus[dn + "_" + cycle],
  //       jumlahDNDalamCycleIni,
  //       jumlahDNClosedDalamCycleIni,
  //       jumlahDNDalamCycleIni === jumlahDNClosedDalamCycleIni,
  //       currentProgressQty,
  //       qtyAll
  //     );
  //   }
  //   const filteredTable = cycleFilter
  //     ? summaryTable.filter((row) => row.cycle === cycleFilter)
  //     : summaryTable;

  //   setSummaryTable(filteredTable);
  // }, [
  //   rows,
  //   validList,
  //   selectedData,
  //   Data,
  //   dataLoaded,
  //   cycleFilter,
  //   updateDnStatus,
  //   uniqueColumn,
  //   separator,
  // ]);

  const generateSummaryTableNoKanban = useCallback(async () => {
    if (!dataLoaded && !uniqueColumn) return;

    const totalMap = {};
    const jumlahQTY = {};
    const jumlahQTYDN = {};
    const jobCountPerDN = {};
    const jobMap = new Map();
    const qtyPerJob = {};
    const qtyPerDNBerjalan = {};

    Data.forEach((item) => {
      const dn = item.dn_number;
      const cycle = item.delivery_cycle || "1";
      const job = item?.[uniqueColumn[0]];
      const key = `${dn},${job}`;
      const orderQty = Number(item[`order_(pcs)`]);
      const unitQty = Number(item.qty);
      const totalQty = Math.round(orderQty / unitQty);

      totalMap[key] = (totalMap[key] || 0) + totalQty;
      jumlahQTY[key] = (jumlahQTY[key] || 0) + orderQty;
      if (!jobCountPerDN[dn]) jobCountPerDN[dn] = new Set();
      jobCountPerDN[dn].add(job);

      jobMap.set(key, item);
      jumlahQTYDN[dn + cycle] = (jumlahQTYDN[dn + cycle] || 0) + orderQty;
      qtyPerJob[key] = totalQty * unitQty;
      qtyPerDNBerjalan[dn] = (qtyPerDNBerjalan[dn] || 0) + qtyPerJob[key];
    });

    // Data.forEach((item) => {
    //   const key = `${item.dn_number},${item[uniqueColumn]}`;
    //   jobMap.set(key, item);
    // });
    // console.log(jumlahQTY, totalMap, "qty");

    const sisaMap = {};
    rows.forEach((row, index) => {
      // console.log(validList[index], "masuk rows");
      if (!validList[index]) return;

      const jobKey = Array.from(jobMap.keys()).find((key) => {
        const job = key.split(",")[1];
        return row.kanban?.toLowerCase().includes(job.toLowerCase());
      });

      if (jobKey) {
        sisaMap[jobKey] = (sisaMap[jobKey] || 0) + 1;
      }
    });

    setValidKanban(sisaMap);
    setSudahSelesai(totalMap);

    const summaryTableNoKanban = [];
    const dnClosedStatus = {};
    let closedDNCount = 0;
    let totalDN = Object.keys(jobCountPerDN).length;
    // let totalDNCount = Object.keys(jobCountPerDN).length;

    for (const key of Object.keys(totalMap)) {
      const [dn, job] = key.split(",");
      const total = totalMap[key];
      const input = sisaMap[key] || 0;
      const currentProgressQty = input * (jobMap.get(key)?.qty || 0); // Ini qty aktual

      const sisa = Math.max(total - input, 0);
      const status = sisa === 0 ? "Closed" : "Open";

      summaryTableNoKanban.push({
        dn_number: key,
        jumlah_order: jumlahQTY[key],
        total,
        sisa,
        status,
      });

      // if (!dnStatusMap[dn]) dnStatusMap[dn] = [];
      // dnStatusMap[dn].push(status);
      // console.log(dnStatusMap[dn], dnStatusMap, "status");

      if (status === "Closed") {
        dnClosedStatus[dn] = (dnClosedStatus[dn] || 0) + 1;
      }

      // Jika semua job dalam DN ini sudah closed
      const totalJobInDN = jobCountPerDN[dn]?.size || 0;
      const jobClosedInThisDN = dnClosedStatus[dn] || 0;
      const isAllJobInThisDNClosed = jobClosedInThisDN === totalJobInDN;

      // Jika semua DN selesai
      const willBeClosedDNCount = Object.values(dnClosedStatus).filter(
        (count, idx) => {
          // console.log(
          //   count,
          //   jobCountPerDN[Object.keys(dnClosedStatus)[idx]]?.size,
          //   dnClosedStatus[0],
          //   Object.keys(dnClosedStatus)[idx],
          //   "ini dn seleesai"
          // );
          const dnKey = Object.keys(dnClosedStatus)[idx];
          return count === jobCountPerDN[dnKey]?.size;
        }
      ).length;

      const isAllDNClosed = willBeClosedDNCount === totalDN;
      // console.log(isAllDNClosed, totalDN, willBeClosedDNCount, "ini kitiman");

      await updateODStatus(
        key, // tetap pakai key = `${dn},${job}`
        input,
        total,
        totalDN,
        willBeClosedDNCount,
        isAllDNClosed,
        currentProgressQty
      );
    }

    setSummaryTable(summaryTableNoKanban);
    // setAllDnClosed(allClosed);
  }, [rows, validList, Data, dataLoaded, updateODStatus, uniqueColumn]);
  // const dnNumbersKanban = Object.keys(totalMap);
  // let allClosed = true;

  // const table = dnNumbersKanban.map((unique) => {
  //   const total = totalMap[unique];
  //   // console.log(totalMap[unique], unique, "unik");
  //   const sisaInput = sisaMap[unique] || 0;

  //   const sisa = total - sisaInput;

  //   // const sudahInputDN = Object.keys(sisaMap).filter(
  //   //   (v) => v === totalMapDN[unique.s].length
  //   // );
  //   const sudahInputDN = Object.keys(sisaMap).filter(
  //     (v) => sisaMap[v] === totalMapDN[unique.split(",")[0]]
  //   );
  //   Object.keys(sisaMap).filter((v) =>
  //     console.log(
  //       v,
  //       totalMapDN[unique.split(",")[0]],
  //       sisaMap[v],
  //       totalMap[v],
  //       totalMap[unique],
  //       "total ini"
  //     )
  //   );

  //   console.log(
  //     Object.keys(sisaMap).map((v) =>
  //       console.log(
  //         v,
  //         sisaMap[v],
  //         totalMap[unique],
  //         sisaMap[v] === totalMap[unique],
  //         v,
  //         "disa"
  //       )
  //     )
  //   );

  //   let status = "Closed";
  //   if (sisa > 0) {
  //     console.log(sisaInput, "disini input > 0");
  //     status = "Open";
  //     allClosed = false;
  //     updateODStatus(
  //       unique,
  //       sisaInput,
  //       total,
  //       Object.keys(totalMapDN).length,
  //       sudahInputDN.length
  //     );
  //   } else if (sisa === 0 && status === "Closed") {
  //     console.log(sisaInput, "disini input");
  //     updateODStatus(
  //       unique,
  //       sisaInput,
  //       total,
  //       Object.keys(totalMapDN).length,
  //       sudahInputDN.length
  //     );
  //   } else if (sisa < 0) {
  //     return {
  //       dn_number: unique,
  //       jumlah_order: jumlahQTY[unique],
  //       total,
  //       sisa: 0,
  //       status,
  //     };
  //   }

  //   return {
  //     dn_number: unique,
  //     jumlah_order: jumlahQTY[unique],
  //     total,
  //     sisa,
  //     status,
  //   };
  // });

  //   setSummaryTable(table);

  // }, [rows, validList, Data, dataLoaded, updateODStatus, uniqueColumn]);

  useEffect(() => {
    // const uniqueSelected = selectedFields.filter((item) => item !== dn_number)
    // const { singleFieldMap, comboFieldMap, dnMap } = generateSummary(Data, uniqueSelected);
    if (kanban === true) {
      generateSummaryTable();
    } else {
      generateSummaryTableNoKanban();
    }
  }, [validList, generateSummaryTable, kanban, generateSummaryTableNoKanban]);

  const handleInput = async (index, field, value) => {
    console.log(Data, "ini isi");
    if (!summary) return;

    const {
      singleFieldMap,
      comboFieldMap,
      dnMap,
      comboToDNMap,
      currentDNMap,
      currentProgressMap,
      currentsingleFieldMap,
      jumlahOrderComboField,
      jumlahOrderDNMap,
    } = summary;

    console.log(
      singleFieldMap,
      comboFieldMap,
      dnMap,
      comboToDNMap,
      currentDNMap,
      // currentProgressMap,
      currentsingleFieldMap,
      jumlahOrderComboField,
      jumlahOrderDNMap,
      "ini contoh isi dibutuhkan"
    );

    const newValue = value.trim();
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const row = updatedRows[index];

    console.log(separator, "pemisah", selectedFields);
    console.log(comboFieldMap, dnMap, comboToDNMap, "kombinasu");
    const updatedProgressMap = generateCurrentProgressMap(
      updatedRows,
      comboFieldMap,
      dataReal
    );

    const match = matchEntryWithMergedData(
      // Data,
      comboFieldMap,
      updatedProgressMap,
      row,
      comboToDNMap,
      dnMap
      // startDate,
      // endDate,
      // separator
    );
    console.log(match, "ini cocok ga");

    let isValid = match.matchFound;

    // if (match.matchFound) {
    //   currentProgressMap.set(
    //     match.comboKey,
    //     currentProgressMap.get(match.comboKey) + 1
    //   );
    // }

    // const updatedProgressMap = useMemo(() => {
    //   return generateCurrentProgressMap(rows, comboFieldMap, dataReal);
    // }, [rows, comboFieldMap, dataReal]);

    // const partNo = match.rawData?.part_no || match.rawData?.material;

    // const updatedValidList = [...validList];
    // updatedValidList[index] = isValid;
    // setValidList(updatedValidList);

    // Kirim ke server kalau valid
    // if (isValid) {

    const changedRow = {
      ...row,
      status: isValid,
    };

    try {
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
            dnFound: match.matchedDN,
            cycle: cycleFilter,
            // validPart: String(partNo).toUpperCase(),
          }),
        }
      );
      console.log(
        changedRow,
        index,
        id,
        selectedDate,
        match.matchedDN,
        cycleFilter,
        "ini dikirim"
      );
      const result = await res.json();
      console.log("Result submit:", result);

      const statusFromServer = result.status;
      const messageFromServer = result.pesan;

      setValidList((prev) => {
        const updated = [...prev];
        updated[index] = statusFromServer;
        return updated;
      });

      console.log(messageFromServer, "pesannya");
      if (result.refresh) {
        setRefreshInputs(true);
        if (field == "kanban") {
          if (value.endsWith("\n")) {
            setTimeout(() => {
              inputRefs.current[index * 2 + 1]?.focus();
            }, 1);
          }
        } else {
          if (value.endsWith("\n")) {
            setTimeout(() => {
              inputRefs.current[(index + 1) * 2]?.focus();
            }, 1);
          }
        }
      }

      setPartListReal((prev) => {
        const updated = [...prev];
        updated[index] = (messageFromServer ?? "").toLowerCase();
        return updated;
      });

      console.log(match.pesan);
      setRows((prevRows) => {
        const updated = [...prevRows];
        updated[index] = {
          ...updated[index],
          pesan: match.pesan ?? (messageFromServer ?? "").toLowerCase(),
        };
        return updated;
      });

      // if (!statusFromServer && messageFromServer) {
      //   alert(`Baris ${index + 1}: ${messageFromServer}`);
      // }
    } catch (err) {
      console.error("Failed to submit row:", err);
    }
    // }

    if (field === "kanban" && newValue !== "") {
      if (value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[index * 2 + 1]?.focus();
        }, 1);
      }
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
      }

      if (value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 1);
      }
    }
  };

  const handleInputKanban = async (index, field, value) => {
    const newValue = value;
    const updatedRows = [...rows];
    updatedRows[index][field] = newValue;
    setRows(updatedRows);

    const A = updatedRows[index].kanban.trim().toLowerCase().trim();
    // .slice(0, -4)
    // .split("|")[0];
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

    // const found = selectedData[0].split(",").findIndex((d) => {
    //   return A.includes(d?.toLowerCase().trim());
    // });
    const found = selectedData.findIndex((d) => {
      return A.includes(
        lastCharAfterSpace(normalizeText(d?.toLowerCase()), separator)
      );
    });

    if (found == -1) {
      console.log("dnfound");
      isValid = false;
    }

    if (found !== -1) {
      console.log("jumlah + 1");
      isValid = true;
      if (
        jumlahKanban[
          `${Data[found].dn_number},${Data[found][uniqueColumn[0]]}`
        ] > endDN[`${Data[found].dn_number},${Data[found][uniqueColumn[0]]}`]
      ) {
        console.log("jumlahkanban");
        isValid = false;
      }

      jumlahKanban[`${Data[found].dn_number},${Data[found][uniqueColumn[0]]}`] =
        (jumlahKanban[
          `${Data[found].dn_number},${Data[found][uniqueColumn[0]]}`
        ] || 0) + 1;
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
      const isRowComplete = rows[index].kanban.endsWith("\n");

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
              validPart: undefined,
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

      if (value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 2) * 2]?.focus();
        }, 1);
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
      if (value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 1);
      }
    } else {
      // setTimeout(() => {
      //   inputRefs.current[(index + 1) * 2]?.focus();
      // }, 3);
      if (value.endsWith("\n")) {
        setTimeout(() => {
          inputRefs.current[(index + 1) * 2]?.focus();
        }, 1);
      }
    }
  };

  const handleKirimDN = async () => {
    setIsSubmitting(true);
    try {
      console.log(cycleFilter);
      if (!cycleFilter) return;
      let currentShift = shiftWaktuMap?.[cycleFilter || 1]?.shift;
      if (!currentShift || currentShift === "-") {
        const proses = await checkProsesSekarang();
        currentShift = proses?.kode_shift;
      }
      const res = await api.post("/track/getCode", {
        customerId: id,
        tanggal: selectedDate,
        cycle: cycleFilter || 1,
        shift: currentShift,
      });

      if (res.data.shift && res.data?.verificationCode) {
        setqrCodes((prev) => {
          const newCode =
            res.data.verificationCode || res.data.data.verificationCode;
          return prev.includes(newCode) || newCode == null
            ? prev
            : [...prev, newCode];
        });
        setShiftWaktuMap((prev) => ({
          ...prev,
          [cycleFilter]: {
            waktuAktual: res.data.waktuAktual
              ? moment(res.data.waktuAktual).format("DD-MM-YYYY HH:mm")
              : " ",
            shift: res.data.shift || " ",
          },
        }));
      }
    } catch (logErr) {
      console.error("Gagal kirim log ke server:", logErr);
    } finally {
      setIsSubmitting(false);
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

  // <tr>
  //   <td>{cycle}</td>

  //   <td>         {/* {shift &&
  //   //         `${moment()
  //   //           .tz("Asia/Jakarta")
  //   //           .format("DD-MM-YYYY")} ${data.waktuAktual}`} */}

  //   </td>
  //   <td>{data.shift}</td>

  useEffect(() => {
    isFirst.current = true; // Reset saat Data berubah
  }, [Data]);
  useEffect(() => {
    if (!Data || Data.length === 0) return;

    const filteredDN = Array.from(
      new Set(
        Data.filter(
          (item) => !cycleFilter || item.delivery_cycle === cycleFilter
        ).map((d) => d.dn_number)
      )
    ).sort();

    setDNFilter(filteredDN);
  }, [Data, cycleFilter]);

  // </tr>
  return (
    <div className="p-4">
      <div className="mb-6 flex items-center justify-start pt-10 align-middle gap-3">
        <h1 className="font-bold text-2xl">SCAN QR</h1>
        {/* <button
          onClick={() => setIsOpen(!isOpen)}
          type="button"
          className={`${
            isOpen ? "text-transparent" : "text-gray-500"
          } cursor-pointer`}
        >
          <GiHamburgerMenu size={17} />
        </button> */}
      </div>
      {/* 
      <div className="flex gap-4 mb-6 flex-wrap"> */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-800">
            Tanggal
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleClickDate(date)}
            dateFormat="yyyy-MM-dd"
            className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            dayClassName={dayClassName}
            highlightDates={highlightDates}
            maxDate={new Date()}
            placeholderText="Pilih tanggal"
            showYearDropdown
            dropdownMode="select"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-800">DN</label>
          <div className="relative">
            <div
              className="flex justify-between items-center w-full p-3 text-sm border border-gray-300 rounded-md cursor-pointer hover:border-gray-400 bg-white"
              onClick={() => setIsDnOpen(!isDnOpen)}
            >
              <span className="truncate">
                {dnFilter.length > 0
                  ? `${dnFilter.length} selected`
                  : "Pilih DN..."}
              </span>
              <FaChevronDown
                className={`text-gray-800 transition-transform ${
                  isDnOpen ? "rotate-180" : ""
                }`}
              />
            </div>

            {isDnOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
                <div className="p-1 space-y-1">
                  {Array.from(
                    new Set(
                      Data.filter(
                        (item) =>
                          !cycleFilter || item.delivery_cycle === cycleFilter
                      ).map((d) => d.dn_number)
                    )
                  )
                    .sort()
                    .map((dn) => (
                      <label
                        key={dn}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={dnFilter.includes(dn)}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setDNFilter((prev) =>
                              checked
                                ? [...prev, dn]
                                : prev.filter((d) => d !== dn)
                            );
                          }}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 mr-2 focus:ring-blue-500"
                        />
                        <span className="text-sm text-gray-800">{dn}</span>
                      </label>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-xs font-medium text-gray-800">
            Cycle
          </label>
          <select
            value={cycleFilter}
            onChange={(e) => setCycleFilter(Number(e.target.value))}
            className="w-full p-3 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Semua</option>
            {Array.from(new Set(Data.map((d) => d.delivery_cycle)))
              .sort()
              .map((cycle) => (
                <option key={cycle} value={cycle}>
                  Cycle {cycle}
                </option>
              ))}
          </select>
        </div>
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
                  disabled={shiftWaktuMap?.[cycleFilter || 1]?.shift}
                  onInput={(e) =>
                    handleInput(index, "kanban", e.currentTarget.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // biar nggak submit form atau fokus next
                      const updatedValue = row.kanban + "\n";
                      handleInput(index, "kanban", updatedValue);
                    }
                  }}
                />
                <label className="text-xs text-white font-medium">
                  Label Supplier
                </label>
                <input
                  ref={(el) => (inputRefs.current[index * 2 + 1] = el)}
                  type="text"
                  className="w-full p-1 border rounded bg-white"
                  value={row.labelSupplier}
                  disabled={shiftWaktuMap?.[cycleFilter || 1]?.shift}
                  onInput={(e) =>
                    handleInput(index, "labelSupplier", e.currentTarget.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // biar nggak submit form atau fokus next
                      const updatedValue = row.labelSupplier + "\n";
                      handleInput(index, "labelSupplier", updatedValue);
                    }
                  }}
                />
                <div className="text-center items-center">
                  <p
                    className={`w-fit h-[30px] px-2 rounded-md md:text-lg lg:text-md xl:text-xl  font-bold text-white ${
                      validList[index] ? "bg-green-700" : "bg-red-800"
                    }`}
                  >
                    {validList[index] ? "OK " : `NG `}
                    {row.pesan ?? " "}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="min-w-[200px] space-y-4">
            <div className="border border-gray-300 p-4 rounded bg-white max-h-[600px] overflow-y-auto">
              <h2 className="text-lg font-semibold mb-2">Summary Table</h2>
              {/* <select
                className="border p-1 mb-2"
                value={cycleFilter}
                onChange={(e) => setCycleFilter(e.target.value)}
              >
                <option value="">All Cycles</option>
                {[...new Set(summaryTable.map((row) => row.cycle))].map(
                  (cycle, i) => (
                    <option key={i} value={cycle}>
                      {cycle}
                    </option>
                  )
                )}
              </select> */}
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
                    {/* <th className="border px-2 py-1">Cycle</th> */}
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
                      {/* <td className="border px-2 py-1">{row.cycle}</td> */}
                      <td
                        className={`border px-2 py-1 font-semibold ${
                          row.status === "Closed"
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
                    <th className="text-xs w-[150px]">Cycle</th>
                    <th className="text-xs w-[150px]">Waktu Selesai: </th>
                    <th className="text-xs">Shift</th>
                  </tr>
                </thead>

                <tbody>
                  {Object.keys(shiftWaktuMap).length > 0 ? (
                    Object.entries(shiftWaktuMap).map(([cycle, data]) => (
                      <tr key={cycle}>
                        <td>{cycle}</td>
                        <td>{` ${data.waktuAktual ?? "-"}`}</td>
                        <td>{data.shift ?? "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center text-gray-400 py-2"></td>
                      <td className="text-center text-gray-400 py-2"></td>
                      <td className="text-center text-gray-400 py-2"></td>
                    </tr>
                  )}
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
                  disabled={shiftWaktuMap?.[cycleFilter || 1]?.shift}
                  onInput={(e) =>
                    handleInputKanban(index, "kanban", e.currentTarget.value)
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // biar nggak submit form atau fokus next
                      const updatedValue = row.kanban + "\n";
                      handleInputKanban(index, "kanban", updatedValue);
                    }
                  }}
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
                  {Object.keys(shiftWaktuMap).length > 0 ? (
                    Object.entries(shiftWaktuMap).map(([cycle, data]) => (
                      <tr key={cycle}>
                        <td>{` ${data.waktuAktual ?? "-"}`}</td>
                        <td>{data.shift ?? "-"}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td className="text-center text-gray-400 py-2"></td>
                      <td className="text-center text-gray-400 py-2"></td>
                    </tr>
                  )}
                  {/* <td>
                      {shift &&
                        `${moment()
                          .tz("Asia/Jakarta")
                          .format("DD-MM-YYYY")} ${moment(waktuAktual).format(
                          "HH:mm"
                        )}`}
                    </td>
                    <td>{shift}</td> */}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {dataLoaded && (
        <button
          onClick={handleKirimDN}
          disabled={isSubmitting}
          className={`my-10 float-right px-6 py-2 rounded-lg font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
    ${
      isSubmitting
        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
        : "bg-[#105bdf] hover:bg-blue-700 text-white shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
    }
  `}
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Mengonfirmasi...
            </span>
          ) : (
            "Closed Parsial"
          )}
        </button>
      )}
    </div>
  );
}

// console.log("summary", summaryTable, validList);

// useEffect(() => {
//   console.log(typeof partListReal, "tipe part");
//   if (partListReal.length > 0) {
//     console.log(partListReal[1], partListReal[0]);
//   } else {
//     console.log("index real ga bisa");
//   }
// }, [partListReal]);

// const handleInput = async (index, field, value) => {
//   // console.log(index, field, value, "ini index");
//   const newValue = value.trim();
//   const updatedRows = [...rows];
//   updatedRows[index][field] = newValue;
//   setRows(updatedRows);

//   const A = updatedRows[index].kanban.trim().toLowerCase();
//   const B = updatedRows[index].labelSupplier
//     .toLowerCase()
//     .slice(0, -1)
//     .split("|")[0];
//   // .slice(0, -4)
//   let isValid = false;

//   if (A && B) {
//     // if (
//     //   A.includes(B) ||
//     //   B.includes(A) ||
//     //   A.split(/\s+/).some((word) => B.includes(word))
//     // ) {
//     //   isValid = true;
//     // }

//     // const found = selectedData.find(
//     //   (d) =>
//     //     A.includes(d?.toLowerCase()) ||
//     //     A.split(/\s+/).some((word) => B.includes(word))
//     // );
//     // if (selectedData[0])
//     // const found = selectedData[0].split(",").findIndex((d) => {
//     //   return A.includes(lastCharAfterSpace(d?.toLowerCase()));
//     // });
//     const foundIndex = selectedData.findIndex((d) => {
//       return A.includes(lastCharAfterSpace(d?.toLowerCase()));
//     });

//     // selectedData.map((d) => {
//     //   console.log(lastCharAfterSpace(d?.toLowerCase()), A, "cocok");
//     //   // return A.includes(lastCharAfterSpace(d?.toLowerCase()));
//     // });
//     // console.log(
//     //   selectedData[0],
//     //   "select data",
//     //   A,
//     //   selectedData.map((d) => lastCharAfterSpace(d?.toLowerCase()))
//     // );
//     if (!foundIndex) {
//       console.log("ga ketemu");
//       isValid = false;
//     }
//     // const dnFound = Data.find(
//     //   (d) =>
//     //     A.includes(d?.job_no?.toLowerCase()) ||
//     //     (A.split(/\s+/).some((word) =>
//     //       d?.job_no?.toLowerCase().includes(word)
//     //     ) &&
//     //       B === d.part_no?.toLowerCase())
//     // );

//     const dnFound = Data.find((d) => {
//       // console.log(uniqueColumn, "Ada job");
//       const jobLower = d?.[uniqueColumn]?.toLowerCase();
//       const partLower = d?.part_no
//         ? d?.part_no.toLowerCase()
//         : d?.material.toLowerCase();
//       const lastChar = lastCharAfterSpace(jobLower);

//       const isIncluded = A.includes(lastChar[0]);

//       const isSamePart = B === partLower || B.includes(jobLower);
//       return isIncluded && isSamePart;
//     });

//     // const partFound = Data.find((d) => {
//     //   const jobLower = d?.[uniqueColumn]?.toLowerCase();
//     //   const lastChar = lastCharAfterSpace(jobLower);
//     //   return A.includes(lastChar);
//     // });

//     // if (partFound) {
//     //   const partNo = partFound.part_no?.toLowerCase();
//     //   setValidPart((prev) => {
//     //     const updated = [...prev];
//     //     updated[Number(index)] = partNo;
//     //     console.log(index, "indek ada ga", updated[Number(index)]);
//     //     return updated;
//     //   });
//     // }
//     // console.log("DATA:", Data);
//     // console.log("UNIQUE COL:", uniqueColumn);

//     const partFound = Data.find((d) => {
//       const jobLower = d?.[uniqueColumn]?.toLowerCase();
//       const lastChar = lastCharAfterSpace(jobLower);
//       // console.log("JobLower:", jobLower, "LastChar:", lastChar);
//       return A.includes(lastChar);
//     });

//     if (partFound) {
//       // console.log(partFound, "part ditemukan");
//       const partNo = partFound.part_no
//         ? partFound.part_no.toLowerCase()
//         : partFound.material.toLowerCase();
//       // console.log(partNo, index);
//       // console.log("Part Found:", partNo, "Index:", index);
//       setValidPart((prev) => {
//         const updated = [...prev];
//         updated[Number(index)] = partNo;
//         return updated;
//       });
//     } else {
//       console.log("Tidak ditemukan part yang cocok");
//     }

//     if (dnFound) {
//       isValid = true;

//       if (
//         jumlahKanban[
//           `${Data[foundIndex].dn_number}_${Data[foundIndex][uniqueColumn]}`
//         ] >=
//         endDN[
//           `${Data[foundIndex].dn_number}_${Data[foundIndex][uniqueColumn]}`
//         ]
//       ) {
//         isValid = false;
//       }

//       jumlahKanban[
//         `${Data[foundIndex].dn_number}_${Data[foundIndex][uniqueColumn]}`
//       ] =
//         (jumlahKanban[
//           `${Data[foundIndex].dn_number}_${Data[foundIndex][uniqueColumn]}`
//         ] || 0) + 1;
//     } else {
//       isValid = false;
//       // setValidPart();
//     }
//   }

//   const updatedValidList = [...validList];
//   updatedValidList[index] = isValid;
//   setValidList(updatedValidList);

//   const changedRow = {
//     ...updatedRows[index],
//     status: isValid,
//   };

//   try {
//     const isRowComplete = rows[index].kanban && rows[index].labelSupplier;

//     // const dnFound = Data.find((d) => {
//     //   const jobLower = d?.job_no?.toLowerCase();
//     //   const lastChar = lastCharAfterSpace(jobLower);

//     //   return (
//     //     rows[index].kanban.includes(lastChar) &&
//     //     rows[index].labelSupplier === d?.part_no?.toLowerCase()
//     //   );
//     // });

//     const dnFound = Data.find((d) => {
//       const jobLower = d?.[uniqueColumn]?.toLowerCase();
//       const partLower = d?.part_no
//         ? d?.part_no.toLowerCase()
//         : d?.material.toLowerCase();
//       const lastChar = lastCharAfterSpace(jobLower);

//       const isIncluded = rows[index].kanban
//         .toLowerCase()
//         .includes(lastChar[0]);
//       const isSamePart =
//         rows[index].labelSupplier.toLowerCase().slice(0, -1).split("|")[0] ===
//         partLower;

//       return isIncluded && isSamePart;
//     });

//     const partFound = Data.find((d) => {
//       const jobLower = d?.[uniqueColumn]?.toLowerCase();
//       const lastChar = lastCharAfterSpace(jobLower);
//       // console.log("JobLower:", jobLower, "LastChar:", lastChar);
//       return A.includes(lastChar);
//     });

//     // if (partFound) {
//     //   console.log(partFound, "part ditemukan");
//     //   const partNo = partFound.part_no?.toLowerCase();
//     //   console.log(partNo, index);
//     //   console.log("Part Found:", partNo, "Index:", index);
//     //   setValidPart((prev) => {
//     //     const updated = [...prev];
//     //     updated[Number(index)] = partNo;
//     //     return updated;
//     // });
//     if (isRowComplete) {
//       console.log("isRowcomplete, index", index);
//       const res = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/inputQR`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             row: changedRow,
//             index,
//             id,
//             selectedDate,
//             dnFound,
//             validPart: String(
//               partFound?.part_no || partFound?.material
//             ).toUpperCase(),
//           }),
//         }
//       );

//       const result = await res.json();
//       console.log(
//         "Submitted row:",
//         changedRow,
//         "Result:",
//         result,
//         JSON.stringify({
//           row: changedRow,
//           index,
//           id,
//           selectedDate,
//           dnFound,
//           validPart: String(
//             partFound?.part_no || partFound?.material
//           ).toUpperCase(),
//         })
//       );
//     }
//   } catch (err) {
//     console.error("Failed to save input:", err);
//   }
//   if (field === "kanban" && newValue !== "") {
//     // setTimeout(() => {
//     //   inputRefs.current[index * 2 + 1]?.focus();
//     // }, 3);
//     if (value.endsWith("\n")) {
//       setTimeout(() => {
//         inputRefs.current[index * 2 + 1]?.focus();
//       }, 1);
//     }
//   }

//   if (field === "labelSupplier" && newValue !== "") {
//     const last10Filled = updatedRows
//       .slice(-10)
//       .every((r) => r.kanban && r.labelSupplier);
//     // console.log("last10Filled:", last10Filled);
//     // console.log("last 10 rows:", updatedRows.slice(-10));

//     if (last10Filled) {
//       const newRows = Array.from({ length: 10 }, () => ({
//         kanban: "",
//         labelSupplier: "",
//       }));
//       setRows((prev) => [...prev, ...newRows]);

//       if (value.endsWith("\n")) {
//         //value.length >= 8 ||
//         setTimeout(() => {
//           inputRefs.current[(index + 1) * 2]?.focus();
//         }, 1);
//       }
//     } else {
//       if (value.endsWith("\n")) {
//         setTimeout(() => {
//           inputRefs.current[(index + 1) * 2]?.focus();
//         }, 1);
//       }
//     }
//   }
// };
