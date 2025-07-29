import QRCode from "react-qr-code";
import logo from "../assets/PT_Menara_Terus_Makmur.png";
import Barcode from "react-barcode";
import moment from "moment-timezone";
import {
  MdOutlineCircle,
  MdStarOutline,
  MdOutlineSquare,
} from "react-icons/md";
import {
  MdOutlinePentagon,
  MdOutlineHexagon,
  MdOutlineRectangle,
} from "react-icons/md";
import {
  RiTriangleLine,
  RiPokerDiamondsLine,
  RiPokerHeartsLine,
} from "react-icons/ri";
import { PiStarAndCrescentLight } from "react-icons/pi";
import { PiParallelogramBold } from "react-icons/pi";
import { BsLightningCharge } from "react-icons/bs";
import { BiCircleHalf } from "react-icons/bi";
import { SiBastyon } from "react-icons/si";
import { GrFastForward } from "react-icons/gr";
import { MdLabelImportantOutline } from "react-icons/md";
import { TiMinusOutline } from "react-icons/ti";
import { TiStarburstOutline } from "react-icons/ti";
import { MdFormatOverline } from "react-icons/md";
import { TiPlusOutline } from "react-icons/ti";
import { TiWavesOutline } from "react-icons/ti";
import { TiThLargeOutline } from "react-icons/ti";
import { GiZigzagHieroglyph } from "react-icons/gi";
import { IoMdCloudOutline } from "react-icons/io";
import { FaRegBookmark } from "react-icons/fa";
import { RiMapLine } from "react-icons/ri";
import { CiLocationArrow1 } from "react-icons/ci";
import { SiNextbilliondotai } from "react-icons/si";
import { LuFishSymbol } from "react-icons/lu";
import { VscSymbolNumeric } from "react-icons/vsc";
import { TbArrowBadgeDown } from "react-icons/tb";

const TagMTM = ({
  tagData,
  dataCust,
  dataPart,
  code,
  line,
  date,
  shift,
  kanban,
  user,
  customer,
  idx,
}) => {
  console.log(dataCust, "nilai kanban", dataPart);
  if (!dataPart || dataPart.length === 0) return <p>Data tidak tersedia</p>;

  console.log(dataPart[0], "ini ada", tagData[0]);
  const InfoGrid = () => (
    <>
      <div className="flex-1 space-y-1 text-[11px] leading-normal">
        {[
          ["PART NAME", dataPart[0].material_description || ""],
          ["PART NO", dataPart[0].material || ""],
        ].map(([label, value], idx) => (
          <div className="grid grid-cols-12 gap-2" key={idx}>
            <span className="col-span-4 font-bold">{label}</span>
            <span className="col-span-8">: {value}</span>
          </div>
        ))}
      </div>
      <div className="flex-1 space-y-1 text-[10px] leading-normal mt-1">
        {[
          ["CUST. NO", dataPart[0].customer_material || ""],
          ["CUSTOMER", customer],
          ["LINE", line],
        ].map(([label, value], idx) => (
          <div className="grid grid-cols-12 gap-2" key={idx}>
            <span className="col-span-4 font-bold">{label}</span>
            <span className="col-span-8">: {value}</span>
          </div>
        ))}
      </div>
    </>
  );

  const shapeIcons = [
    MdOutlineCircle,
    MdStarOutline,
    MdOutlineSquare,
    MdOutlinePentagon,
    MdOutlineHexagon,
    MdOutlineRectangle,
    RiTriangleLine,
    RiPokerDiamondsLine,
    PiStarAndCrescentLight,
    PiParallelogramBold,
    BsLightningCharge,
    RiPokerHeartsLine,
    BiCircleHalf,
    SiBastyon,
    GrFastForward,
    MdLabelImportantOutline,
    TiMinusOutline,
    TiStarburstOutline,
    MdFormatOverline,
    TiPlusOutline,
    TiThLargeOutline,
    TiWavesOutline,
    GiZigzagHieroglyph,
    IoMdCloudOutline,
    FaRegBookmark,
    RiMapLine,
    CiLocationArrow1,
    SiNextbilliondotai,
    LuFishSymbol,
    VscSymbolNumeric,
    TbArrowBadgeDown,
  ];

  // |${
  //                   dataCust[0].selectedData
  //                 }
  const Footer = () => (
    <div className="absolute bottom-2 left-2 right-1 text-[10px] space-y-1">
      <div className="flex items-center">
        <span className="font-bold">OPERATOR</span>
        <span className="ml-[21px]">
          : {user.npk} {user.fullname.toUpperCase().slice(0, 10)}
        </span>
      </div>
      <div className="flex justify-between items-end gap-3">
        <div className="border-1 border-[#1e2939] p-1.5 flex-1">
          <div className="flex justify-between">
            <span>SHIFT : {shift || 1}</span>
            <span>{moment.tz(date, "Asia/Jakarta").format("DD.MM.YYYY")}</span>
            <span>{moment.tz("Asia/Jakarta").format("HH:mm")} WIB</span>
          </div>
        </div>
        <div className="w-[33mm] h-[15mm] text-[7.5px]">
          <table className="w-full h-full text-center border-collapse">
            <tbody>
              <tr className="h-[15mm]">
                <td className="w-1/2 border-r border-[#1e2939] align-top pb-1">
                  LEADER
                </td>
                <td className="w-1/2 align-top pb-1">QC</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
  const IconComponent = shapeIcons[idx];

  const customSize = [13, 14, 20, 24, 27, 29].includes(idx) ? 28 : 32;
  const Layout1 = () => (
    <div className="w-[90mm] h-[70mm] p-2 border-1 border-[#1e2939] text-[10pt] font-sans bg-[#ffffff] relative leading-normal">
      <div className="flex justify-between items-center border-b border-[#1e2939] pb-1 mb-2">
        <div className="w-[20mm] h-[10mm] flex items-center justify-center">
          <img src={logo} alt="PT Menara Terus Makmur" className="h-[8px]" />
        </div>
        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-[12px] font-bold">IDENTIFIKASI BARANG</div>
          <div className="text-[8px] font-normal">NO FORM : PR-FR-05-64</div>
        </div>
        <IconComponent size={customSize} />
      </div>

      <div className="flex justify-between gap-2 mb-2">
        <div className="flex-shrink-0">
          <QRCode
            value={`${dataCust[0]?.selectedData}|${
              dataCust[0]?.qty || 0
            }|${moment(date).format("DDMMYYYY")}`}
            size={58}
            level="H"
            bgColor="transparent"
          />
        </div>
        <div className="flex-1 mx-1">
          <InfoGrid />
        </div>
        <div className="flex-shrink-0">
          <QRCode
            value={
              dataCust[0]?.selectedData
                ? `${code}|${moment(date).format("DDMMYYYY")}|${shift}|${String(
                    (tagData[0]?.qty ?? 0) + 1
                  ).padStart(4, "0")}|${dataPart[0]?.customer_material}`
                : `${code}|${moment(date).format("DDMMYYYY")}|${shift}|${String(
                    (tagData[0]?.qty ?? 0) + 1
                  ).padStart(4, "0")}|${dataPart[0]?.customer_material}`
            }
            size={58}
            level="H"
            bgColor="transparent"
          />
          <div className="font-bold text-center items-center mt-1 flex flex-row justify-between gap-1">
            <div className="text-[12px]">QTY :</div>
            <div className="text-[20px]">{dataCust[0]?.qty || 0}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

  const Layout2 = () => (
    <div className="w-[80mm] h-[70mm] p-2 border-1 border-[#1e2939] text-[10pt] font-sans bg-[#ffffff] relative leading-normal">
      <div className="flex justify-between items-center border-b border-[#1e2939] pb-1 mb-2">
        <div className="w-[20mm] h-[12mm] flex items-center justify-center">
          <img src={logo} alt="PT Menara Terus Makmur" className="h-[15px]" />
        </div>

        <div className="flex-1 flex flex-col items-center justify-center text-center px-2">
          <div className="text-[12px] font-bold">IDENTIFIKASI BARANG</div>
          <div className="text-[8px] font-normal">NO FORM : PR-FR-05-64</div>
        </div>
        <IconComponent size={customSize} />
      </div>

      <div className="flex justify-between gap-2 mb-2">
        <div className="flex-1 mr-2">
          <InfoGrid />
        </div>
        <div className="flex flex-col items-center flex-shrink-0 gap-1">
          <QRCode
            value={
              dataCust[0]?.selectedData
                ? `${code}|${moment(date).format("DDMMYYYY")}|${shift}|${String(
                    (tagData[0]?.qty ?? 0) + 1
                  ).padStart(4, "0")}|${dataPart[0].customer_material}`
                : `${code}|${moment(date).format("DDMMYYYY")}|${shift}|${String(
                    (tagData[0]?.qty ?? 0) + 1
                  ).padStart(4, "0")}|${dataPart[0].customer_material}`
            }
            size={58}
            level="H"
            bgColor="transparent"
          />
          <div className="font-bold text-center items-center mt-1 flex flex-row justify-between gap-1">
            <div className="text-[14px]">QTY :</div>
            <div className="text-[22px]">{dataCust[0]?.qty || 0}</div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );

  return dataCust[0]?.kanban === false ? <Layout1 /> : <Layout2 />;
};

export default TagMTM;
