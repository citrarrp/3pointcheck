import { Link, useParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function BreadcrumbCycle() {
  const location = useLocation();
  const { customerId, uniqueCode } = useParams();
  const isPath = (to) => decodeURIComponent(location.pathname) === to;
  // console.log("pathname", decodeURIComponent(location.pathname));
  // console.log("expected", `/printLabel/${customerId}/${uniqueCode}`);

  return (
    <nav className="text-sm text-gray-700 mb-4">
      <ol className="list-none p-0 inline-flex space-x-1">
        <li>
          <Link
            to="/printLabel"
            className={`${
              isPath("/printLabel") ? "text-[#105bdf]" : "text-black"
            } hover:underline`}
          >
            Pilih Customer
          </Link>
          <span className="mx-2">/</span>
        </li>
        {/* {customerId !== undefined && customerId !== null && ( */}
        <li>
          <Link
            to={`/printLabel/${customerId}`}
            className={`${
              isPath(`/printLabel/${customerId}`)
                ? "text-[#105bdf]"
                : "text-black"
            } hover:underline`}
          >
            Pilih Kode
          </Link>
          <span className="mx-2">/</span>
        </li>

        {/* {uniqueCode !== undefined && uniqueCode !== null && ( */}
        <li className="text-gray-900">
          <Link
            to={`/printLabel/${customerId}/${uniqueCode}`}
            className={`${
              isPath(`/printLabel/${customerId}/${uniqueCode}`)
                ? "text-[#105bdf]"
                : "text-black"
            } hover:underline`}
          >
            Cetak Label
          </Link>
        </li>
        {/* )} */}
      </ol>
    </nav>
  );
}
