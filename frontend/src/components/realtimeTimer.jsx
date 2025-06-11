import React, { useState, useEffect } from "react";

const RealtimeTimer = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time) => {
    const hours = time.getHours().toString().padStart(2, "0");
    const minutes = time.getMinutes().toString().padStart(2, "0");
    const seconds = time.getSeconds().toString().padStart(2, "0");
    return { hours, minutes, seconds };
  };

  // const formatDate = (time) => {
  //   const days = [
  //     "Minggu",
  //     "Senin",
  //     "Selasa",
  //     "Rabu",
  //     "Kamis",
  //     "Jumat",
  //     "Sabtu",
  //   ];
  //   const months = [
  //     "Januari",
  //     "Februari",
  //     "Maret",
  //     "April",
  //     "Mei",
  //     "Juni",
  //     "Juli",
  //     "Agustus",
  //     "September",
  //     "Oktober",
  //     "November",
  //     "Desember",
  //   ];

  //   const dayName = days[time.getDay()];
  //   const date = time.getDate();
  //   const monthName = months[time.getMonth()];
  //   const year = time.getFullYear();

  //   return `${dayName}, ${date} ${monthName} ${year}`;
  // };

  const { hours, minutes, seconds } = formatTime(currentTime);

  return (
    <div className="flex items-center justify-center">
      <div className="text-center">
        {/* <div className="text-blue-700 text-2xl font-medium">
          {formatDate(currentTime)}
        </div> */}
        <div className="mb-2">
          <div className="flex justify-center items-center gap-4 mb-2">
            <div className="bg-blue-700 rounded-lg px-7 py-3 min-w-[60px] shadow-lg">
              <div className="text-2xl font-bold text-white font-mono">
                {hours}
              </div>
              <div className="text-sm text-blue-200 uppercase tracking-wide">
                Jam
              </div>
            </div>

            <div className="text-3xl text-blue-700 font-bold">:</div>

            <div className="bg-blue-700 rounded-lg px-6 py-3 min-w-[60px] shadow-lg">
              <div className="text-2xl font-bold text-white font-mono">
                {minutes}
              </div>
              <div className="text-sm text-blue-200 uppercase tracking-wide">
                Menit
              </div>
            </div>

            <div className="text-3xl text-blue-700 font-bold">:</div>

            <div className="bg-blue-700 rounded-lg px-6 py-3 min-w-[60px] shadow-lg">
              <div className="text-2xl font-bold text-white font-mono">
                {seconds}
              </div>
              <div className="text-sm text-blue-200 uppercase tracking-wide">
                Detik
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeTimer;
