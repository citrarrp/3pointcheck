import express from "express";
import { printImageFromBase64 } from "../controllers/print.controller.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import pdfPrinter from "pdf-to-printer";
const { print } = pdfPrinter;
import PDFDocument from "pdfkit";
const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import puppeteer from "puppeteer";
import sharp from "sharp";

router.post("/print-tag", async (req, res) => {
  const { html } = req.body;

  const htmlContent = `
    <html>
      <head>
        <style>
          body { margin: 0; padding: 0; font-family: sans-serif; }
        </style>
        <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
      </head>
      <body>
        ${html}
      </body>
    </html>
  `;

  const outputPath = path.join("output", "label.png");

  try {
    const browser = await puppeteer.launch({
      headless: "new", // true atau 'new' (biar tetap support sandbox)
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "networkidle0" });
    await page.setViewport({ width: 384, height: 600 }); // 384px untuk printer thermal 80mm

    const screenshotBuffer = await page.screenshot({ fullPage: true });
    await browser.close();

    // Gunakan sharp untuk resize atau convert jika perlu
    await sharp(screenshotBuffer)
      .resize(384) // Lebar 80mm thermal printer (sekitar 384px @ 203 DPI)
      .png()
      .toFile(outputPath);

    // Cetak file hasil render
    await print(outputPath, {
      printer: "EPSON TM-T82 Receipt (v)",
    });

    res.json({ success: true, message: "Printed with Puppeteer + Sharp" });
  } catch (err) {
    console.error("Print error:", err);
    res.status(500).json({ error: "Failed to print with Puppeteer" });
  }
});

router.post("", async (req, res) => {
  // try {
  //   const { image } = req.body;

  //   const success = await printImageFromBase64(image);
  //   res.status(200).json({ success });
  // } catch (err) {
  //   console.error("Print error:", err);
  //   res.status(500).json({ success: false, message: err.message });
  // }
  try {
    const base64Data = req.body.image.replace(/^data:image\/png;base64,/, "");
    const imagePath = path.join(__dirname, "print.png");

    console.log("Received image data length:", req.body.image?.length);

    fs.writeFileSync(imagePath, base64Data, "base64");
    const pdfPath = path.join(__dirname, "print.pdf");
    const doc = new PDFDocument({
      size: [226.77, 841.89], // 80mm x 297mm
      margin: 0,
    });

    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.image(imagePath, {
      fit: [226.77, 841.89],
      align: "center",
      valign: "top",
    });
    doc.end();

    stream.on("finish", async () => {
      try {
        await print(pdfPath, {
          printer: "EPSON TM-T82 Receipt (v)", // Ganti sesuai nama printer
        });
        res.json({ success: true, message: "Printed successfully" });
      } catch (err) {
        console.error("Print error:", err);
        res.status(500).json({ error: "Failed to print PDF" });
      }
    });

    // await print(imagePath, {
    //   printer: "EPSON TM-T82 Receipt (v)", // Ganti sesuai printer kamu
    // });
  } catch (err) {
    console.error("Print error:", err);
    res.status(500).send({ error: "Failed to print" });
  }
});

export default router;
