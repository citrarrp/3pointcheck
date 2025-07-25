import { ObjectId } from "bson";
import tes from "../models/tes.js";
import trackingDelv from "../models/tracking.js";
import crypto from "crypto";
import moment from "moment-timezone";

export const updatePrepareDatabyDNCustCycle = async (req, res) => {
  try {
    const {
      customerId,
      tanggal,
      dnNumber,
      persentase,
      status,
      shift,
      sudahAll,
      qty,
    } = req.body;

    console.log(
      customerId,
      tanggal,
      dnNumber,
      persentase,
      status,
      shift,
      qty,
      "jumlah",
      "request"
    );
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
      nama: "Inspection",
    });

    if (!existingData) {
      return res.status(404).json({
        message: "Data tidak ditemukan",
        suggestion: "Buat data terlebih dahulu sebelum melakukan update",
      });
    }

    const lastWord = (str) => {
      if (!str) return "";
      const parts = str.trim().split(/\s+/); // split by 1+ spasi
      return parts[parts.length - 1]; // ambil terakhir
    };

    let verificationCode = null;

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

    if (status === "done" || status === "first") {
      if (diffMinutes > 15) statusWaktu = "Delay";
      else if (diffMinutes < -15) statusWaktu = "Advanced";
      else statusWaktu = "On Time";

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

    // const verificationCode = status === "done" ? dnNumber : null;

    const updateData = {
      persentase,
      status: statusWaktu,
      waktuAktual: waktuAktual,
      delay: diffMinutes
        ? diffMinutes < 0
          ? `+${-1 * diffMinutes} menit`
          : `-${diffMinutes} menit`
        : null,
      updatedAt: moment().tz("Asia/Jakarta").toDate(),
      qty,
    };

    await trackingDelv.findOneAndUpdate(
      {
        customerId,
        tanggal: {
          $gte: startOfDay,
          $lt: endOfDay,
        },
        dnNumber,
        nama:
          status === "done"
            ? "Inspection"
            : { $in: ["Start Preparation", "Start Preparation (Pulling)"] },
        $or: [
          { verificationCode: null },
          { verificationCode: { $exists: false } },
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
          nama: "Inspection",
          dnNumber,
          $or: [
            { verificationCode: null },
            { verificationCode: { $exists: false } },
            { waktuAktual: { $exists: false } },
            { waktuAktual: null },
          ],
        },
        { $set: { persentase } }
      );
    }

    if (status === "-") {
      await trackingDelv.updateMany(
        {
          customerId,
          tanggal: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          nama: {
            $in: [
              "Finish Preparation",
              "Start Preparation",
              "Start Preparation (Pulling)",
            ],
          },
          dnNumber,
        },
        { $set: { qty } }
      );
    }

    if (status == "done" && sudahAll) {
      await trackingDelv.findOneAndUpdate(
        {
          customerId,
          tanggal: {
            $gte: startOfDay,
            $lt: endOfDay,
          },
          dnNumber,
          nama: "Inspection",
          $or: [
            { verificationCode: null },
            { verificationCode: { $exists: false } },
            { waktuAktual: { $exists: false } },
            { waktuAktual: null },
          ],
        },
        {
          $set: {
            verificationCode: verificationCode,
            shift,
            persentase: Math.min(persentase || 0, 100),
          },
        }
      );
      console.log("berhasil");
    }

    const response = {
      message: "Data berhasil diupdate",
      data: dnNumber,
    };

    // if (status == "done") {
    const existing = await trackingDelv.findOne({
      customerId,
      tanggal: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      dnNumber,
      nama: "Inspection",
      verificationCode: { $ne: null },
      shift: { $ne: null },
      waktuAktual: { $ne: null },
    });

    if (existing) {
      console.log("input deh");
      response.waktuAktual = existing.waktuAktual;
      response.shift = existing.shift;
      response.verificationCode = existing.verificationCode;
    } else {
      // console.log("Verification code", verificationCode, dnNumber);
      response.verificationCode = null;
      console.log("dn", dnNumber);
    }
    // }
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error updating tracking data:", error);
    res.status(500).json({
      message: "Terjadi kesalahan server",
      error: error.message,
    });
  }
};

export const postInspection = async (req, res) => {
  try {
    const { customerId, tanggal, codeOD, dnNumber } = req.body;

    if (!codeOD) {
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
      dnNumber,
      nama: "Inspection",
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
        dnNumber,
        nama: "Finish Preparation",
      },
      { $set: { verificationCode: codeOD } },
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

export const postFinishPreparation = async (req, res) => {
  const { code } = req.body;
  try {
    const existingData = await trackingDelv
      .find({
        nama: "Finish Preparation",
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
      else statusWaktu = "On Time";

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
            waktuAktual: now,
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

  // const targetDate = new Date(tanggal);
  // const nextDay = new Date(targetDate);
  // nextDay.setDate(targetDate.getDate() + 1);
  const targetDate = moment.tz(tanggal, "Asia/Jakarta").startOf("day");
  const nextDay = moment(targetDate).add(1, "day");

  console.log(tanggal, targetDate, nextDay, cycleNumber);
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
    status = "On Time";
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
//       status: "On Time",
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
    // const targetDate = moment.utc(tanggal, "Asia/Jakarta");
    // const nextDay = moment.utc(targetDate, "Asia/Jakarta");
    console.log(tanggal, targetDate, nextDay);
    // nextDay.setDate(targetDate.getDate() + 1);
    // filter.tanggal = { $gte: targetDate, $lt: nextDay };

    const targetDate = moment.tz(tanggal, "Asia/Jakarta").startOf("day");
    const nextDay = moment(targetDate).add(1, "day");

    filter.tanggal = {
      $gte: targetDate.toDate(), // diubah ke UTC saat disimpan
      $lt: nextDay.toDate(),
    };
  }
  try {
    const trackingAll = await trackingDelv
      .find(
        // customerId: id,
        // cycleNumber: parseInt(cycleNumber),
        filter
      )
      .populate("customerId", "nama")
      .lean();

    if (!trackingAll || trackingAll.length === 0) {
      return res.status(404).json({
        success: false,
        message: `Data tidak ditemukan ${tanggal}`,
      });
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

export const updateKeterangan = async (req, res) => {
  try {
    const { id } = req.params;
    const { nama, ket } = req.body;

    if (!id || !nama || !ket) {
      return res.status(400).json({ message: "id, nama, dan ket wajib diisi" });
    }

    const updated = await trackingDelv.findOneAndUpdate(
      { _id: id, nama }, // cari berdasarkan id dan nama
      { ket }, // update hanya keterangan
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    return res
      .status(200)
      .json({ message: "Berhasil update keterangan", data: updated });
  } catch (error) {
    console.error("Gagal update keterangan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const postChecking = async (req, res) => {
  try {
    const { proses, dn, waktuAktual, id } = req.body;

    if (!proses || !dn || !waktuAktual) {
      return res.status(400).json({ message: "Data tidak lengkap" });
    }

    let existing = await trackingDelv.findOne({
      _id: id,
      nama: proses,
      dnNumber: dn,
    });

    if (existing && existing.waktuAktual) {
      return res.status(200).json({
        message: "Sudah tercatat, tidak diubah lagi",
        data: existing,
      });
    }

    const waktuStandar = existing?.waktuStandar;
    if (!waktuStandar) {
      return res.status(400).json({ message: "Waktu standar tidak ditemukan" });
    }

    const waktuStandarMoment = moment(waktuStandar);
    const waktuAktualMoment = moment(waktuAktual);
    const diffMinutes = waktuAktualMoment.diff(waktuStandarMoment, "minutes");

    let status, delayText;

    if (diffMinutes > 0) {
      status = "Delay";
      delayText = `-${diffMinutes} menit`;
    } else if (diffMinutes < 0) {
      status = "Advanced";
      delayText = `+${Math.abs(diffMinutes)} menit`;
    } else {
      status = "On Time";
      delayText = `0 menit`;
    }

    if (!existing) {
      existing = new trackingDelv({
        proses,
        dn,
        waktuStandar,
        waktuAktual,
        delay: delayText,
        status,
      });
    } else {
      existing.waktuAktual = waktuAktual;
      existing.delay = delayText;
      existing.status = status;
    }

    await existing.save();

    res.status(200).json({
      message: "Data berhasil dicatat",
      data: existing,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Server error", error });
  }
};

export const generateOrGetVerification = async (req, res) => {
  try {
    const { customerId, cycle, tanggal, shift } = req.body;
    const waktuAktual = moment().tz("Asia/Jakarta");

    const startOfDay = moment
      .tz(tanggal, "Asia/Jakarta")
      .startOf("day")
      .toDate();
    const endOfDay = moment.tz(tanggal, "Asia/Jakarta").endOf("day").toDate();
    const existing = await trackingDelv.findOne({
      customerId,
      cycleNumber: cycle,
      tanggal: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
      nama: "Inspection",
      verificationCode: { $exists: true },
    });

    let delay = 0;
    let statusWaktu = "On Time";

    if (existing?.waktuStandar) {
      const waktuStandar = moment(new Date(existing.waktuStandar)).tz(
        "Asia/Jakarta"
      );
      const diffMinutes = moment(waktuAktual).diff(waktuStandar, "minutes");
      delay = diffMinutes;

      if (diffMinutes > 15) statusWaktu = "Delay";
      else if (diffMinutes < -15) statusWaktu = "Advanced";
    }

    const payload = {
      customerId,
      cycle,
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
      .slice(0, 16);

    const expectedHash = crypto
      .createHmac("sha512", serverSecret)
      .update(payloadString)
      .digest("hex");

    const verificationCode = `${expectedHash}:${randomString}`;

    const baseQuery = {
      customerId,
      tanggal: { $gte: startOfDay, $lt: endOfDay },
      cycleNumber: cycle,
      $or: [
        { verificationCode: null },
        { verificationCode: { $exists: false } },
      ],
    };

    // Update "Inspection"
    const updateInspectionResult = await trackingDelv.updateMany(
      { ...baseQuery, nama: "Inspection" },
      {
        $set: {
          verificationCode,
          shift,
          waktuAktual,
          delay,
          status: statusWaktu,
        },
      }
    );

    const updateFinishPrepResult = await trackingDelv.updateMany(
      { ...baseQuery, nama: "Finish Preparation" },
      {
        $set: {
          verificationCode,
          shift,
        },
      }
    );

    return res.status(200).json({
      message: existing ? "Kode sudah ada!" : "Kode ter-generate!",
      verificationCode,
      shift,
      waktuAktual,
      updateResults: {
        inspection: updateInspectionResult.modifiedCount,
        finishPreparation: updateFinishPrepResult.modifiedCount,
      },
    });
  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }

  //   try {
  //     const { customerId, tanggal, cycle, shift } = req.body;

  //     if (!customerId || !tanggal || !cycle || !shift) {
  //       return res.status(400).json({
  //         message: "customerId, tanggal, cycle, dan shift harus diisi",
  //       });
  //     }

  //     const waktuAktual = moment().tz("Asia/Jakarta");

  //     const startOfDay = moment
  //       .tz(tanggal, "Asia/Jakarta")
  //       .startOf("day")
  //       .toDate();
  //     const endOfDay = moment.tz(tanggal, "Asia/Jakarta").endOf("day").toDate();

  //     // const existing = await trackingDelv.findOne({
  //     //   customerId,
  //     //   tanggal: { $gte: startOfDay, $lt: endOfDay },
  //     //   cycleNumber: cycle,
  //     //   nama: "Inspection",
  //     //   verificationCode: { $ne: null },
  //     // });

  //     // if (existing) {
  //     //   return res.status(200).json({
  //     //     message: "Verification sudah ada",
  //     //     verificationCode: existing.verificationCode,
  //     //     shift: existing.shift || null,
  //     //     waktuAktual: existing.waktuAktual || null,
  //     //   });
  //     // }

  //     const existing = await trackingDelv.findOne({
  //       customerId,
  //       tanggal: { $gte: startOfDay, $lt: endOfDay },
  //       cycleNumber: cycle,
  //       nama: "Inspection",
  //       verificationCode: { $ne: null },
  //     });

  //     if (existing && existing.waktuStandar) {
  //       const waktuStandar = moment(new Date(existing.waktuStandar)).tz(
  //         "Asia/Jakarta"
  //       );

  //       const diffMinutes = waktuAktual.diff(waktuStandar, "minutes");
  //       delay = diffMinutes;

  //       let statusWaktu = existing.status;

  //       if (diffMinutes > 15) statusWaktu = "Delay";
  //       else if (diffMinutes < -15) statusWaktu = "Advanced";
  //       else statusWaktu = "On Time";
  //     }

  //     if (existing) {
  //       return res.status(200).json({
  //         message: "Verification sudah ada",
  //         verificationCode: existing.verificationCode,
  //         shift: existing.shift || null,
  //         waktuAktual: existing.waktuAktual || null,
  //       });
  //     }

  //     const payload = {
  //       customerId,
  //       cycle,
  //       tanggal: moment.tz(tanggal, "Asia/Jakarta").toDate(),
  //       timestamp: new Date().toISOString(),
  //     };

  //     const payloadString = JSON.stringify(payload);
  //     const serverSecret = process.env.QR_SECRET;

  //     const randomString = crypto
  //       .randomBytes(16)
  //       .toString("base64")
  //       .replace(/\+/g, "-")
  //       .replace(/\//g, "_")
  //       .replace(/=/g, "")
  //       .slice(0, 16); // t

  //     const expectedHash = crypto
  //       .createHmac("sha512", serverSecret)
  //       .update(payloadString)
  //       .digest("hex");

  //     const verificationCode = `${expectedHash}:${randomString}`;

  //     await trackingDelv.updateMany(
  //       {
  //         customerId,
  //         tanggal: { $gte: startOfDay, $lt: endOfDay },
  //         cycleNumber: cycle,
  //         nama: "Inspection",
  //         $or: [
  //           { verificationCode: null },
  //           { verificationCode: { $exists: false } },
  //         ],
  //       },
  //       {
  //         $set: {
  //           verificationCode,
  //           shift,
  //           waktuAktual,
  //           delay,
  //           status,
  //         },
  //       }
  //     );
  //     await trackingDelv.updateMany(
  //       {
  //         customerId,
  //         tanggal: { $gte: startOfDay, $lt: endOfDay },
  //         cycleNumber: cycle,
  //         nama: "Finish Preparation",
  //         $or: [
  //           { verificationCode: null },
  //           { verificationCode: { $exists: false } },
  //         ],
  //       },
  //       {
  //         $set: {
  //           verificationCode,
  //           shift,
  //         },
  //       }
  //     );

  //     return res.status(200).json({
  //       message: "Verification berhasil dibuat",
  //       verificationCode,
  //       shift,
  //       waktuAktual,
  //     });
  //   } catch (error) {
  //     console.error("Gagal generate verification:", error);
  //     return res.status(500).json({
  //       message: "Terjadi kesalahan server",
  //       error: error.message,
  //     });
  //   }
};
