import scanQR from "../models/inputQR.js";

export const getInputQR = async (req, res) => {
  //   try {
  //     const inputQR = await scanQR.find({});
  // res.status(200).json({ success: true, data: inputQR });
  //   } catch (error) {
  //     console.log("error in fetching Customers:", error.message);
  // res.status(500).json({ success: false, message: "Server Error" });
  //   }
  // };

  try {
    const { date, customerId } = req.query;

    const filter = {};
    if (date) {
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      filter.dateDelivery = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    if (customerId) {
      filter.customerId = customerId;
    }

    const savedInputs = await scanQR.find(filter).sort({ index: 1 }).lean();

    res.status(200).json({ success: true, data: savedInputs });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const createInputQR = async (req, res) => {
  const { index, row, id, selectedDate } = req.body;

  if (typeof row?.status === "undefined") {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    const newInputQR = new scanQR({
      index: index,
      customerId: id,
      status: row.status,
      kanban: row.kanban,
      labelSupplier: row.labelSupplier,
      dateDelivery: selectedDate,
    });
    await newInputQR.save();

    res.status(201).json({ success: true, data: newInputQR });
  } catch (error) {
    console.error("Error saving inputQR:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAbsensibyDate = async (req, res) => {
  const { tanggal } = req.query;

  let filter = {};
  if (tanggal) {
    const targetDate = new Date(tanggal);
    const nextDay = new Date(targetDate);
    nextDay.setDate(targetDate.getDate() + 1);

    filter.createdAt = { $gte: targetDate, $lt: nextDay };
  }

  try {
    const absensiall = await Absensi.find(
      // customerId: id,
      // cycleNumber: parseInt(cycleNumber),
      filter
    );

    const absensiCustomer = await Absensi.find({ _id: Absensi.cust }).populate(
      "tes",
      "nama"
    );

    if (!absensiall || absensiall.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Data tidak ditemukan" });
    }

    res.status(200).json({
      success: true,
      message: "Data berhasil diambil",
      data: absensiall,
    });
  } catch (error) {
    console.log("error in fetching Customers:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
