import { useEffect, useRef, useState } from "react";
import { format, addMinutes, differenceInMinutes } from "date-fns";
import { FaCheck, FaXmark, FaExclamation, FaCircleDot } from "react-icons/fa6";

const hourWidth = 100;
const minuteWidth = hourWidth / 60;
const visibleHours = 10;
const updateInterval = 30 * 60 * 1000;

const sample = [
  {
    customer: "Customer A",
    time: "2025-05-10T15:00",
    process: "Pulling",
    status: "ontime",
  },
  {
    customer: "Customer A",
    time: "2025-05-10T16:00",
    process: "Wrapping",
    status: "ontime",
  },
  {
    customer: "Customer A",
    time: "2025-05-10T17:00",
    process: "Departure Truck",
    status: "info",
  },
  {
    customer: "Customer B",
    time: "2025-05-10T15:35",
    process: "Pulling",
    status: "ontime",
  },
  {
    customer: "Customer B",
    time: "2025-05-10T16:30",
    process: "Wrapping",
    status: "delay",
  },
  {
    customer: "Customer B",
    time: "2025-05-10T17:50",
    process: "Departure Truck",
    status: "info",
  },
  {
    customer: "Customer C",
    time: "2025-05-10T16:00",
    process: "Pulling",
    status: "delay",
  },
  {
    customer: "Customer C",
    time: "2025-05-10T17:00",
    process: "Wrapping",
    status: "info",
  },
  {
    customer: "Customer C",
    time: "2025-05-10T18:50",
    process: "Departure Truck",
    status: "info",
  },
];

const processColor = {
  Pulling: "bg-blue-800",
  Wrapping: "bg-yellow-500",
  "Departure Truck": "bg-purple-700",
  default: "bg-gray-600",
};

const statusIcons = {
  ontime: <FaCheck size={8} className="text-white " />,
  delay: <FaXmark size={8} className="text-white" />,
  fail: <FaExclamation size={8} className="text-white" />,
  info: <FaCircleDot size={8} className="text-white" />,
};

export default function CustomerTimeLine() {
  const [currentStartTime, setCurrentStartTime] = useState(
    new Date("2025-05-10T13:00")
  );
  const contRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStartTime(new Date());
    }, updateInterval);
    return () => clearInterval(interval);
  }, []);

  const customers = ["Customer A", "Customer B", "Customer C"];
  const totalWidth = visibleHours * hourWidth;
  const getProcessLines = (customer) => {
    const events = sample
      .filter((e) => e.customer === customer)
      .sort((a, b) => new Date(a.time) - new Date(b.time));

    const result = [];

    let currentStart = null;

    events.forEach((event, index) => {
      const isFirst = index === 0;
      const baseDuration = event.process === "Pulling" ? 0 : 60;
      const extraDelay = event.status === "delay" ? 15 : 0;
      const duration = baseDuration + extraDelay;
      const originalEnd =
        event.status === "delay"
          ? addMinutes(new Date(event.time), extraDelay)
          : new Date(event.time);

      let start, end;

      if (isFirst) {
        end = originalEnd;
        start = addMinutes(end, -duration);
      } else {
        start = new Date(currentStart);
        end = addMinutes(start, duration);
      }

      currentStart = new Date(end);

      result.push({
        start,
        end,
        duration,
        process: event.process,
        status: event.status,
        color:
          {
            Pulling: "#1e40af", // blue-800
            Wrapping: "#eab308", // yellow-500
            "Departure Truck": "#6b21a8", // purple-700
          }[event.status === "info" ? "default" : event.process] || "#9ca3af",
      });
    });

    return result;
  };

  return (
    <div className="flex justify-center p-4" ref={contRef}>
      <div className="border rounded bg-white max-w-2xl md:max-w-4xl w-full overflow-x-auto">
        <div className="relative" style={{ width: totalWidth, minWidth: 800 }}>
          <div className="flex text-sm text-gray-500 mb-2">
            {Array.from({ length: visibleHours + 1 }).map((_, i) => (
              <div
                key={i}
                className="w-[100px] text-center border-r border-gray-400"
              >
                {format(addMinutes(currentStartTime, i * 60), "HH:mm")}
              </div>
            ))}
          </div>
          {customers.map((customer) => (
            <div key={customer} className="relative h-12 mb-4">
              {/* <div className="absolute left-4 top-5 h-0.5 w-full bg-gray-400" /> */}

              <span className="absolute left-2 top-2 font-medium text-sm z-10 bg-white px-2">
                {customer}
              </span>

              {getProcessLines(customer).map((line, idx) => {
      
                const startPosition =
                  differenceInMinutes(line.start, currentStartTime) *
                  minuteWidth;
                const lineWidth = line.duration * minuteWidth;

                const now = new Date("2025-05-10T23:00");
                const isInProgress = now > line.start && now < line.end;

                return (
                  <div
                    key={idx}
                    className={`absolute top-8 h-3 rounded-full ${line.color}`}
                    style={{
                      left: startPosition,
                      width: lineWidth,
                      backgroundColor: isInProgress ? "#CBD5E1" : line.color,
                    }}
                  ></div>
                );
              })}

              {sample
                .filter((e) => e.customer === customer)
                .map((event) => {
                  const time = new Date(event.time);
                  const minsFromStart = differenceInMinutes(
                    time,
                    currentStartTime
                  );
                  const left = minsFromStart * minuteWidth;

                  if (left < 0 || left > totalWidth) return null;

                  return (
                    <div
                      className={`absolute top-2 w-4 h-4 rounded-full flex items-center justify-center shadow-md cursor-pointer ${
                        processColor[event.process] || "bg-gray-300"
                      }`}
                      style={{ left }}
                      title={`${event.process} @ ${format(time, "HH:mm")}`}
                    >
                      {statusIcons[event.status] || (
                        <FaCircleDot size={8} className="text-white" />
                      )}
                    </div>
                  );
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
