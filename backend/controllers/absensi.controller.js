import Absensi from "../models/absensi.js";
import crypto from "crypto";
import trucks from "../models/truck.js";
import Tes from "../models/tes.js";
import moment from "moment-timezone";
import trackingDelv from "../models/tracking.js";
// let absensiData = [];

// const QR_SECRET = process.env.QR_SECRET;

function generateSignature(payload, secret) {
  const hmac = CryptoJS.HmacSHA512(JSON.stringify(payload), secret);
  return hmac.toString(CryptoJS.enc.Hex);
  // CryptoJS.lib.WordArray.random(16).toString(),
}

export const getAbsensiQR = async (req, res) => {
  const { truckName, scanType } = req.query;

  if (!truckName || !scanType) {
    return res.status(400).json({ message: "Missing parameters" });
  }

  const truck = Absensi.find((t) => t.truckName === truckName);
  if (!truck) {
    return res.status(404).json({ message: "Truck not found" });
  }
  const payload = {
    truckName: truck.truckName,
    route: truck.route,
    destination: truck.destination,
    type: truck.typeTruck,
    scanType: scanType.charAt(0).toUpperCase() + scanType.slice(1), // In / Out
    timestamp: new Date().toISOString(),
  };

  const signature = generateSignature(payload, QR_SECRET);
  return res.status(200).json({ success: true, data: payload, signature });
};

export const getAbsensibyDate = async (req, res) => {
  const { tanggal } = req.query;

  let filter = {};
  if (tanggal) {
    const targetDate = new Date(tanggal);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    filter.createdAt = { $gte: targetDate, $lt: nextDay };
  }

  try {
    const absensiall = await Absensi.find(
      // customerId: id,
      // cycleNumber: parseInt(cycleNumber),
      filter
    );

    const absensiCustomer = await Absensi.find({ _id: Absensi.cust }).populate(
      "tes",
      "nama"
    );

    console.log(absensiall, absensiCustomer);
    if (!absensiall || absensiall.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: absensiall,
    });
  } catch (error) {
    console.log("error in fetching Customers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const validateQR = async (req, res) => {
  const {
    h,
    n,
    id,
    truckName,
    route,
    destination,
    type,
    scanType,
    timestamp,
    // createdAt,
    // status,
  } = req.body;

  console.log(timestamp, "time");

  if (!truckName || !id || !scanType || !timestamp || !h) {
    return res.status(400).json({ message: "Data tidak valid" });
  }
  if (!n) {
    return res.status(400).json({ message: "QR Tidak Valid" });
  }

  const existingNoncetruck = await Absensi.findOne({ nonce: n });
  if (existingNoncetruck) {
    return res.status(409).json({ message: "Kode Unik sudah dipakai!" });
  }

  const serverSecret = process.env.QR_SECRET;
  console.log(serverSecret);
  const payload = {
    id,
    truckName,
    route,
    destination,
    type,
    scanType,
    timestamp,
  };

  const payloadString = JSON.stringify(payload, Object.keys(payload).sort());

  console.log(payloadString, "payload");
  const expectedHash = crypto
    .createHmac("sha512", serverSecret)
    .update(payloadString)
    .digest("hex");

  console.log("BACKEND SECRET:", JSON.stringify(process.env.QR_SECRET));
  console.log(expectedHash, h);
  if (expectedHash !== h) {
    return res
      .status(400)
      .json({ success: false, message: "Signature tidak valid" });
  }

  const now = Math.floor(Date.now() / 1000);
  const waktunow = new Date();
  const waktuKemarin = new Date(Date.now() - 24 * 60 * 60 * 1000);

  if (Math.abs(now - timestamp) > 120) {
    return res
      .status(400)
      .json({ success: false, message: "QR code kadaluarsa" });
  }

  const truckCustomerCycle = await trucks.findOne({
    truckName,
    typeTruck: type,
    route,
    destination,
  });

  const tesDoc = await Tes.findOne({
    _id: truckCustomerCycle.customerId,
    "cycle.numberCycle": truckCustomerCycle.cycleNumber,
  });

  const startOfDay = moment
    .tz(waktuKemarin, "Asia/Jakarta")
    .startOf("day")
    .toDate();
  const endOfDay = moment
    .tz(waktuKemarin, "Asia/Jakarta")
    .endOf("day")
    .toDate();

  const existingTracking = await trackingDelv.find({
    customerId: truckCustomerCycle.customerId,
    cycleNumber: truckCustomerCycle.cycleNumber,
    nama:
      String(scanType).toLowerCase() === "in"
        ? "Arrived Truck"
        : "Departure Truck",
    tanggal: {
      $gte: startOfDay,
      $lt: endOfDay,
    },
  });

  if (!existingTracking) {
    return res.status(400).json({ message: "Tidak ada delivery hari ini!" });
  }

  const cycle = tesDoc?.cycle.find(
    (c) => c.numberCycle === truckCustomerCycle.cycleNumber
  )?.stepCycle;

  console.log(cycle, tesDoc, tesDoc.cycle);
  const waktuStandarIn = cycle.find((c) => c.nama == "Arrived Truck");
  const waktuStandarOut = cycle.find((c) => c.nama == "Departure Truck");
  console.log(
    waktuStandarIn,
    "in",
    waktuStandarOut,
    "out",
    tesDoc,
    waktuStandarIn.waktu_standar,
    waktuStandarOut.waktu_standar
  );

  let status;
  let delay = "";
  const timeDiff =
    new Date(
      String(scanType).toLowerCase() === "in"
        ? moment.utc(waktuStandarIn.waktu_standar)
        : moment.utc(waktuStandarOut.waktu_standar)
    ) /
      1000 -
    new Date(waktunow).getTime() / 1000;

  const waktuStandar = moment(
    new Date(
      String(scanType).toLowerCase() === "in"
        ? moment.utc(waktuStandarIn.waktu_standar)
        : moment.utc(waktuStandarOut.waktu_standar)
    )
  ).format("HH:mm");

  const waktuAktual = moment(waktunow).format("HH:mm");

  const diffMinutes = moment(waktuAktual, "HH:mm").diff(
    moment(waktuStandar, "HH:mm"),
    "minutes"
  );

  if (diffMinutes > 5) {
    delay = `-${diffMinutes} menit`;
    status = "Delay";
  } else if (diffMinutes < 0) {
    delay = `+${diffMinutes * -1} menit`;
    status = "Advanced";
  } else {
    delay = `0 menit`;
    status = "Ontime";
  }

  console.log(timeDiff, diffMinutes);

  console.log(truckCustomerCycle);
  const newAbsensi = new Absensi({
    truckName,
    route,
    destination,
    typeTruck: type,
    scanType,
    timestamp,
    createdAt: waktunow,
    status,
    waktuStandar:
      String(scanType).toLowerCase() === "in"
        ? moment.utc(waktuStandarIn.waktu_standar)
        : moment.utc(waktuStandarOut.waktu_standar),
    nonce: n,
    customerId: truckCustomerCycle.customerId,
    cycleNumber: truckCustomerCycle.cycleNumber,
  });

  try {
    await newAbsensi.save();
    await trackingDelv.updateMany(
      {
        customerId: truckCustomerCycle.customerId,
        cycleNumber: truckCustomerCycle.cycleNumber,
        nama:
          String(scanType).toLowerCase() === "in"
            ? "Arrived Truck"
            : "Departure Truck",
        tanggal: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
      },
      { $set: { status, waktuAktual: waktunow, delay, persentase: 100 } }
    );
    return res.status(200).json({
      success: true,
      message: "Anda berhasil melakukan absensi",
      data: newAbsensi,
    });
  } catch (error) {
    console.error("Error in Create Customer:", error.message);
    return res
      .status(500)
      .json({ success: false, message: "Gagal menyimpan data" });
  }
};

export const getTrucks = async (req, res) => {
  try {
    const truck = await trucks.find({});
    res.status(200).json({ success: true, data: truck });
  } catch (error) {
    console.log("error in fetching TRUCKS:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// app.post("/absen", (req, res) => {
//   const { name, type, time_in, time_out } = req.body;
//   if (!name || !type || !time_in || !time_out) {
//     return res.status(400).json({
//       status: "error",
//       message: "Data absensi tidak lengkap",
//     });
//   }
//   const absensi = { name, type, time_in, time_out };
//   absensiData.push(absensi);
//   res.status(200).json({
//     status: "success",
//     message: "Absensi berhasil disimpan",
//     data: absensi,
//   });
// });

// app.post("/scan-in", (req, res) => {
//   const { name, type, time_in } = req.body;
//   if (!name || !type || !time_in) {
//     return res.status(400).json({
//       status: "error",
//       message: "Data scan in tidak lengkap",
//     });
//   }
//   const absensi = { name, type, time_in, time_out: null };
//   absensiData.push(absensi);
//   res.status(200).json({
//     status: "success",
//     message: "Waktu masuk berhasil dicatat",
//     data: absensi,
//   });
// });

// app.post("/scan-out", (req, res) => {
//   const { name, type, time_out } = req.body;
//   if (!name || !type || !time_out) {
//     return res.status(400).json({
//       status: "error",
//       message: "Data scan out tidak lengkap",
//     });
//   }
//   const absensi = absensiData.find(
//     (item) => item.name === name && !item.time_out
//   );
//   if (absensi) {
//     absensi.time_out = time_out;
//     res.status(200).json({
//       status: "success",
//       message: "Waktu keluar berhasil dicatat",
//       data: absensi,
//     });
//   } else {
//     res.status(404).json({
//       status: "error",
//       message: "Absensi tidak ditemukan",
//     });
//   }
// });

// app.get("/absensi/today", (req, res) => {
//   const today = new Date().toLocaleDateString();
//   const todayAbsensi = absensiData.filter(
//     (item) => new Date(item.time_in).toLocaleDateString() === today
//   );
//   res.status(200).json({
//     status: "success",
//     data: todayAbsensi,
//   });
// });

// export const createAbsensi = async (req, res) => {
//   const { label, value } = req.body;

//   try {
//     const newFields = new labelField({ label, value });
//     await newFields.save();

//     res.status(201).json({ success: true, data: newFields });
//   } catch (error) {
//     console.error("Error saving inputQR:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };

// export const createInputQR = async (req, res) => {
//   const { index, row } = req.body;

//   if (typeof row?.status === "undefined") {
//     return res
//       .status(400)
//       .json({ success: false, message: "Please provide all fields" });
//   }

//   try {
//     const newInputQR = new scanQR(row);
//     await newInputQR.save();

//     res.status(201).json({ success: true, data: newInputQR });
//   } catch (error) {
//     console.error("Error saving inputQR:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };
