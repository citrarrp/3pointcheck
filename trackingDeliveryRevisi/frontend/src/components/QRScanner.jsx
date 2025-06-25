// import { useEffect } from "react";
// import { Html5Qrcode } from "html5-qrcode";

// export default function QrScanner({ onScanSuccess }) {
//   useEffect(() => {
//     const html5QrCode = new Html5Qrcode("reader");

//     const startScanner = async () => {
//       try {
//         await html5QrCode.start(
//           { facingMode: "environment" }, // kamera belakang
//           {
//             fps: 10,
//             qrbox: { width: 250, height: 250 },
//           },
//           (decodedText, decodedResult) => {
//             console.log("Success scan:", decodedText);
//             alert(decodedResult);
//             html5QrCode.stop(); // stop kamera setelah sukses scan
//             onScanSuccess(decodedText); // kirim hasil ke parent
//           },
//           (errorMessage) => {
//             console.log("Scanning error:", errorMessage);
//           }
//         );
//       } catch (err) {
//         console.error("Camera start error:", err);
//       }
//     };

//     startScanner();

//     return () => {
//       html5QrCode.stop().catch((err) => console.log("Stop error:", err));
//     };
//   }, [onScanSuccess]);

//   return (
//     <div>
//       <div id="reader" style={{ width: "300px", margin: "auto" }}></div>
//     </div>
//   );
// }

import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

const createConfig = (props) => {
  let config = {};
  if (props.fps) {
    config.fps = props.fps;
  }
  if (props.qrbox) {
    config.qrbox = props.qrbox;
  }
  if (props.aspectRatio) {
    config.aspectRatio = props.aspectRatio;
  }
  if (props.disableFlip !== undefined) {
    config.disableFlip = props.disableFlip;
  }
  return config;
};

const Html5QrcodePlugin = (props) => {
  useEffect(() => {
    // when component mounts
    const config = createConfig(props);
    const verbose = props.verbose === true;
    // Suceess callback is required.
    if (!props.qrCodeSuccessCallback) {
      throw "qrCodeSuccessCallback is required callback.";
    }
    const html5QrcodeScanner = new Html5QrcodeScanner(
      qrcodeRegionId,
      config,
      verbose
    );
    html5QrcodeScanner.render(
      props.qrCodeSuccessCallback,
      props.qrCodeErrorCallback
    );

    return () => {
      html5QrcodeScanner.clear().catch((error) => {
        console.error("Failed to clear html5QrcodeScanner. ", error);
      });
    };
  }, [props]);

  return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
