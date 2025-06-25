import { useState, useEffect } from "react";

import QRCode from "react-qr-code";

export default function Cetak() {
  const [customers, setCustomers] = useState([]);
  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/customer/`)
      .then((response) => response.json())
      .then((data) => setCustomers(data.data))
      .catch((error) => console.error(error));
  }, []);
  return (
    <ul className="flex flex-cols gap-8">
      {customers.length > 0 ? (
        customers.map((customer, index) => (
          <li key={index} className="">
            {/*            
            <ul>
              {Object.entries(customer.nama).map(([key, value]) => (
                <li key={key}> */}
            <QRCode
              size={50}
              style={{ height: "auto" }}
              value={customer._id}
              viewBox={`0 0 256 256`}
            />
            {/* </li>
              ))}
            </ul> */}
          </li>
        ))
      ) : (
        <p>Loading data...</p>
      )}
    </ul>
  );
}
