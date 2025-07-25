import fs from "fs";
import { Buffer } from "buffer";
import { PrinterTypes, ThermalPrinter } from "node-thermal-printer";

export async function printImageFromBase64(base64Data) {
  const imageData = base64Data.replace(/^data:image\/png;base64,/, "");
  const buffer = Buffer.from(imageData, "base64");
  const filePath = "print.png";

  fs.writeFileSync(filePath, buffer);

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // atau STAR jika printer kamu bukan EPSON
    interface: "printer:EPSON TM-T82 Receipt (v)", // ambil dari kolom Name
    options: {
      // Optional, tergantung model printer
      timeout: 5000,
    },
    characterSet: "SLOVENIA", // atau sesuai kebutuhan karakter (e.g. 'PC437_USA')
    removeSpecialCharacters: false,
    lineCharacter: "=",
  });
  const isConnected = await printer.isPrinterConnected();
  if (!isConnected) {
    console.log("Printer not connected");
    return;
  }

  const success = await printer.printImage(filePath);
  await printer.cut();
  await printer.execute();

  return success;
}
