// export default function TabelLabel({ data }) {
//   return (
// <table border="1" style={{ borderCollapse: "collapse", width: "100%" }}>
//   <tbody>
//     {data.map((row, index) => (
//       <tr key={index}>
//         {row.map((cell, cellindex) => (
//           <td
//             key={cellindex}
//             colSpan={cell.colSpan || 1}
//             rowSpan={cell.rowSpan || 1}
//           >
//             {cell.value}
//           </td>
//         ))}
//       </tr>
//     ))}
//   </tbody>
// </table>
//   );
// }

// const getstrukturTabel = (data) => {
//   if (data === 7) {
//     return [
//       [{ value: "1", colSpan: "2" }],
//       [{ value: "2", colSpan: "3" }],
//       [{ value: "4" }],
//       [{ value: "5", colSpan: "2" }],
//       [{ value: "6" }],
//       [{ value: "7" }],
//     ];
//   } else if (data === 10) {
//     return [
//       [{ value: "1", colSpan: "2" }],
//       [{ value: "2", colSpan: "3" }],
//       [{ value: "3", rowSpan: "2" }],
//       [{ value: "4" }],
//       [{ value: "5" }],
//       [{ value: "6" }],
//       [{ value: "7" }],
//       [{ value: "8" }],
//       [{ value: "9", colSpan: "2" }],
//     ];
//   } else {
//     return [[{ value: "1" }]];
//   }
// };

// export default function TabelLabel({ data }) {
//   const tableData = getstrukturTabel(data);
//   return (
//     <table
//       className="border-1"
//     >
//       <tbody>
//         {tableData.map((row, rowIndex) => (
//           <tr key={rowIndex}>
//             {row.map((cell, cellIndex) => (
//               <td
//                 key={cellIndex}
//                 colSpan={cell.colSpan || 1}
//                 rowSpan={cell.rowSpan || 1}
//                 style={{ textAlign: "center", padding: "10px" }}
//               >
//                 {cell.value}
//               </td>
//             ))}
//           </tr>
//         ))}
//       </tbody>
//     </table>

//   );
// }

import QRCode from "react-qr-code";
import logo from "../assets/PT_Menara_Terus_Makmur.jpg";
import Barcode from "react-barcode";
import moment from "moment-timezone";

const PDFTable = ({
  data,
  qty,
  code,
  // selectedDate,
  shift,
  staff,
  sequence,
  FirstSeq,
  pembagi,
}) => {
  if (!data || data.length === 0) return <p>Data tidak tersedia</p>;
  console.log(shift, staff, sequence, FirstSeq, pembagi);

  // const kolomSelected = data?.kolomSelected[0] || {};
  // console.log(data, 'kolom', selectedData)

  // const formatDate = (dateString) => {
  //   if (typeof dateString !== "string") {
  //     return dateString;
  //   }
  //   const date = new Date(dateString);
  //   const day = String(date.getDate()).padStart(2, "0");
  //   const month = date.toLocaleString("en-US", { month: "short" });
  //   const year = String(date.getFullYear()).slice(-2);
  //   return `${day}-${month}-${year}`;
  // };

  // const formatHeader = (key) => {
  //   return key.replace(/_/g, " ").toUpperCase();
  // };
  // console.log(
  //   Object.keys(data[0].data).map((kolom) => formatHeader(kolom)),
  //   "list"
  // );

  // const listKolom = Object.keys(data[0]).map((kolom) => formatHeader(kolom));

  const listKolom = [
    "PART NAME",
    "PART NO",
    "DN NUMBER",
    "QTY",
    "CUSTOMER NUMBER",
    "DELIVERY DATE",
    "SELECTEDDATA",
  ];
  // console.log(data, "Data", selectedData, typeof selectedData, listKolom);
  // const item = selectedData[0]
  // const matchedKolom = selectedData.map((i) => data.data[i]);

  return (
    <div className="flex flex-col flex-1/12 gap-2">
      {/* {data.kolomSelected.data.map((item, index) => { */}
      {/* {matchedKolom.map((dnNumber, index) => {
        const item = data.kolomSelected.data.find(
          (i) => i.dn_number === dnNumber.dn_number
        ); */}
      {Array.from({ length: sequence }, (_, idx) => {
        console.log(data[0].delivery_date, "tanggal");
        const currentSeq = parseInt(FirstSeq) + idx + 1;
        console.log(currentSeq, FirstSeq);
        const isNewPage = idx % 3 === 0 && idx !== 0;
        return (
          <table
            className="border-1 bg-white w-120 h-30 text-[10px]"
            style={{ marginTop: isNewPage ? "25mm" : "0mm" }}
          >
            <tr className="h-15">
              <th colSpan="2" className="w-auto align-middle">
                <div className="flex justify-center items-center h-full">
                  <img src={logo} loading="lazy" height="50px" width="150px" />
                </div>
              </th>
              <th colSpan="4" className="text-xs">
                IDENTIFIKASI BARANG
              </th>
            </tr>
            <tr>
              <td colspan="3">
                {listKolom[0]} : <br />{" "}
                <span className="block my-1 text-cenarrater font-normal">
                  {data[0][listKolom[0].toLowerCase().replace(/\s+/g, "_")]}
                </span>
              </td>
              <td colspan="1" className="text-center">
                {listKolom[3]} <br />{" "}
                <span className="block my-1 text-center font-normal">
                  {qty}
                </span>
              </td>
              <td colspan="2" rowspan="2">
                <QRCode
                  size={100}
                  style={{ margin: "auto" }}
                  value={`${code}|${Number(shift) + 1}|${
                    moment.tz(data[0].delivery_date, "Asia/Jakarta").isValid()
                      ? moment
                          .tz(data[0].delivery_date, "Asia/Jakarta")
                          .format("DDMMYY")
                      : ""
                  }|${String(currentSeq).padStart(4, "0")}`}
                  viewBox="0 0 100 100"
                />
              </td>
            </tr>
            <tr>
              <td colspan="2">
                {listKolom[1]} :{" "}
                <span className="block my-1 text-center font-normal">
                  {data[0][listKolom[1].toLowerCase().replace(/\s+/g, "_")]}{" "}
                </span>
              </td>
              <td colspan="2" className="">
                UNIQUE CODE{" "}
                <span className="block my-1 text-center font-normal text-[10px]">
                  {data[0].selectedData.split(pembagi)[0]}|{Number(shift) + 1}|
                  {moment
                    .tz(data[0].delivery_date || new Date(), "Asia/Jakarta")
                    .isValid()
                    ? moment
                        .tz(data[0].delivery_date || new Date(), "Asia/Jakarta")
                        .format("DDMMYY")
                    : ""}
                </span>
              </td>
            </tr>
            <tr>
              <td rowspan="2" colspan="2">
                {" "}
                {listKolom[4]} :
                <span className="block my-1 text-center font-normal">
                  {data[0][listKolom[4]?.toLowerCase().replace(/\s+/g, "_")]}{" "}
                </span>
              </td>
              <td colspan="2">DATE :</td>
              <td colspan="2">
                {" "}
                <span className="block my-1 text-center font-normal">
                  {/* {formatDate(
                    data[0][listKolom[5].toLowerCase().replace(/\s+/g, "_")]
                  )} */}
                  {moment
                    .tz(data[0].delivery_date || new Date(), "Asia/Jakarta")
                    .isValid()
                    ? moment
                        .tz(data[0].delivery_date || new Date(), "Asia/Jakarta")
                        .format("DD-MMM-YY")
                    : ""}
                </span>
              </td>
            </tr>

            <tr>
              <td colspan="2">SHIFT :</td>
              <td colspan="2">
                <div className="my-1 flex flex-row justify-between">
                  {[1, 2, 3].map((num, i) => (
                    <span
                      key={i}
                      className={`block mx-auto text-center font-normal px-1 ${
                        shift == i ? "border-1 border-black" : ""
                      }`}
                    >
                      {num}
                    </span>
                  ))}
                </div>
              </td>
            </tr>

            <tr>
              <td colspan="1">DITULIS OLEH :</td>

              <td rowspan="2" colSpan="4" className="relative">
                PRO :
                <Barcode
                  value={code}
                  className="w-[200px] h-[45px] absolute top-1/8 left-1/5"
                />
              </td>
            </tr>

            <tr>
              <td colspan="1" className="text-center h-[30px]">
                {staff ? staff.toUpperCase() : " "}
              </td>
            </tr>
          </table>
        );
      })}
    </div>
  );
};

export default PDFTable;

// import {
//   Page,
//   Text,
//   View,
//   Document,
//   StyleSheet,
//   Image,
//   PDFDownloadLink,
// } from "@react-pdf/renderer";

// import logo from "../assets/PT_Menara_Terus_Makmur.jpg";
// import { useEffect, useState } from "react";
// import QRCode from "react-qr-code";

// const styles = StyleSheet.create({
//   page: {
//     backgroundColor: "#fff",
//     padding: 10,
//     fontSize: 10,
//   },
//   section: {
//     border: "1px solid #000",
//     marginBottom: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     borderBottom: "1px solid #000",
//     padding: 5,
//   },
//   row: {
//     flexDirection: "row",
//     borderBottom: "1px solid #ccc",
//     padding: 4,
//   },
//   cell: {
//     flex: 1,
//     paddingHorizontal: 2,
//   },
//   qr: {
//     height: 60,
//     width: 60,
//     margin: "auto",
//   },
//   bold: {
//     fontWeight: "bold",
//   },
// });

// const formatDate = (dateString) => {
//   if (typeof dateString !== "string") return dateString;
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, "0");
//   const month = date.toLocaleString("en-US", { month: "short" });
//   const year = String(date.getFullYear()).slice(-2);
//   return `${day}-${month}-${year}`;
// };

// const formatHeader = (key) => key.replace(/_/g, " ").toUpperCase();

// const PDFTable = ({ data, selectedData, code, shift, staff, sequence }) => {
//   const [qrUrls, setQrUrls] = useState([]);
//   const item = selectedData[0];
//   console.log(selectedData, "kenapa");
//   const listKolom = Object.keys(selectedData[0]).map((kolom) =>
//     formatHeader(kolom)
//   );

//   useEffect(() => {
//     const generateQRCodes = async () => {
//       const urls = await Promise.all(
//         Array.from({ length: sequence }, (_, idx) => {
//           const currentSeq = parseInt(data.sequence) + idx + 1;
//           return (
//             <div>
//               <QRCode
//                 size={50}
//                 style={{ height: "auto" }}
//                 value={`${code}${currentSeq}`}
//                 viewBox={`0 0 256 256`}
//               />
//             </div>
//           );
//         })
//       );
//       setQrUrls(urls);
//     };
//     generateQRCodes();
//   }, [data.sequence, code, sequence]);

//   return (
//     <Document>
//       {Array.from({ length: sequence }, (_, idx) => {
//         const currentSeq = parseInt(data.sequence) + idx + 1;
//         return (
//           <Page size="A6" style={styles.page} key={idx}>
//             <View style={styles.section}>
//               <View style={styles.header}>
//                 <Image src={logo} style={{ width: 100 }} />

//                 <Text>IDENTIFIKASI BARANG FINISHED GOOD</Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={styles.cell}>{listKolom[0]}:</Text>
//                 <Text style={styles.cell}>
//                   {item[listKolom[0].toLowerCase().replace(/\s+/g, "_")]}
//                 </Text>
//                 <Text style={[styles.cell, { flex: 2 }]}>{listKolom[1]}:</Text>
//                 <Text style={styles.cell}>
//                   {item[listKolom[1].toLowerCase().replace(/\s+/g, "_")]}
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={styles.cell}>{listKolom[2]}:</Text>
//                 <Text style={styles.cell}>
//                   {item[listKolom[2].toLowerCase().replace(/\s+/g, "_")]}
//                 </Text>
//                 <Text style={styles.cell}>UNIQUE CODE:</Text>
//                 <Text style={styles.cell}>{code}</Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={[styles.cell, { flex: 2 }]}>{listKolom[3]}:</Text>
//                 <Text style={[styles.cell, { flex: 4 }]}>
//                   {item[listKolom[3].toLowerCase().replace(/\s+/g, "_")]}
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={styles.cell}>Seq. No.:</Text>
//                 <Text style={styles.cell}>{currentSeq}</Text>
//                 <Text style={styles.cell}>{listKolom[5]}:</Text>
//                 <Text style={styles.cell}>
//                   {formatDate(
//                     item[listKolom[5].toLowerCase().replace(/\s+/g, "_")]
//                   )}
//                 </Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={styles.cell}>DITULIS OLEH:</Text>
//                 <Text style={[styles.cell, { flex: 4 }]}>SHIFT: {shift}</Text>
//               </View>
//               <View style={styles.row}>
//                 <Text style={styles.cell}>{staff?.toUpperCase() || " "}</Text>
//                 {qrUrls[idx] && <Image style={styles.qr} src={qrUrls[idx]} />}
//               </View>
//             </View>
//           </Page>
//         );
//       })}
//     </Document>
//   );
// };

// export const PDFDownload = (props) => (
//   <PDFDownloadLink
//     document={<PDFTable {...props} />}
//     fileName={`${props.code}_label.pdf`}
//   >
//     {({ loading }) => (loading ? "Loading..." : "Download PDF")}
//   </PDFDownloadLink>
// );

// export default PDFTable;
