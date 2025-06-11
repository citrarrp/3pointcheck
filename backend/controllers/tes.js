import moment from "moment-timezone";
import Tes from "../models/TesModel"; // ganti sesuai path sebenarnya
import trackingDelv from "../models/TrackingDelvModel"; // ganti sesuai path sebenarnya

const defaultSteps = {
  "Received Order": "RECEIVING E-KBN",
  "Waiting Post": "WAITING POST",
  "Start Preparation (Pulling)": "PULLING (60')",
  Inspection: "PULLING (60')",
  "Finish Preparation": "WRAPPING",
  "Ready to Shipping Area": "WRAPPING",
  "Arrived Truck": "LOADING TRUCK (30')",
  "Departure Truck": "TRUCK OUT",
};

export const createData = async (req, res) => {
  const {
    nama,
    kolomSelected,
    selectedData,
    sourceValueLabel,
    separator,
    selectedColumns,
    selectedCustomer,
    uniquePartName,
    tracking,
  } = req.body;

  const now = moment().tz("Asia/Jakarta").toISOString();

  if (!nama) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  const updatedKolomSelected = {
    data: kolomSelected,
    createdAt: now,
    selectedData,
    sequence: uniquePartName,
  };

  const payload = {
    nama,
    kolomSelected: updatedKolomSelected,
    sourceValueLabel,
    separator,
    selectedColumns,
    selectedCustomer,
  };

  try {
    const newDataCustomer = new Tes(payload);
    const savedData = await newDataCustomer.save();

    const result = [];
    const processedDnNumbers = new Set();

    for (const dataItem of updatedKolomSelected.data) {
      const dnNumber =
        dataItem.dn_number ||
        dataItem.order_delivery ||
        dataItem.delivery_order;
      if (!dnNumber || processedDnNumbers.has(dnNumber)) continue;

      processedDnNumbers.add(dnNumber);

      for (const item of tracking) {
        if ((dataItem.cycle || 1) === (item.cycle || 1)) {
          const stepKey = Object.keys(defaultSteps).find(
            (key) => defaultSteps[key] === item.processName
          );

          result.push({
            cycle: dataItem.cycle || 1,
            dnNumber,
            waktu: item.waktu,
            durasi: item.waktu,
            step: stepKey,
            waktuDelv: dataItem.delivery_date,
          });
        }
      }
    }

    const trackingUpdates = [];

    for (const data of result) {
      const { cycle, dnNumber, waktu, durasi, step, waktuDelv } = data;
      let waktuAktual = null;
      let delay = null;
      let status = "-";
      let waktuStandar = waktu;

      if (step === "Finish Preparation") {
        waktuStandar += durasi;
      }

      if (step === "Received Order") {
        const waktuAktualUTC = moment.utc(waktuDelv);
        const waktuStandarUTC = moment.utc(waktu);
        const waktuStandarCorrected = waktuStandarUTC.set({
          year: waktuAktualUTC.year(),
          month: waktuAktualUTC.month(),
          date: moment.utc().date(),
        });

        const waktuAktualJakarta = waktuAktualUTC.tz("Asia/Jakarta");
        const waktuStandarJakarta = waktuStandarCorrected.tz("Asia/Jakarta");

        const diffMinutes = waktuAktualJakarta.diff(
          waktuStandarJakarta,
          "minutes"
        );
        waktuAktual = waktuAktualJakarta.format("HH:mm");

        if (diffMinutes > 0) {
          delay = `-${diffMinutes} menit`;
          status = "Delay";
        } else if (diffMinutes < 0) {
          delay = `+${Math.abs(diffMinutes)} menit`;
          status = "Advanced";
        } else {
          delay = `0 menit`;
          status = "Ontime";
        }
      }

      const newTracking = new trackingDelv({
        customerId: savedData._id,
        cycleNumber: cycle,
        dnNumber,
        tanggal: waktuDelv,
        nama: step,
        waktuStandar,
        waktuAktual: waktuAktual ? stringToDate(waktuAktual) : null,
        delay,
        status,
        ket: "-",
        persentase: 0,
        createdAt: moment().tz("Asia/Jakarta"),
      });

      trackingUpdates.push(newTracking.save());
    }

    await Promise.all(trackingUpdates);
    console.log("Semua tracking berhasil disimpan.");
    res.status(201).json({ success: true, data: newDataCustomer });
  } catch (error) {
    console.error("Error in Create Customer:", error.message);
    res.status(500).json({
      success: false,
      message: "Terjadi kesalahan saat menyimpan data.",
      detail: error.message,
    });
  }
};






