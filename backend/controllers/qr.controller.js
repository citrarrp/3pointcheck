import { ObjectId } from "bson";
import scanQR from "../models/inputQR.js";
import Tes from "../models/tes.js";
import trackingDelv from "../models/tracking.js";

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
    const { date, customerId, cycle, dn } = req.query;

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

const getLastCharAfterSpace = (str) => {
  if (!str) return "";
  const parts = str.trim().split(" ");
  return parts.length > 1 ? parts[parts.length - 1] : parts;
};

export const createInputQR = async (req, res) => {
  const { index, row, id, selectedDate, dnFound, cycle, validPart } = req.body;
  let resValid = row.status;
  let pesan = "";
  let refresh = false;
  try {
    console.log(dnFound, "ini dn ditemukan", row);
    const filter = {
      index: index,
      customerId: id,
      // selectedDate: {
      //   $gte: new Date(selectedDate).setHours(0, 0, 0, 0),
      //   $lte: new Date(selectedDate).setHours(23, 59, 59, 999),
      // },
      // kanban: row.kanban, // atau kombinasi field lain sebagai identifikasi unik
    };

    if (row.kanban && row.labelSupplier && row.status !== false) {
      const existing = await scanQR.findOne({
        kanban: row.kanban,
        labelSupplier: row.labelSupplier,
        customerId: id,
      });

      if (existing && existing.index !== index) {
        resValid = false;
        pesan = "KANBAN SUDAH DIIINPUT";
      }

      const dataDN = await trackingDelv.find({
        dnNumber: dnFound,
        cycleNumber: Number(cycle),
        customerId: new ObjectId(id),
      });

      console.log(Number(cycle), id, dataDN);

      if (!dataDN || dataDN.length === 0) {
        resValid = false;
        pesan = "TIDAK ADA DN PADA CYCLE!";
      }
    }

    const update = {
      kanban: row.kanban,
      status: resValid, //ubah jika hasil existing dan dataDN
      labelSupplier: row.labelSupplier,
      dateDelivery: selectedDate,
      validPart,
      pesan,
    };
    const options = {
      new: true, // return the updated document
      upsert: true, // create if not exists
      setDefaultsOnInsert: true, // apply default values if creating
    };
    const inputQR = await scanQR.findOneAndUpdate(filter, update, options);
    const deleted = await scanQR.deleteMany({
      customerId: id,
      index: { $gt: index },
    });
    // const prev = await scanQR.findOne({
    //   kanban: row.kanban,
    //   labelSupplier: row.labelSupplier,
    //   index: index,
    //   customerId: id,
    // // });

    // console.log(prev, prev.kanban, "ini yang dulu");

    // if (prev && prev.kanban !== row.kanban) {
    //   const dele = await scanQR.deleteOne({
    //     customerId: id,
    //     labelSupplier: prev.labelSupplier,
    //     index,
    //   });
    //   console.log(dele, "dihapus");
    // }

    if (deleted.deletedCount > 0) {
      refresh = true;
    }
    // const jobNoPart = getLastCharAfterSpace(row.kanban);
    // const labelSupplier = row.labelSupplier?.toLowerCase();
    // const labelTrimmed = labelSupplier?.split("|")[0];

    // function matchEntry(docs, row, startDate, endDate) {
    //   const kanban = row.kanban?.toLowerCase();
    //   const supplier = row.labelSupplier?.toLowerCase();

    //   for (const doc of docs) {
    //     console.log(doc, "isi data");
    //     for (let i = 0; i < doc.kolomSelected.length; i++) {
    //       const selected = doc.kolomSelected[i];
    //       const selectedData = selected.selectedData || [];

    //       const matchedIndex = selectedData.findIndex((sd) => {
    //         return new RegExp(kanban, "i").test(sd);
    //       });

    //       if (matchedIndex !== -1) {
    //         const matchedData = selected.data.find((d) => {
    //           const dDate = new Date(d.delivery_date);
    //           return dDate >= startDate && dDate <= endDate;
    //         });

    //         if (matchedData) {
    //           const supplierMatch =
    //             supplier &&
    //             new RegExp(supplier, "i").test(selectedData[matchedIndex]);

    //           return {
    //             matchFound: true,
    //             partName: matchedData.part_name,
    //             matchedSelectedData: selectedData[matchedIndex],
    //             supplierMatch,
    //             rawData: matchedData,
    //           };
    //         }
    //       }
    //     }
    //   }

    //   return { matchFound: false, docs };
    // }

    if (!row.kanban || !selectedDate) {
      return res
        .status(400)
        .json({ error: "kanban, startDate, endDate required" });
    }

    // const start = new Date(selectedDate);
    // start.setHours(0, 0, 0, 0);

    // const end = new Date(selectedDate);
    // end.setHours(23, 59, 59, 999);

    // const docs = await Tes.aggregate([
    //   {
    //     $match: { _id: id },
    //   },
    //   {
    //     $project: {
    //       kolomSelected: {
    //         $filter: {
    //           input: "$kolomSelected",
    //           as: "ks",
    //           cond: {
    //             $anyElementTrue: {
    //               $map: {
    //                 input: "$$ks.data",
    //                 as: "d",
    //                 in: {
    //                   $and: [
    //                     { $gte: ["$$d.delivery_date", start] },
    //                     { $lte: ["$$d.delivery_date", end] },
    //                   ],
    //                 },
    //               },
    //             },
    //           },
    //         },
    //       },
    //     },
    //   },
    //   // {
    //   //   $match: {
    //   //     "kolomSelected.0": { $exists: true }, // hanya ambil yang ada hasil
    //   //   },
    //   // },
    // ]);

    // const matchResult = matchEntry(docs, row, start, end);
    res
      .status(200)
      .json({ success: true, data: inputQR, status: resValid, pesan, refresh });
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
