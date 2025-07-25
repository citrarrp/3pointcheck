import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  sendPrint: (html) => ipcRenderer.send("print-content", html),
});

