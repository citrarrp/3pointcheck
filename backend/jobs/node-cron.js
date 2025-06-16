import corn from "node-cron";
import fetch from "node-fetch";
import trackingDelv from "../models/tracking.js";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

const sendNotificationTelegram = async (text) => {
  const url = `https://api.telegram.org/bot${process.env.TELEGRAMBOT_TOKEN}/sendMessage`;
  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: process.env.CHAT_ID,
      text: text,
      parse_mode: "Markdown",
    }),
  });
};

corn.schedule("*/5 * * * *", async () => {
  try {
    const now = new Date();

    // Buat awal dan akhir dari menit
    const startOfMinute = new Date(now);
    startOfMinute.setSeconds(0, 0);

    const endOfMinute = new Date(now);
    endOfMinute.setSeconds(59, 999);

    // Cari semua data waktuStandar antara detik 00 dan 59 di menit itu
    const tracking = await trackingDelv
      .find({
        waktuStandar: {
          $gte: startOfMinute,
          $lte: endOfMinute,
        },
      })
      .populate("customerId", "nama")
      .lean();

    if (!tracking || tracking.length === 0) {
      return;
    }

    const lokalWaktu = new Date(tracking.waktuStandar).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );

    await sendNotificationTelegram(`
          🚚 *DELIVERY CONTROL NOTIFICATION*\n\n 
          📦 Customer: PT. ${tracking.customerId.nama}\n 
          🔁 Cycle: ${tracking.cycleNumber}\n 
          🗓 Tanggal: ${lokalWaktu}\n 
          📌 Status: ${String(tracking.status).toUpperCase()}\n\n 
    `);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
