import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"), // 👈 hubungkan preload
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  const isDev = !app.isPackaged;

  if (isDev) {
    win.loadURL("http://localhost:5173");
  } else {
    win.loadFile(path.join(__dirname, "../dist/index.html"));
  }
}

ipcMain.on("print-content", (event, content) => {
  const printWin = new BrowserWindow({ show: false });
  printWin.loadURL(
    `data:text/html;charset=utf-8,${encodeURIComponent(content)}`
  );

  printWin.webContents.on("did-finish-load", () => {
    printWin.webContents.print(
      { silent: true, printBackground: true },
      (success, error) => {
        if (!success) console.error(error);
        printWin.close();
      }
    );
  });
});

app.whenReady().then(createWindow);
