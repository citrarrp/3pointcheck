import React, { useState } from "react";
import * as XLSX from "xlsx";
import moment from "moment-timezone";
import { useEffect } from "react";
import DeleteField from "./deleteData";
import api from "../utils/api";
import axios from "axios";

function Excel() {
  const [fileName, setFileName] = useState("");
  const [excelHeaders, setExcelHeaders] = useState([]);
  const [excelData, setExcelData] = useState([]);
  const [mapping, setMapping] = useState({});
  const [selectedColumns, setSelectedColumns] = useState(["job_no"]);
  const [schemaFields, setSchemaFields] = useState([]);
  const [newSchemaLabel, setNewSchemaLabel] = useState("");
  const [showSchemaForm, setShowSchemaForm] = useState(false);
  const [showTabel, setShowTabel] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(""); // Untuk memilih customer
  const [separator, setSeparator] = useState("");
  const [customerList, setCustomerList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [kanban, setKanban] = useState(true);
  const [sheetNames, setSheetNames] = useState([]);
  const [selectedSheet, setSelectedSheet] = useState(null);

  const fetchSchemaFields = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fields`);
      const data = await res.json();
      setSchemaFields(data);
    } catch (err) {
      console.error("Failed to fetch schema fields:", err);
    }
  };

  const fetchSODDiagram = async () => {
    try {
      const response = await axios.get(
        "http://192.168.56.1:3000/sodDiagram/api/sod/",
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response.data.data;
    } catch (err) {
      console.error("Failed to fetch SOD Diagram:", err);
      return null;
    }
  };

  useEffect(() => {
    fetchSchemaFields();
  }, []);

  const handleAddSchemaClick = () => {
    setShowSchemaForm(true);
  };

  const handleSubmitNewSchema = async (e) => {
    e.preventDefault();
    const label = newSchemaLabel.trim();
    const value = label.toLowerCase().replace(/\s+/g, "_");
    if (!label) return;

    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/fields`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label, value }),
      });
    } catch (err) {
      console.error("Failed to append schema:", err);
    }

    setShowSchemaForm(false);
    setNewSchemaLabel("");
    await fetchSchemaFields();
  };

  const extractColon = (str) => {
    if (typeof str !== "string") {
      return str;
    }
    return str.includes(":") ? str.split(":").slice(1).join(":").trim() : str;
  };
  // const handleFileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
  //   setFileName(nameWithoutExt);

  //   const customers = nameWithoutExt.split("&").map((name) => name.trim());

  //   setCustomerList(customers);

  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     const data = e.target.result;
  //     const sheets = XLSX.read(data, { type: "binary", cellDates: true });

  //     const sheetName = sheets.SheetNames[0];
  //     const sheet = sheets.Sheets[sheetName];

  //     const secondSheetName = sheets.SheetNames[1]; // index 1 = sheet kedua
  //     const sheet2 = sheets.Sheets[secondSheetName];

  //     const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
  //     const columns = jsonData[0];
  //     const rows = XLSX.utils.sheet_to_json(sheet);

  //     setExcelHeaders(columns);
  //     setExcelData(rows);
  //     setShowTabel(true);
  //   };
  //   reader.readAsBinaryString(file);
  // };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
    setFileName(nameWithoutExt);

    const customers = nameWithoutExt.split("&").map((name) => name.trim());
    setCustomerList(customers);

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      const workbook = XLSX.read(data, { type: "binary", cellDates: true });

      setSheetNames(workbook.SheetNames); // simpan semua nama sheet
      setSelectedSheet(null); // reset pilihan sebelumnya

      // Simpan workbook untuk dipakai setelah sheet dipilih
      setTimeout(() => {
        window.__xlsWorkbook = workbook; // kamu bisa juga pakai state kalau tidak pakai global
      }, 0);
    };
    reader.readAsBinaryString(file);
  };

  const findHeaderRowIndex = (data) => {
    for (let i = 0; i < data.length; i++) {
      const row = data[i];
      const isLikelyHeader =
        row &&
        row.length > 2 &&
        row.every((cell) => typeof cell === "string" && cell.trim() !== "");

      if (isLikelyHeader) {
        return i;
      }
    }
    return 0; // fallback: baris pertama
  };

  const handleSheetSelection = (sheetName) => {
    const workbook = window.__xlsWorkbook;
    if (!workbook) return;

    const sheet = workbook.Sheets[sheetName];
    const rawData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    //   const filteredData = excelData.filter((row) => {
    //   return (
    //     row[selectedCustomer] && String(row[selectedCustomer]).trim() !== ""
    //   );
    // });
    const headerRowIndex = findHeaderRowIndex(rawData);
    const headers = rawData[headerRowIndex];
    const rows = rawData.slice(headerRowIndex + 1);

    // ubah array of array jadi array of object, pakai headers

    const structuredRows = rows
      .filter((row) =>
        headers.some((_, idx) => row[idx] !== undefined && row[idx] !== null)
      )
      .map((row) => {
        const obj = {};
        headers.forEach((header, idx) => {
          obj[header] = row[idx];
        });
        return obj;
      });
    setExcelHeaders(headers);
    setExcelData(structuredRows);
    setShowTabel(true);
  };

  // const handleColumnSelection = (event) => {
  // const columnName = event.target.value;
  // setSelectedColumns((prevState) => {
  //   if (prevState.includes(columnName)) {
  //     return prevState.filter((col) => col !== columnName);
  //   } else {
  //     return [...prevState, columnName];
  //   }
  // });
  // };

  // const handleColumnSelection = (value, selectedHeader) => {
  //   const data = excelData.map((row) => row[selectedHeader]);
  //   setSelectedColumns((prev) => ({
  //     ...prev,
  //     [value]: data,
  //   }));
  // };

  const ColumnSelection = (column) => {
    setSelectedColumns((prev) =>
      prev.includes(column)
        ? prev.filter((i) => i !== column)
        : [...prev, column]
    );
  };

  const handleSeparatorChange = (e) => {
    setSeparator(e.target.value);
  };

  const resetAllStates = () => {
    setFileName("");
    setExcelData([]);
    setExcelHeaders([]);
    setMapping({});
    setSelectedCustomer("");
    setSelectedColumns([]);
    setSeparator("");
    setSearchTerm("");
    setShowTabel(false);
    setNewSchemaLabel("");
    setShowSchemaForm(false);
    setSelectedSheet("");
    setSheetNames([]);
  };
  const handleSubmit = async () => {
    try {
      // const allCustomers = Array.from(
      //   excelData.map((row) => row[selectedCustomer]).filter(Boolean)
      // );
      const filteredData = excelData.filter((row) => {
        return (
          row[selectedCustomer] && String(row[selectedCustomer]).trim() !== ""
        );
      });

      // const seenCustomers = new Set();
      // const filteredData = excelData.filter((row) => {
      //   const customer = String(row[selectedCustomer] ?? "").trim();
      //   if (!customer || seenCustomers.has(customer)) return false;
      //   seenCustomers.add(customer);
      //   return true;
      // });

      const groupedByCustomer = filteredData.reduce((acc, row) => {
        const customerRaw = String(row[selectedCustomer]);
        const customer = customerRaw
          .replace(/[ \-_/]/g, " ")
          .trim()
          .toLowerCase(); //
        if (!acc[customer]) acc[customer] = [];
        acc[customer].push(row);
        return acc;
      }, {});

      const promises = Object.entries(groupedByCustomer).map(
        async ([customer, _]) => {
          const dataSOD = await fetchSODDiagram();
          const filteredDataSOD = dataSOD.filter((item) => {
            const cleanCustomer = customer
              .replace(/[ \-_/]/g, " ")
              .toLowerCase();
            const cleanCustomerName = item.customerName
              .replace(/[ \-_/]/g, " ")
              .toLowerCase();

            return cleanCustomer.includes(cleanCustomerName);
          });

          const formatValue = (val) => {
            if (val instanceof Date && !isNaN(val)) {
              return moment(val).tz("Asia/Jakarta").format("DDMMYYYY");
            }

            const parsedDate = moment.tz(
              val,
              ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
              true,
              "Asia/Jakarta"
            );
            if (parsedDate.isValid()) {
              return parsedDate.format("DDMMYY");
            }

            return val ?? "";
          };

          // const selectedData = filteredData
          //   .filter(
          //     (row, index) =>
          //       row[selectedCustomer].replace(/[ \-_/]/g, " ").toLowerCase() ===
          //       customer.replace(/[ \-_/]/g, " ").toLowerCase()
          //   )
          const selectedData = Object.entries(groupedByCustomer)
            .filter(([customerName, _]) => {
              const lowerName = customerName
                .replace(/[ \-_/]/g, " ")
                .toLowerCase();
              const lowerCustomer = customer
                .replace(/[ \-_/]/g, " ")
                .toLowerCase();

              return (
                lowerName.includes(lowerCustomer) ||
                lowerCustomer.includes(lowerName)
              );
            })
            .map(([_, row]) => {
              return (
                selectedColumns
                  .filter((_, index) => {
                    return (index + 1) % 2 === 0;
                  })
                  .map((col) =>
                    row.map((dataRow) =>
                      extractColon(formatValue(String(dataRow[String(col)])))
                    )
                  )
                  // row.map((dataRow) => {
                  //   console.log(
                  //     dataRow,
                  //     dataRow["Job No"],
                  //     String(dataRow[String(col)]),

                  //     "nilai kolom"
                  //   );

                  //   return extractColon(formatValue(  String(dataRow[String(col)])));
                  // });
                  // })
                  .join(separator)
              );
              //   console.log(col, formatValue(row[col]), "nilai");
              //   return formatValue(row[col]);
              // })
              // .map((value) => {
              //   console.log(value);
              //   return extractColon(value);
              // })
            });

          const sourceLabelMapping = {};
          Object.entries(mapping).forEach(([schema, excelCol]) => {
            if (excelCol) {
              sourceLabelMapping[schema] = excelCol;
            }
          });

          // console.log(filteredData, selectedData, "data filter");

          const kolomSelected = Object.entries(groupedByCustomer).map(
            ([customerName, rows]) => {
              const mappedRows = rows.map((row) => {
                const obj = Object.entries(mapping).reduce(
                  (acc, [schema, excelCol]) => {
                    let val = row[excelCol] ?? "";
                    if (typeof val === "string" && val.includes(":")) {
                      val = val.split(":")[1].trim();
                    }
                    acc[schema] = extractColon(val);
                    return acc;
                  },
                  {}
                );

                obj["delivery_cycle"] = obj["delivery_cycle"]
                  ? obj["delivery_cycle"]
                  : 1;

                const qty = parseFloat(obj["qty"]);
                obj["qty"] = parseInt(obj["qty"]);
                const orderPcs = parseFloat(obj["order_(pcs)"]);
                obj["order_(pcs)"] = parseInt(obj["order_(pcs)"]);

                obj["qtyKanban"] =
                  !isNaN(qty) && qty !== 0 && !isNaN(orderPcs)
                    ? Math.round(orderPcs / qty)
                    : 1;

                return obj;
              });

              return {
                customerName,
                data: mappedRows, // hasilnya dalam bentuk array per customer
              };
            }
          );

          // Object.entries(mapping).reduce((mappedRow, [schema, excelCol]) => {
          //   let val = rows[excelCol] ?? null;

          //   if (typeof val === "string" && val.includes(":")) {
          //     val = val.split(":")[1]?.trim() ?? val;
          //   }

          //   console.log(filteredData, "CUSTOMER DATA ALL");

          //   mappedRow[schema] = extractColon(val);
          //   console.log(mappedRow, schema, val, "excelDaat");
          //   return mappedRow;
          // }, {})

          const uniqueCustomerValues = [
            ...new Set(
              excelData.map((row) => row[selectedCustomer]).filter(Boolean) // buang undefined/null
            ),
          ];

          const mappedPartNo = excelData.map(
            (item) => item[mapping["part_no"]] || item[mapping["material"]]
          );

          const uniquePartName = [
            ...new Set(mappedPartNo.filter(Boolean)),
          ].reduce((acc, key) => {
            acc[key] = 0;
            return acc;
          }, {});

          // console.log(
          //   uniquePartName,
          //   mappedPartNo,
          //   mapping,
          //   excelData,
          //   excelData.map((item) => item[mapping["part_no"]]),
          //   "ini"
          // );

          const customerName = uniqueCustomerValues.find((name) => {
            // console.log(name, customer, "customer");
            if (!name || !customer) return false;

            const lowerName = name.replace(/[ \-_/]/g, " ").toLowerCase();
            const lowerCustomer = customer
              .replace(/[ \-_/]/g, " ")
              .toLowerCase();

            return (
              lowerName.includes(lowerCustomer) ||
              lowerCustomer.includes(lowerName)
            );
          });

          // console.log("selectedCustomer:", selectedCustomer);
          // console.log("contoh row:", excelData[0]);

          const payload = {
            nama: customerName.replace(/[ \-_/]/g, " ").toUpperCase(),
            kolomSelected:
              kolomSelected.find(
                (data) =>
                  data.customerName ===
                  customerName.replace(/[ \-_/]/g, " ").toLowerCase()
              )?.data ?? [],
            selectedData,
            sourceValueLabel: sourceLabelMapping,
            separator,
            selectedColumns,
            selectedCustomer,
            uniquePartName,
            tracking: filteredDataSOD,
            kanban: kanban,
          };

          const res = await fetch(
            `${import.meta.env.VITE_BACKEND_URL}/api/data/`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            }
          );

          const result = await res.json();
          return result;
        }
      );
      const results = await Promise.all(promises);
      if (results.success) alert("Berhasil Menambahkan Data!");

      resetAllStates();
    } catch (err) {
      console.error(err);
      alert("Error Submitting Data");
    }
  };

  const handleDelete = async (id) => {
    const confirmation = window.confirm(
      "Apakah Anda yakin ingin menghapus user ini?"
    );
    if (!confirmation) return;

    try {
      const data = await api.delete(`/fields/${id}`);
      if (data.data.success) {
        setNewSchemaLabel("");
        await fetchSchemaFields();
        return { success: true, message: "Field berhasil dihapus!" };
      } else {
        return {
          success: false,
          message: data.message || "Gagal mengambil data!",
        };
      }
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Gagal menghapus user",
      };
    }
  };

  // const kolomSelected = excelData.map((row) => {
  //   const mappedRow = {};
  //   for (const [schema, excelCol] of Object.entries(mapping)) {
  //     mappedRow[schema] = excelCol ? row[excelCol] ?? null : null;
  //   }
  //   return mappedRow;
  // });

  // const kolomSelected = customerNames.map((customer) => {
  //   return excelData.map((row) => {
  //     const mappedRow = {};
  //     for (const [schema, excelCol] of Object.entries(mapping)) {
  //       mappedRow[schema] = excelCol ? row[excelCol] ?? null : null;
  //     }
  //     return mappedRow;
  //   });
  // });

  // const formatValue = (val) => {
  //   if (val instanceof Date && !isNaN(val)) {
  //     return moment(val).tz("Asia/Jakarta").format("DDMMYYYY");
  //   }

  //   const parsedDate = moment.tz(
  //     val,
  //     ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
  //     true,
  //     "Asia/Jakarta"
  //   );
  //   if (parsedDate.isValid()) {
  //     return parsedDate.format("DDMMYYYY");
  //   }

  //   return val ?? "";
  // };

  // const selectedData = excelData.map((row) =>
  //   selectedColumns.map((col) => formatValue(row[col])).join("-")
  // );
  // console.log(selectedData, selectedColumns);
  // {
  //   selectedData.length > 0 && (
  //     <div className="mt-4">
  //       <h3 className="font-semibold">Preview Kode Unik:</h3>
  //       <ul className="list-disc ml-5">
  //         {selectedData.slice(0, 5).map((kode, idx) => (
  //           <li key={idx}>{kode}</li>
  //         ))}
  //       </ul>
  //     </div>
  //   );
  // }

  // const payload = {
  //   nama: fileName.toUpperCase(),
  //   kolomSelected,
  //   selectedData,
  // };
  // console.log(payload);
  // try {
  //   const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/`, {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   });

  //   const result = await res.json();
  //   console.log(payload, "payload");
  //   alert("success: " + JSON.stringify(result));
  // } catch (err) {
  //   console.error(err);
  //   alert("Error Submitting Data");
  // }
  // };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-2">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-md cursor-pointer bg-blue-50 hover:bg-blue-100 transition-colors duration-200"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-[#2c64c7]"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <h1 className="mb-2 text-xl text-gray-700 font-semibold">
              <span className="text-blue-400">Click to upload</span> or drag and
              drop
            </h1>
            <p className="text-lg text-gray-500">.xlsx atau .xls (Max. )</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept=".xlsx, .xls, .xlsm"
          />
        </label>

        {fileName && (
          <div className="mt-4 py-2 px-4 bg-blue-50 rounded-lg">
            <p className="py-5 text-lg">
              Nama File:{" "}
              <span className="font-bold text-[#2c64c7]">
                {fileName.toUpperCase()}
              </span>
            </p>
          </div>
        )}

        {sheetNames.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <label
              htmlFor="sheet-select"
              className="block text-lg font-medium text-gray-600 mb-2"
            >
              Pilih Sheet:
            </label>
            <select
              id="sheet-select"
              onChange={(e) => {
                const name = e.target.value;
                setSelectedSheet(name);
                handleSheetSelection(name);
              }}
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
            >
              <option value=""> Pilih </option>
              {sheetNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
        )}

        {sheetNames.length > 0 && customerList.length > 1 && (
          <div className="mb-8 px-6 bg-gray-50 rounded-lg">
            <label className="block text-lg font-medium text-gray-600 mb-2">
              Pilih Customer:
            </label>
            <select
              className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
            >
              <option value="">Pilih Customer</option>
              {excelHeaders.length > 0 &&
                excelHeaders.map((column, idx) => (
                  <option key={idx} value={column}>
                    {column}
                  </option>
                ))}
            </select>
          </div>
        )}

        {showTabel && selectedSheet && (
          <div className="overflow-hidden  border border-gray-200 shadow-sm mt-10">
            <div className="overflow-x-auto max-w-full h-[300px]">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    {excelHeaders.map((header, idx) => (
                      <th
                        key={idx}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {header}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {excelData.map((row, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      {excelHeaders.map((header, colIndex) => (
                        <td
                          key={colIndex}
                          className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                        >
                          {row[header] !== undefined
                            ? row[header].toString()
                            : ""}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showTabel && excelHeaders.length > 0 && (
          <div className="mb-8 p-6 bg-gray-50 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Pilih Kolom
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {schemaFields.data.map((schema, idx) => (
                <div key={idx} className="bg-white p-4 rounded-lg shadow-sm">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {schema.label}
                  </label>
                  <select
                    className="w-full p-2 border-2 border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                    value={mapping[schema.value] || ""}
                    onChange={(e) =>
                      setMapping((prev) => ({
                        ...prev,
                        [schema.value]:
                          (schema.value === "delivery_cycle" &&
                            e.target.value == null) ||
                          undefined ||
                          e.target.value === ""
                            ? 1
                            : e.target.value,
                      }))
                    }
                  >
                    <option value="">Pilih Field</option>
                    {excelHeaders.map((column, index) => (
                      <option key={index} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                  <DeleteField successDelete={() => handleDelete(schema._id)} />
                </div>
              ))}
            </div>

            <div className="mt-6">
              {!showSchemaForm ? (
                <button
                  className="flex items-center gap-2 bg-[#105bdf] text-white px-4 py-2 rounded hover:bg-[#2c64c7]"
                  onClick={handleAddSchemaClick}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Tambah Field Baru
                </button>
              ) : (
                <div className="bg-white p-4 rounded-md shadow-sm mt-4">
                  <h4 className="text-lg fotn-medium text-gray-700 mb-2">
                    Tambah Field Baru
                  </h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Masukkan label schema"
                      className="flex-1 p-2 border-2 border-gray-300 rounded-md focus:ring-blue-400 focus:border-blue-400"
                      value={newSchemaLabel}
                      onChange={(e) => setNewSchemaLabel(e.target.value)}
                    />
                    <button
                      type="submit"
                      className=" bg-[#27b387] text-white px-4 py-2 rounded-md hover:bg-[#1d8665] transition-colors"
                      onClick={handleSubmitNewSchema}
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {showTabel && (
          <div>
            <div className="mb-6 p-4 bg-gray-50">
              <h3 className="text-gray-700 font-medium text-lg mb-2 block">
                3 Point Check
              </h3>

              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="agreement"
                    className="peer hidden"
                    onChange={() => setKanban(false)}
                    value={false}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 border-emerald-500 flex items-center justify-center mr-2
                    peer-checked:border-emerald-600 peer-checked:bg-emerald-500 transition-all"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-gray-600 peer-checked:text-emerald-600 font-medium transition-colors">
                    Tidak ada Kanban
                  </span>
                </label>

                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="agreement"
                    className="peer hidden"
                    onChange={() => setKanban(true)}
                    value={true}
                  />
                  <div
                    className="w-5 h-5 rounded-full border-2 border-rose-500 flex items-center justify-center mr-2
                    peer-checked:border-rose-600 peer-checked:bg-rose-500 transition-all"
                  >
                    <div className="w-2.5 h-2.5 rounded-full bg-white scale-0 peer-checked:scale-100 transition-transform"></div>
                  </div>
                  <span className="text-gray-600 peer-checked:text-rose-600 font-medium transition-colors">
                    Ada Kanban
                  </span>
                </label>
              </div>
            </div>

            <div className="mb-8">
              <div>
                {kanban && (
                  <div className="mb-6 p-4 bg-gray-50">
                    <label className="block text-lg font-medium text-gray-700 mb-2">
                      Pilih Pemisah Data:
                    </label>
                    <input
                      type="text"
                      className="p-2 border-2 border-gray-300 rounded-md max-w-xs"
                      value={separator}
                      placeholder="Karakter :, ;, |"
                      onChange={handleSeparatorChange}
                    />
                  </div>
                )}
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800">
                      Pilih Kode Unik
                    </h2>

                    <div className="relative w-full sm:w-xl">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg
                          className="h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        placeholder="Cari kolom..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {excelHeaders
                      .filter((col) => {
                        return col
                          .toLowerCase()
                          .includes(searchTerm.toLowerCase());
                      })
                      .map((col, idx) => (
                        <div
                          key={idx}
                          className={`p-3 rounded-md border transition-all ${
                            selectedColumns.includes(col)
                              ? "border-blue-300 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <label className="flex items-center space-x-2 cursor-pointer">
                            <input
                              className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-400 "
                              type="checkbox"
                              checked={selectedColumns.includes(col)}
                              onChange={() => ColumnSelection(col)}
                            />
                            <span
                              className="text-sm font-medium text-gray-700 truncate"
                              title={col}
                            >
                              {col}
                            </span>
                          </label>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mt-3">
          <button
            className="inline-flex  cursor-pointer px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm bg-[#2c64c7] text-white hover:bg-[#105bdf] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2c64c7] transition-colors"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}

export default Excel;
//   const [fileName, setFileName] = useState("");
//   const [excelHeaders, setExcelHeaders] = useState([]);
//   const [excelData, setExcelData] = useState([]);
// const [mapping, setMapping] = useState({});
// const [selectedColumns, setSelectedColumns] = useState([]);
// const [schemaFields, setSchemaFields] = useState([]);

//   const handleFileUpload = (event) => {
//     const file = event.target.files[0];
//     if (!file) return;

//     const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf("."));
//     setFileName(nameWithoutExt);
//     console.log(nameWithoutExt);

//     const reader = new FileReader();
//     reader.onload = (e) => {
//       const data = e.target.result;
//       const sheets = XLSX.read(data, { type: "binary", cellDates: true });

//       const sheetName = sheets.SheetNames[0];
//       const sheet = sheets.Sheets[sheetName];

//       const jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
//       const columns = jsonData[0];
//       const rows = XLSX.utils.sheet_to_json(sheet);

//       setExcelHeaders(columns);
//       setExcelData(rows);
//     };
//     reader.readAsBinaryString(file);
//   };

// const handleColumnSelection = (event) => {
//   const columnName = event.target.value;
//   setSelectedColumns((prevState) => {
//     if (prevState.includes(columnName)) {
//       return prevState.filter((col) => col !== columnName);
//     } else {
//       return [...prevState, columnName];
//     }
//   });
// };

//   const handleAppendSchema = async () => {
//     const newSchema = { label: "", value: "" };

//     try {
//       const res = await fetch(
//         `${import.meta.env.VITE_BACKEND_URL}/api/fields`,
//         {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newSchema),
//         }
//       );
//       const data = await res.json();
//       setSchemaFields((prev) => [...prev, data]);
//     } catch (err) {
//       console.error("Failed to append schema:", err);
//     }
//   };

// const MappingColumnChange = (excelCol, schemaVal) => {
//   setMapping((prev) => ({ ...prev, [excelCol]: schemaVal }));
// };

// const ColumnSelection = (column) => {
//   setSelectedColumns((prev) =>
//     prev.includes(column)
//       ? prev.filter((i) => i !== column)
//       : [...prev, column]
//   );
// };

// const handleSubmit = async () => {
//   const kolomSelected = excelData.map((row) => {
//     const mappedRow = {};
//     for (const [schema, excelCol] of Object.entries(mapping)) {
//       mappedRow[schema] = row[excelCol] || "";
//     }
//     return mappedRow;
//   });

//   const formatValue = (val) => {
//     if (val instanceof Date && !isNaN(val)) {
//       return moment(val).tz("Asia/Jakarta").format("DDMMYYYY");
//     }

//     const parsedDate = moment.tz(
//       val,
//       ["DD/MM/YYYY", "YYYY-MM-DD", moment.ISO_8601],
//       true,
//       "Asia/Jakarta"
//     );
//     if (parsedDate.isValid()) {
//       return parsedDate.format("DDMMYYYY");
//     }

//     return val;
//   };

//   const selectedData = excelData.map((row) =>
//     selectedColumns.map((col) => formatValue(row[col])).join("-")
//   );
//   console.log(selectedData, selectedColumns);
//   {
//     selectedData.length > 0 && (
//       <div className="mt-4">
//         <h3 className="font-semibold">Preview Kode Unik:</h3>
//         <ul className="list-disc ml-5">
//           {selectedData.slice(0, 5).map((kode, idx) => (
//             <li key={idx}>{kode}</li>
//           ))}
//         </ul>
//       </div>
//     );
//   }

//   const payload = {
//     nama: fileName,
//     kolomSelected,
//     selectedData,
//   };
//   try {
//     const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data/`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(payload),
//     });

//     const result = await res.json();
//     console.log(payload, "payload");
//     alert("success: " + JSON.stringify(result));
//   } catch (err) {
//     console.eror(err);
//     alert("Error Submitting Data");
//   }
// };
// console.log(excelData, excelHeaders);

//   return (
//     <div className="flex-row items-center justify-center w-full">
//       <label
//         for="dropzone-file"
//         className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
//       >
//         <div className="flex flex-col items-center justify-center pt-5 pb-6">
//           <svg
//             className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
//             aria-hidden="true"
//             xmlns="http://www.w3.org/2000/svg"
//             fill="none"
//             viewBox="0 0 20 16"
//           >
//             <path
//               stroke="currentColor"
//               stroke-linecap="round"
//               stroke-linejoin="round"
//               stroke-width="2"
//               d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
//             />
//           </svg>
//           <h1 className="mb-2 text-xl text-gray-700">
//             <span className="font-semibold">Click to upload</span> or drag and drop
//           </h1>
//           <p className="text-lg text-gray-500 dark:text-gray-400">
//             .xlsx atau .xls (Max. )
//           </p>
//         </div>
//         <input
//           id="dropzone-file"
//           type="file"
//           className="hidden"
//           onChange={handleFileUpload}
//           accept=".xlsx, .xls"
//         />
//       </label>
//       <p className="py-5 text-base/6">
//         Nama Customer:{" "}
//         <span className="font-bold text-blue-700">
//           {fileName.toUpperCase()}
//         </span>
//       </p>

//       {excelHeaders.length > 0 && (
//         <div>
//           <p className="text-xl font-semibold">Pilih Kolom</p>
//           <div className=" text-lg flex flex-col space-y-3">
//             {schemaFields.map((schema, idx) => (
//               <div key={idx}>
//                 <label className="flex gap-4">
//                   {schema.label}

//                   <select
//                     className="p-1 border-2 border-gray-300 rounded-md "
//                     value={mapping[schema.value] || ""}
//                     onChange={(e) =>
//                       MappingColumnChange(schema.value, e.target.value)
//                     }
//                   >
//                     <option value="">Pilih Field</option>
//                     {excelHeaders.map((column, index) => (
//                       <option key={index} value={column}>
//                         {column}
//                       </option>
//                     ))}
//                   </select>
//                 </label>
//               </div>
//             ))}
//           </div>

//           <button
//             className="mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
//             onClick={handleAppendSchema}
//           >
//             Tambah Schema Baru
//           </button>

//           <h2 className="text-xl font-semibold mt-6 mb-2">Pilih Kode Unik</h2>

//           <div className="flex flex-wrap gap-4 mb-4">
//             {excelHeaders.map((col, idx) => (
//               <label key={idx} className="flex items-center space-x-2">
//                 <input
//                   type="checkbox"
//                   checked={selectedColumns.includes(col)}
//                   onChange={() => ColumnSelection(col)}
//                 />
//                 <span>{col}</span>
//               </label>
//             ))}
//           </div>

//           <div className="overflow-x-auto max-w-full">
//             <table className="table-auto border w-full text-left text-sm">
//               <thead>
//                 <tr>
//                   <th className="border p-2">No</th>
//                   {excelHeaders.map((header, idx) => (
//                     <th key={idx} className="border p-2">
//                       {header}
//                     </th>
//                   ))}
//                 </tr>
//               </thead>
//               <tbody>
//                 {excelData.map((row, index) => (
//                   <tr key={index}>
//                     <td className="border p-2">{index + 1}</td>
//                     {excelHeaders.map((header, colIndex) => (
//                       <td key={colIndex} className="border p-2">
//                         {row[header] !== undefined
//                           ? row[header].toString()
//                           : ""}
//                       </td>
//                     ))}
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>

//           <button
//             className="mt-6 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//             onClick={handleSubmit}
//           >
//             Submit
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }

// export default Excel;
