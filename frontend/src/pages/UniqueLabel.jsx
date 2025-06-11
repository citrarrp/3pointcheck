import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import LabelContext from "../context/label";
import Breadcrumb from "../components/breadCrumb";
import moment from "moment-timezone";
import DatePicker from "react-datepicker";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6";

export default function UniqueCodePage() {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [data, setData] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filteredData, setFilteredData] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/data`);
      const Data = await res.json();
      setData(Data.data);
      console.log("Data", Data);
    } catch (err) {
      console.log("ini");
      console.error("Failed to fetch schema fields:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const { dataLabel } = useContext(LabelContext);
  console.log(data.find((item) => item._id === customerId, data, "data"));
  // const selected =
  //   data.find((item) => item._id === customerId)?.kolomSelected.data
  //     .part_name || [];
  // const uniqueCode = [...new Set(selected)];

  // console.log(uniqueCode);

  const customer = data.find((item) => item._id === customerId);
  const kolomData = useMemo(() => customer?.kolomSelected || [], [customer]);

  const dates = useMemo(() => {
    const uniqueDates = [];
    kolomData.forEach((row) => {
      // item.data.forEach((dataItem) => {
      const data = row.data;
      for (const item in data) {
        if (item.delivery_date && !uniqueDates.includes(item.delivery_date)) {
          uniqueDates.push(item.delivery_date);
        }
      }
    });
    return uniqueDates;
  }, [kolomData]);

  const highlightDates = useMemo(() => {
    return dates.map((date) => new Date(date));
  }, [dates]);

  const dayClassName = (date) => {
    const hasData = highlightDates.some((d) => moment(d).isSame(date, "day"));
    const isSelected = selectedDate && moment(selectedDate).isSame(date, "day");
    const isDisabled = date > new Date();
    let classes = "rounded-full";

    if (isDisabled) {
      classes += "text-gray-400 cursor-not-allowed";
    } else if (isSelected) {
      classes += "bg-blue-600 text-white";
    } else if (hasData) {
      classes += "bg-blue-100 text-blue-800 font-medium";
    } else {
      classes += "hover:bg-gray-100";
    }
    return classes;
  };

  const handleClickDate = (Date) => {
    setSelectedDate(Date);
    const newFilteredData = kolomData.flatMap((item) => {
      return item.data
        .filter((row) => {
          console.log(
            row,
            "row",
            moment(row.delivery_date).format("YYYY-MM-DD"),
            moment(selectedDate).format("YYYY-MM-DD")
          );
          return (
            moment(row.delivery_date).format("YYYY-MM-DD") ===
              moment(Date).format("YYYY-MM-DD") &&
            moment(row.delivery_date).isSame(Date, "day")
          );
        })
        .map((dataItem) => {
          const selectedIndex = item.data.findIndex((d) => d === dataItem);
          return {
            ...dataItem,
            selectedData: item.selectedData[selectedIndex],
          };
        });
    });

    console.log(
      newFilteredData,
      selectedDate,
      selectedDate === "2025-05-01T14:08:46.535Z",
      "contoh"
    );
    setFilteredData(newFilteredData);
  };

  console.log("KolomData:", kolomData, filteredData);

  // const filteredData = selectedDate
  //   ? kolomData.flatMap((item) =>
  //       item.data.filter(
  //         (dataItem) =>
  //           (dataItem.delivery_date === selectedDate ||
  //             dataItem.order_date === selectedDate ||
  //             item.createdAt === selectedDate) &&
  //           dataItem.part_no == uniqueCode
  //       )
  //     )
  //   : [];

  // const filteredData = kolomData.flatMap((item) =>
  //   item.data
  //     .filter((dataItem) => dataItem.part_no === uniqueCode && item.createdAt === selectedDate)
  //     .map((dataItem) => {
  //       const selectedIndex = item.data.findIndex((d) => d === dataItem);
  //       return {
  //         ...dataItem,
  //         selectedData: item.selectedData[selectedIndex],
  //         // sequence: item.sequence[uniqueCode]
  //       };
  //     })
  // );
  const calculateQuantity = (filteredData) => {
    const totalQty = filteredData.reduce((acc, item) => {
      if (!acc[item.dn_number]) {
        acc[item.dn_number] = { totalQty: 0, items: [] };
      }
      acc[item.dn_number].totalQty += item.qty;
      acc[item.dn_number].items.push(item);
      return acc;
    }, {});

    console.log(totalQty, "ttoal");

    const result = Object.keys(totalQty).map((dnNumber) => {
      console.log(dnNumber, "RESULT");
      const dnData = totalQty[dnNumber];
      const total = dnData.totalQty;
      const itemCount = dnData.items.length;
      return total / itemCount;
    });

    return result;
  };

  // const uniqueParts = kolomData.reduce((acc, item) => {
  //   item.data.forEach(part => {
  //     const exists = acc.find(p => p.part_name === part.part_name);
  //     if (!exists) {
  //       acc.push({
  //         part_name: part.part_name,
  //         part_code: part.part_code,
  //         createdAt: item.createdAt,
  //       });
  //     }
  //   });
  //   return acc;
  // }, []);

  return (
    <>
      <Breadcrumb />
      <div className="p-4">
        <div className="p-4 bg-white rounded-xl shadow-sm">
          <DatePicker
            selected={selectedDate}
            onChange={(date) => handleClickDate(date)}
            dateFormat="dd/MM/yyyy"
            className="w-full border-2 border-blue-100 rounded-xl p-3 text-blue-900 font-medium
                    focus:ring-2 focus:ring-blue-300 focus:border-blue-400 outline-none
                    transition-all duration-200 hover:border-blue-200"
            dayClassName={(date) =>
              `rounded-lg p-2 hover:bg-blue-50 ${
                date.getDate() === selectedDate?.getDate()
                  ? "bg-blue-500 text-white font-semibold"
                  : ""
              }`
            }
            highlightDates={highlightDates}
            maxDate={new Date()}
            placeholderText="Pilih Tanggal"
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            popperClassName="shadow-xl rounded-xl border border-blue-50"
            wrapperClassName="w-full"
            renderCustomHeader={({
              monthDate,
              customHeaderCount,
              decreaseMonth,
              increaseMonth,
            }) => (
              <div className="flex items-center justify-between px-2 py-2">
                <button
                  onClick={decreaseMonth}
                  className="p-1 rounded-lg hover:bg-blue-50 text-blue-500"
                >
                  <FaChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-blue-800 font-semibold">
                  {monthDate.toLocaleString("id-ID", {
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={increaseMonth}
                  className="p-1 rounded-lg hover:bg-blue-50 text-blue-500"
                >
                  <FaChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          />
        </div>
        <h1 className="text-xl font-bold mb-4">{dataLabel.name}</h1>
        <ul>
          {filteredData.length > 0 && selectedDate ? (
            // kolomData.map((item, index) => {
            // const originalIndex = selected.findIndex((i) => i === item);
            // console.log(
            //   originalIndex,
            //   kolomData,
            //   kolomData[originalIndex].part_name
            // );
            [
              ...new Map(
                kolomData
                  .flatMap((item) =>
                    item.data.map((part) => ({
                      ...part,
                    }))
                  )
                  .map((part) => [part.part_no, part])
              ).values(),
            ].map((part, idx) => {
              console.log("part", part);
              return (
                <li
                  key={idx}
                  className="cursor-pointer text-[#105bdf] hover:underline"
                  onClick={() => {
                    navigate(`${part.part_no}`);
                  }}
                >
                  {part.part_no} : {part.part_name}
                </li>
              );
            })
          ) : (
            //   </div>;
            // })
            <p>Data tidak ditemukan</p>
          )}
        </ul>
      </div>
    </>
  );
}
