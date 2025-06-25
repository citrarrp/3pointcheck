import corn from "node-cron";
import fetch from "node-fetch";
import trackingDelv from "../models/tracking.js";
import dotenv from "dotenv";
import nodeHtmlToImage from "node-html-to-image";
import axios from "axios";
import fs from "fs";
import path from "path";

export const kirimStatusGambar = async (item) => {
  const logoPath = path.join(__dirname, "../assets/PT_Menara_Terus_Makmur.jpg");
  const logoBase64 = fs.readFileSync(logoPath, { encoding: "base64" });
  const logoDataURL = `data:image/jpeg;base64,${logoBase64}`;

  const statusDisplay = item.status || "Delay";
  const tanggal = new Date(item.waktuStandar).toLocaleDateString("id-ID");

  const html = `
  <html>
  <head>
    <meta charset="UTF-8" />
    <style>
      body {
        font-family: sans-serif;
        background: #f9f9f9;
        padding: 20px;
      }
      h2 {
        color: #333;
      }
      .box {
        background: white;
        padding: 20px;
        border-radius: 10px;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
      }
      table {
        width: 100%;
        border-collapse: collapse;
        margin-top: 16px;
      }
      th, td {
        border: 1px solid #ccc;
        padding: 8px;
        text-align: left;
      }
      th {
        background: #f0f0f0;
      }
    </style>
  </head>
  <body>
    <div class="box">
      <img src="${logoDataURL}" loading="lazy" height="20px" width="80px" />
      <h2>🚚 KONTROL DELIVERY PT. MTM ---> ${item.customerId.nama}</h2>

      <p><strong>Customer:</strong> PT. ${item.customerId.nama}</p>
      <p><strong>Cycle:</strong> ${item.cycleNumber}</p>
      <p><strong>Status:</strong> ${statusDisplay.toUpperCase()}</p>
      <p><strong>Tanggal:</strong> ${tanggal}</p>

      <table>
        <thead>
          <tr>
            <th rowspan="2">No</th>
            <th colspan="5">
              ${moment.tz("Asia/Jakarta").format("DD-MM-YY")} ${moment
    .tz("Asia/Jakarta")
    .format("HH:mm")}
            </th>
          </tr>
          <tr>
            <th>Product</th>
            <th>BO</th>
            <th>Plan Delv (Pcs)</th>
            <th>Act Delv (Pcs)</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <!-- Isi data produk bisa kamu masukkan di sini dengan loop -->
        </tbody>
      </table>
    </div>
  </body>
  </html>
  `;

  await nodeHtmlToImage({
    output: "./delivery-status.png",
    html: html,
  });

  const form = new FormData();
  form.append("chat_id", process.env.CHAT_ID);
  form.append("caption", "📸 Status Pengiriman");
  form.append("photo", fs.createReadStream("./delivery-status.png"));

  await axios.post(
    `https://api.telegram.org/bot${process.env.TELEGRAMBOT_TOKEN}/sendPhoto`,
    form,
    {
      headers: form.getHeaders(),
    }
  );
};

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

corn.schedule("* * * * *", async () => {
  console.log("Cron job running....");
  try {
    // Buat awal dan akhir dari menit
    let startOfMinute = new Date();
    startOfMinute.setSeconds(0, 0);

    let endOfMinute = new Date();
    endOfMinute.setSeconds(59, 999);

    // Cari semua data waktuStandar antara detik 00 dan 59 di menit itu
    const tracking = await trackingDelv
      .find({
        nama: "Departure Truck",
        waktuStandar: {
          $gte: startOfMinute,
          $lte: endOfMinute,
        },
      })
      .populate("customerId", "nama")
      .lean();

    const trackingBelumUpdate = await trackingDelv.find({
      $or: [
        { nama: "Departure Truck" },
        { nama: "Finish Preparation" },
        { nama: "Start Preparation (Pulling)" },
      ],
      status: "-",
      waktuStandar: { $lt: endOfMinute },
    });

    console.log(
      "startOfMinute:",
      startOfMinute.toISOString(),
      startOfMinute,
      endOfMinute,
      typeof startOfMinute
    );
    console.log("endOfMinute:", endOfMinute.toISOString());

    if (trackingBelumUpdate.length > 0) {
      for (const item of trackingBelumUpdate) {
        await trackingDelv.updateOne(
          { _id: item._id },
          { $set: { status: "Delay" } }
        );
      }
    }
    if (!tracking || tracking.length === 0) {
      console.log("tidak ada");
      return;
    }

    // const lokalWaktu = new Date(tracking.waktuStandar).toLocaleDateString(
    //   "id-ID",
    //   {
    //     day: "numeric",
    //     month: "long",
    //     year: "numeric",
    //   }
    // );

    for (const item of tracking) {
      console.log("cari tracking");
      let statusDisplay = String(item.status).trim();
      let warningMessage = "";

      // Ubah status "-" menjadi "Delay" di tampilan dan database
      if (!statusDisplay || statusDisplay === "-") {
        statusDisplay = "Delay";
        warningMessage =
          "\n⚠️ *PESANAN BELUM DIKIRIM*, DIPERKIRAKAN *DELAY*.\n";
        await trackingDelv.updateOne({ _id: item._id }, { status: "Delay" });
      }

      const lokalWaktu = new Date(item.waktuStandar).toLocaleDateString(
        "id-ID",
        {
          day: "numeric",
          month: "long",
          year: "numeric",
        }
      );

      // const lokalWaktu = new Date(item.waktuStandar).toLocaleDateString(
      //   "id-ID",
      //   {
      //     day: "numeric",
      //     month: "long",
      //     year: "numeric",
      //   }
      // );

      await sendNotificationTelegram(`🚚 *DELIVERY CONTROL NOTIFICATION*\n\n
      📦 Customer: PT. ${item.customerId.nama}\n
      🔁 Cycle: ${item.cycleNumber}\n
      🗓 Tanggal: ${lokalWaktu}\n
      📌 Status: *${statusDisplay.toUpperCase()}*${warningMessage}\n\n
      `);
    }

    // await sendNotificationTelegram(`
    //       🚚 *DELIVERY CONTROL NOTIFICATION*\n\n
    //       📦 Customer: PT. ${tracking.customerId.nama}\n
    //       🔁 Cycle: ${tracking.cycleNumber}\n
    //       🗓 Tanggal: ${lokalWaktu}\n
    //       📌 Status: ${String(tracking.status).toUpperCase()}\n\n
    // `);
  } catch (err) {
    console.error("❌ Cron error:", err.message);
  }
});
