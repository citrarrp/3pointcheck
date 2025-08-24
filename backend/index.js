import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import customerRoutes from "./routes/customer.router.js";
import dataRoutes from "./routes/data.router.js";
import inputQRRoutes from "./routes/inputQR.router.js";
import fieldRoutes from "./routes/label.router.js";
import userRoutes from "./routes/user.router.js";
import AbsensiRoutes from "./routes/absensi.router.js";
import trackingRoutes from "./routes/tracking.router.js";
import cookieParser from "cookie-parser";
import partMaterialRoutes from "./routes/partmaterial.router.js";
import productRoutes from "./routes/tag.router.js";
import printRoutes from "./routes/print.router.js";
import truckRoutes from "./routes/truck.router.js";
import "./jobs/node-cron.js";
// import escpos from "escpos";
// import USB from "escpos-usb";
// import sharp from "sharp";
// import puppeteer from "puppeteer";

// escpos.USB = USB;

// app.get("/health", (req, res) => {
//   res.json({
//     status: "ok",
//     timestamp: new Date(),
//     server: "Print Server v1.0",
//   });
// });

// app.post("/print-image", async (req, res) => {
//   try {
//     const { image, width, height } = req.body;

//     if (!image) {
//       return res.status(400).json({ error: "Image data required" });
//     }

//     console.log("📸 Receiving image for print...");

//     // Convert base64 to buffer
//     const base64Data = image.replace(/^data:image\/\w+;base64,/, "");
//     const buffer = Buffer.from(base64Data, "base64");

//     // Resize untuk thermal printer TM-T82 (58mm ≈ 384px)
//     const resized = await sharp(buffer)
//       .resize(384, null, {
//         withoutEnlargement: true,
//         fit: "inside",
//       })
//       .png()
//       .toBuffer();

//     console.log("🖨️ Printing to TM-T82...");

//     // Setup printer
//     const device = new USB();
//     const printer = new escpos.Printer(device);

//     // Print process
//     device.open((error) => {
//       if (error) {
//         console.error("❌ Printer connection error:", error);
//         return res.status(500).json({ error: "Printer connection failed" });
//       }

//       printer
//         .font("a")
//         .align("ct")
//         .raster(escpos.Image.load(resized))
//         .cut()
//         .close(() => {
//           console.log("✅ Print completed!");
//           res.json({
//             success: true,
//             message: "Print completed successfully",
//             timestamp: new Date(),
//           });
//         });
//     });
//   } catch (error) {
//     console.error("❌ Print error:", error);
//     res.status(500).json({
//       error: error.message,
//       timestamp: new Date(),
//     });
//   }
// });

// app.post("/print-html", async (req, res) => {
//   let browser = null;

//   try {
//     const { html, css, width = 384, height = 600 } = req.body;

//     if (!html) {
//       return res.status(400).json({ error: "HTML content required" });
//     }

//     console.log("🌐 Rendering HTML with Puppeteer...");

//     // Launch browser
//     browser = await puppeteer.launch({
//       headless: "new",
//       args: ["--no-sandbox", "--disable-setuid-sandbox"],
//     });

//     const page = await browser.newPage();

//     // Set viewport untuk thermal printer width
//     await page.setViewport({
//       width: parseInt(width),
//       height: parseInt(height),
//       deviceScaleFactor: 0.9,
//     });

//     // Create full HTML document
//     const fullHTML = `
//       <!DOCTYPE html>
//       <html>
//       <head>
//         <meta charset="UTF-8">
//         <style>
//           body {
//             margin: 0;
//             padding: 10px;
//             font-family: Arial, sans-serif;
//             width: ${width}px;
//           }
//           ${css}
//         </style>
//       </head>
//       <body>
//         ${html}
//       </body>
//       </html>
//     `;

//     await page.setContent(fullHTML, { waitUntil: "networkidle0" });

//     // Take screenshot
//     const screenshot = await page.screenshot({
//       type: "png",
//       fullPage: true,
//       omitBackground: false,
//     });

//     await browser.close();
//     browser = null;

//     console.log("🖨️ Printing HTML to TM-T82...");

//     // Print screenshot
//     const device = new USB();
//     const printer = new escpos.Printer(device);

//     device.open((error) => {
//       if (error) {
//         console.error("❌ Printer connection error:", error);
//         return res.status(500).json({ error: "Printer connection failed" });
//       }

//       printer
//         .font("a")
//         .align("ct")
//         .raster(escpos.Image.load(screenshot))
//         .cut()
//         .close(() => {
//           console.log("✅ HTML Print completed!");
//           res.json({
//             success: true,
//             message: "HTML print completed successfully",
//             timestamp: new Date(),
//           });
//         });
//     });
//   } catch (error) {
//     if (browser) {
//       await browser.close();
//     }
//     console.error("❌ HTML Print error:", error);
//     res.status(500).json({
//       error: error.message,
//       timestamp: new Date(),
//     });
//   }
// });

// // Print text sederhana (untuk testing)
// app.post("/print-text", async (req, res) => {
//   try {
//     const { text } = req.body;

//     if (!text) {
//       return res.status(400).json({ error: "Text content required" });
//     }

//     console.log("📝 Printing text to TM-T82:", text);

//     const device = new USB();
//     const printer = new escpos.Printer(device);

//     device.open((error) => {
//       if (error) {
//         console.error("❌ Printer connection error:", error);
//         return res.status(500).json({ error: "Printer connection failed" });
//       }

//       printer
//         .font("a")
//         .align("ct")
//         .style("bu")
//         .size(1, 1)
//         .text("TEST PRINT")
//         .text("================")
//         .text(text)
//         .text("================")
//         .text(new Date().toLocaleString())
//         .cut()
//         .close(() => {
//           console.log("✅ Text print completed!");
//           res.json({
//             success: true,
//             message: "Text print completed successfully",
//             timestamp: new Date(),
//           });
//         });
//     });
//   } catch (error) {
//     console.error("❌ Text print error:", error);
//     res.status(500).json({
//       error: error.message,
//       timestamp: new Date(),
//     });
//   }
// });

// // Error handler
// app.use((error, req, res, next) => {
//   console.error("Server Error:", error);
//   res.status(500).json({
//     error: "Internal server error",
//     message: error.message,
//     timestamp: new Date(),
//   });
// });

// // Start server
// const PORT = process.env.PORT || 3001;
// app.listen(PORT, () => {
//   console.log(`🚀 Print server running on http://localhost:${PORT}`);
//   console.log("📋 Available endpoints:");
//   console.log("  GET  /health          - Health check");
//   console.log("  POST /print-image     - Print screenshot/image");
//   console.log("  POST /print-html      - Print HTML with Puppeteer");
//   console.log("  POST /print-text      - Print simple text");
//   console.log("");
//   console.log("🖨️  Make sure Epson TM-T82 is connected via USB");
// });

dotenv.config({ path: ".env" });

// import TelegramBot from "node-telegram-bot-api";
// const bot = new TelegramBot(process.env.TELEGRAMBOT_TOKEN, { polling: true });

// bot.on("message", (msg) => {
//   console.log("Chat ID:", msg.chat.id); // ← ini hasil yang kamu butuhkan
// });

const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// app.use(express.static(path.join(__dirname, 'dist')));

// // Untuk menangani routing di aplikasi SPA (Single Page Application)
// app.get('*', (req, res) => {
//   res.sendFile(path.join(__dirname, 'dist', 'index.html'));
// });

const db = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URL);

    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    collections.forEach((collection) => {
      console.log("- " + collection.name);
    });
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

app.use("/api/customer", customerRoutes);
app.use("/api/data", dataRoutes);
app.use("/api/inputQR", inputQRRoutes);
app.use("/api/fields", fieldRoutes);
app.use("/api/user", userRoutes);
app.use("/api/absensi", AbsensiRoutes);
app.use("/api/track", trackingRoutes);
app.use("/api/materials", partMaterialRoutes);
app.use("/api/production", productRoutes);
app.use("/api/print-tag", printRoutes);
app.use("/api/trucks", truckRoutes);
app.listen(5000, () => {
  db();
  console.log("Server listening on port 5000");
});

// import express from "express";
// import dotenv from "dotenv";
// import path from "path";
// import cors from 'cors';
// import { connectDB } from "./config/db.js";

// import customerRoutes from "./routes/customer.router.js";

// dotenv.config();

// const app = express();
// const PORT = process.env.PORT || 5000;

// const __dirname = path.resolve();

// app.use(cors());
// app.use(express.json());

// app.use("/api/customer", customerRoutes);

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));
//   app.get("*", (req, res) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

// app.listen(PORT, () => {
//   connectDB();
//   console.log("Server started at http://localhost:" + PORT);
// });
