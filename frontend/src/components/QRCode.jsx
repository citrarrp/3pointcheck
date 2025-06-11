import QRCode from "react-qr-code";

export default function KodeQR({ data }) {
  return (
    <div>
      <QRCode
        size={50}
        style={{ height: "auto" }}
        value={data}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}
