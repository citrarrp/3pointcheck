import { ObjectId } from "bson";
import tes from "../models/tes.js";
import trackingDelv from "../models/tracking.js";
import crypto from "crypto";
import moment from "moment-timezone";

export const updateFinishPrepareDatabyDNCustCycle = async (req, res) => {
  try {
    const { customerId, tanggal, dnNumber, persentase, status, shift } =
      req.body;

    // console.log(
    //   customerId,
    //   tanggal,
    //   dnNumber,
    //   persentase,
    //   status,
    //   shift,
    //   "request"
    // );
    if (!customerId || !tanggal || !dnNumber) {
      return res.status(400).json({
        message: "customerId, tanggal, dan dnNumber harus diisi",
      });
    }

    const startOfDay = moment
      .tz(tanggal, "Asia/Jakarta")
      .startOf("day")
      .toDate();
    const endOfDay = moment.tz(tanggal, "Asia/Jakarta").endOf("day").toDate();

    const existingData = await trackingDelv.findOne({
      customerId,
      tanggal: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      dnNumber,
      nama: "Finish Preparation",
    });

  
    if (!existingData) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
        suggestion: "Buat data terlebih dahulu sebelum melakukan update",
      });
    }

    // Hitung waktu aktual dan delay
    // console.log(existingData, typeof existingData.waktuStandar, "wakti");

    const waktuAktual = moment().tz("Asia/Jakarta");
    const waktuStandar = moment(new Date(existingData.waktuStandar)).tz(
      "Asia/Jakarta"
    );
    // const waktuStandar = moment(new Date(existingData.waktuStandar))
    //   .tz("Asia/Jakarta")
    //   .format("HH:mm");
    // const waktuAktual = moment().tz("Asia/Jakarta").format("HH:mm");
    // const diffMinutes = moment(waktuAktual, "HH:mm").diff(
    //   moment(waktuStandar, "HH:mm"),
    //   "minutes"
    // );

    const diffMinutes = waktuAktual.diff(waktuStandar, "minutes");
    // console.log(waktuAktual, waktuStandar, diffMinutes);

    let statusWaktu = existingData.status;
    let verificationCode = null;

    if (status === "done" || status === "first") {
      if (diffMinutes > 15) statusWaktu = "Delay";
      else if (diffMinutes < -15) statusWaktu = "Advanced";
      else statusWaktu = "Ontime";

      // Generate verification code
      const payload = {
        customerId,
        dnNumber,
        tanggal: moment.tz(tanggal, "Asia/Jakarta").toDate(),
        timestamp: new Date().toISOString(),
      };

      const payloadString = JSON.stringify(payload);
      const serverSecret = process.env.QR_SECRET;

      const randomString = crypto
        .randomBytes(16)
        .toString("base64")
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=/g, "")
        .slice(0, 16); // t

      const expectedHash = crypto
        .createHmac("sha512", serverSecret)
        .update(payloadString)
        .digest("hex");

      verificationCode = `${expectedHash}:${randomString}`;
    }

    const updateData = {
      persentase,
      status: statusWaktu,
      waktuAktual: waktuAktual.format("HH:mm"),
      delay: diffMinutes
        ? diffMinutes < 0
          ? `+${-1 * diffMinutes} menit`
          : `-${diffMinutes} menit`
        : null,
      updatedAt: moment().tz("Asia/Jakarta").toDate(),
    };

    const updatedData = await trackingDelv.findOneAndUpdate(
      {
        customerId,
        tanggal: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        dnNumber,
        nama:
          status === "first"
            ? { $in: ["Start Preparation", "Start Preparation (Pulling)"] }
            : status === "done"
            ? "Finish Preparation"
            : { $in: ["Start Preparation", "Start Preparation (Pulling)"] },
        $or: [
          { verificationCode: null },
          { shift: null },
          { verificationCode: { $exists: false } },
          { shift: { $exists: false } },
          { waktuAktual: { $exists: false } },
          { waktuAktual: null },
        ],
      },
      { $set: updateData },
      { new: true }
    );

    if (status === "first") {
      await trackingDelv.updateMany(
        {
          customerId,
          tanggal: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          nama: "Finish Preparation",
          dnNumber,
          $or: [
            { verificationCode: null },
            { shift: null },
            { verificationCode: { $exists: false } },
            { shift: { $exists: false } },
            { waktuAktual: { $exists: false } },
            { waktuAktual: null },
          ],
        },
        { $set: { persentase } }
      );
    }

    if (verificationCode && status == "done") {
      await trackingDelv.updateMany(
        {
          customerId,
          tanggal: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          nama: "Finish Preparation",
          $or: [
            { verificationCode: null },
            { shift: null },
            { verificationCode: { $exists: false } },
            { shift: { $exists: false } },
            { waktuAktual: { $exists: false } },
            { waktuAktual: null },
          ],
        },
        {
          $set: { verificationCode: verificationCode, shift: shift },
        }
      );
    }

    const response = {
      message: "Data berhasil diupdate",
      data: dnNumber,
    };

    if (status == "done") {
      const existing = await trackingDelv.findOne({
        customerId,
        tanggal: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        nama: "Finish Preparation",
        verificationCode: { $ne: null },
        shift: { $ne: null },
        waktuAktual: { $ne: null },
      });
      if (existing) {
        response.waktuAktual = existing.waktuAktual;
        response.shift = existing.shift;
        response.verificationCode = existing.verificationCode;
      } else {
        response.verificationCode = null;
      }
    }

    res.status(200).json(response);
  } catch (error) {
    console.error("Error updating tracking data:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const postFinishPreparation = async (req, res) => {
  try {
    const { customerId, tanggal, code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "QR tidak memiliki isi",
      });
    }

    const startOfDay = moment
      .tz(tanggal, "Asia/Jakarta")
      .startOf("day")
      .toDate();
    const endOfDay = moment.tz(tanggal, "Asia/Jakarta").endOf("day").toDate();

    const existingData = await trackingDelv.find({
      customerId,
      tanggal: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      nama: "Ready to Shipping Area",
    });

    if (!existingData) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
      });
    }

    await trackingDelv.updateMany(
      {
        customerId,
        tanggal: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        nama: "Ready to Shipping Area",
      },
      { $set: { verificationCode: code } },
      { new: true }
    );
    res.status(200).json({ messsage: "Data berhasil diperbarui!" });
  } catch (error) {
    console.error("Error updating tracking data:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const postReadyToShipping = async (req, res) => {
  const { code } = req.body;
  try {
    const existingData = await trackingDelv
      .find({
        nama: "Ready to Shipping Area",
        verificationCode: code,
      })
      .populate("customerId", "nama")
      .lean();

    if (!existingData.length) {
      return res.status(404).json({
        success: false,
        message: "Data tidak ditemukan!",
      });
    }

    const now = moment().tz("Asia/Jakarta");
    const updatePromises = existingData.map(async (item) => {
      const waktuStandar = moment(new Date(item.waktuStandar))
        .tz("Asia/Jakarta")
        .format("HH:mm");
      const waktuAktual = now.format("HH:mm");
      const diffMinutes = moment(waktuAktual, "HH:mm").diff(
        moment(waktuStandar, "HH:mm"),
        "minutes"
      );

      let statusWaktu;
      let delay;

      if (diffMinutes > 5) statusWaktu = "Delay";
      else if (diffMinutes < -5) statusWaktu = "Advanced";
      else statusWaktu = "Ontime";

      if (diffMinutes < -5) delay = `+${-1 * diffMinutes} menit`;
      else if (diffMinutes > 5) delay = `-${diffMinutes} menit`;
      else delay = `0 menit`;

      // Update per dokumen berdasarkan _id
      return trackingDelv.updateOne(
        {
          _id: item._id,
          $or: [
            { status: "-" },
            { delay: null },
            { presentase: 0 },
            { waktuAktual: null },
          ],
        },
        {
          $set: {
            status: statusWaktu,
            persentase: 100,
            waktuAktual,
            delay,
            updatedAt: now.toDate(),
          },
        }
      );
    });

    // Tunggu semua update selesai
    const updateReady = await Promise.all(updatePromises);
    const totalModified = updateReady.reduce(
      (sum, r) => sum + r.modifiedCount,
      0
    );

    if (totalModified == 0) {
      return res.status(410).json({
        success: "false",
        message: "QR telah di-scan!",
      });
    }

    const dnAll = existingData.map((item) => `${item.dnNumber}`).join(", ");

    return res.status(200).json({
      success: true,
      message: "Berhasil Scan!",
      data: `${dnAll} dari customer ${existingData[0].customerId.nama} Cycle ${existingData[0].cycleNumber} Ready To Shipping`,
    });
  } catch (error) {
    console.log("error in fetching Data:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDatabyIdCycle = async (req, res) => {
  const { id, cycleNumber } = req.params;
  const { tanggal } = req.query;

  const targetDate = new Date(tanggal);
  const nextDay = new Date(targetDate);
  nextDay.setDate(targetDate.getDate() + 1);

  // console.log(tanggal, new Date());
  try {
    const trackingCustDN = await trackingDelv.find({
      customerId: id,
      cycleNumber: parseInt(cycleNumber),
      tanggal: { $gte: targetDate, $lt: nextDay },
    });

    if (!trackingCustDN || trackingCustDN.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    return res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: trackingCustDN,
    });
  } catch (error) {
    console.log("error in fetching Data:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

let delay = null;
let status = "-";

function getDiffrence(waktu, waktu_standar) {
  const waktuAktualMoment = moment.tz(waktu, "Asia/Jakarta");
  const waktuStandarMoment = moment.tz(
    `${moment(waktu).format("YYYY-MM-DD")} ${waktu_standar}`,
    "Asia/Jakarta"
  );

  const diffMinutes = waktuAktualMoment.diff(waktuStandarMoment, "minutes");
  waktuAktual = waktuAktualMoment.format("HH:mm");
  if (diffMinutes > 0) {
    delay = `-${diffMinutes} menit`;
    status = "Delay";
  } else if (diffMinutes < 0) {
    delay = `+${diffMinutes} menit`;
    status = "Advanced";
  } else {
    delay = `0 menit`;
    status = "Ontime";
  }
}

export const getCycleDatabyId = async (req, res) => {
  const { id } = req.params;

  try {
    const cycles = await trackingDelv.aggregate([
      { $match: { customerId: new ObjectId(id) } },
      { $group: { _id: "$cycleNumber" } },
      { $project: { _id: 0, cycleNumber: "$_id" } },
    ]);

    if (!cycles || cycles.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    return res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: cycles.map((item) => item.cycleNumber),
    });
  } catch (error) {
    console.log("error in fetching Data Cycle:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

// export const updateDataTrackingProcess = async (req, res) => {
//   const {nama, dnNumber, cycleNumber, customerId, waktuAktual} = req.body

// const updated = await trackingDelv.updateOne(
//   {
//     nama,
//     dnNumber,
//     cycleNumber,
//     customerId,
//   },
//   {
//     $set: {
//       waktuAktual: waktuAktual,
//       delay: getDiffrence(waktuAktual)
//       status: "Ontime",
//       ket: "Sesuai jadwal",
//     },
//   }
// );
// }

export const getDatabyIdCycleDN = async (req, res) => {
  const { id, cycleNumber, dn_number } = req.params;
  // console.log(req.user, "RES", id);

  try {
    const trackingCustDN = await trackingDelv.find({
      customerId: id,
      cycleNumber: parseInt(cycleNumber),
      dnNumber: dn_number,
    });

    if (!trackingCustDN || trackingCustDN.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    return res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: trackingCustDN,
    });
  } catch (error) {
    console.log("error in fetching Data:", error.message);
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDataTracking = async (req, res) => {
  const { tanggal } = req.query;

  let filter = {};
  if (tanggal) {
    const targetDate = new Date(tanggal);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);
    filter.tanggal = { $gte: targetDate, $lt: nextDay };
  }
  try {
    const trackingAll = await trackingDelv
      .find(
        // customerId: id,
        // cycleNumber: parseInt(cycleNumber),
        filter
      )
      .populate("customerId", "nama");

    if (!trackingAll || trackingAll.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: trackingAll,
    });
  } catch (error) {
    console.log("error in fetching Customers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
