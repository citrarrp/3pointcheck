import mongoose from "mongoose";
import Tes from "../models/tes.js";
import moment from "moment-timezone";
import trackingDelv from "../models/tracking.js";
import materialCustomer from "../models/masterPart.js";
import { ObjectId } from "bson";

export const getSelectedCustomer = async (req, res) => {
  try {
    const dbCustomer = await Tes.find({
      selectedCustomer: { $ne: null },
    }).select("nama selectedCustomer _id");
    res.status(200).json({ success: true, data: dbCustomer });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDatabyDate = async (req, res) => {
  const { customer, date } = req.query;

  if (!date) {
    return res
      .status(400)
      .json({ error: "Parameter 'date' wajib diisi (format: YYYY-MM-DD)" });
  }

  try {
    // const startDate = new Date(`${date}T00:00:00.000Z`);
    // const endDate = new Date(`${date}T23:59:59.999Z`);

    const startDate = new Date(`${date}T00:00:00.000+07:00`);
    const endDate = new Date(`${date}T23:59:59.999+07:00`);
    if (!ObjectId.isValid(customer)) {
      return res.status(400).json({ error: "customerId tidak valid" });
    }

    console.log(date, "masuk");
    const test = [
      { $match: { _id: new ObjectId(customer) } },
      { $unwind: "$kolomSelected" },

      // Gabungkan per index
      {
        $addFields: {
          "kolomSelected.mergedData": {
            $map: {
              input: { $range: [0, { $size: "$kolomSelected.data" }] },
              as: "idx",
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ["$kolomSelected.data", "$$idx"] },
                  {
                    selectedData: {
                      $arrayElemAt: ["$kolomSelected.selectedData", "$$idx"],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $unwind: "$kolomSelected.mergedData" },

      {
        $replaceRoot: { newRoot: "$kolomSelected.mergedData" },
      },

      {
        $addFields: {
          delivery_date_parsed: { $toDate: "$delivery_date" },
        },
      },

      {
        $match: {
          delivery_date_parsed: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },

      {
        $project: {
          dn_number: 1,
          part_name: 1,
          qty: 1,
          job_no: 1,
          material: 1,
          material_description: 1,
          customer_material: 1,
          "order_(pcs)": 1,
          delivery_cycle: 1,
          delivery_date: 1,
          delivery_date_parsed: 1,
          selectedData: 1,
        },
      },
    ];

    const result = await Tes.aggregate(test);
    res.status(200).json({
      success: true,
      data: result,
      message: "Data berhasil diambil",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

export const getUniqueDataAll = async (req, res) => {
  try {
    const test = [
      { $unwind: "$kolomSelected" },

      {
        $addFields: {
          "kolomSelected.mergedData": {
            $map: {
              input: { $range: [0, { $size: "$kolomSelected.data" }] },
              as: "idx",
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ["$kolomSelected.data", "$$idx"] },
                  {
                    selectedData: {
                      $arrayElemAt: ["$kolomSelected.selectedData", "$$idx"],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $unwind: "$kolomSelected.mergedData" },
      { $addFields: { "kolomSelected.mergedData.kanban": "$kanban" } },

      { $replaceRoot: { newRoot: "$kolomSelected.mergedData" } },
      { $match: { customer_material: { $exists: true, $ne: null } } },

      {
        $group: {
          _id: "$customer_material",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },

      {
        $project: {
          _id: 1,
          part_name: 1,
          qty: 1,
          job_no: 1,
          material: 1,
          material_description: 1,
          customer_material: 1,
          delivery_cycle: 1,
          line: 1,
          customer: 1,
          delivery_date: 1,
          selectedData: 1,
          kanban: 1,
        },
      },
    ];

    const result = await Tes.aggregate(test);
    res.status(200).json({
      success: true,
      data: result,
      message: "Data berhasil diambil",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};

export const getUniqueDatabyCustomer = async (req, res) => {
  const { id } = req.params;
  try {
    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ error: "customerId tidak valid" });
    }

    const test = [
      { $match: { _id: new ObjectId(id) } },
      { $unwind: "$kolomSelected" },

      {
        $addFields: {
          "kolomSelected.mergedData": {
            $map: {
              input: { $range: [0, { $size: "$kolomSelected.data" }] },
              as: "idx",
              in: {
                $mergeObjects: [
                  { $arrayElemAt: ["$kolomSelected.data", "$$idx"] },
                  {
                    selectedData: {
                      $arrayElemAt: ["$kolomSelected.selectedData", "$$idx"],
                    },
                  },
                ],
              },
            },
          },
        },
      },

      { $unwind: "$kolomSelected.mergedData" },
      { $addFields: { "kolomSelected.mergedData.kanban": "$kanban" } },

      { $replaceRoot: { newRoot: "$kolomSelected.mergedData" } },

      {
        $group: {
          _id: "$material",
          doc: { $first: "$$ROOT" },
        },
      },
      {
        $replaceRoot: {
          newRoot: "$doc",
        },
      },

      {
        $project: {
          part_name: 1,
          qty: 1,
          job_no: 1,
          material: 1,
          material_description: 1,
          customer_material: 1,
          delivery_cycle: 1,
          line: 1,
          customer: 1,
          delivery_date: 1,
          selectedData: 1,
          kanban: 1,
        },
      },
    ];

    const result = await Tes.aggregate(test);
    res.status(200).json({
      success: true,
      data: result,
      message: "Data berhasil diambil",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ success: false, message: "Terjadi kesalahan server" });
  }
};
export const getData = async (req, res) => {
  try {
    let { search = "", page = 1, limit } = req.query;

    page = parseInt(page);
    limit = limit !== undefined ? parseInt(limit) : null;
    if (isNaN(page) || page < 1) page = 1;
    if ((isNaN(limit) && limit !== null) || limit < 1) limit = 10;

    let filter = {};
    if (search) {
      const searchRegex = new RegExp(search, "i");
      filter = {
        $or: [{ nama: searchRegex }],
      };
    }

    const skip = (page - 1) * (limit || 0);

    let query = Tes.find(filter).skip(skip);
    if (limit !== null) {
      query = query.limit(limit);
    }

    const [total, data] = await Promise.all([
      Tes.countDocuments(filter),
      query,
    ]);

    const totalPages = limit ? Math.ceil(total / limit) : 1;

    res.status(200).json({
      success: true,
      data,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("Error in fetching data:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDatabyId = async (req, res) => {
  const { id } = req.params;
  // console.log(req.user, "RES");

  try {
    const tes = await Tes.findById(id);
    if (!tes) {
      res.status(404).json({ success: false, message: "Data tidak ditemukan" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid user ID format");
    }

    // if (req.user.id === id) {
    //   res.status(400);
    //   throw new Error("You cannot delete your own account this way");
    // }
    // await user.remove();
    // await user.findByIdAndDelete(id);
    res
      .status(200)
      .json({ success: true, message: "Berhasil diambil", data: tes });
  } catch (error) {
    console.log("error in fetching Dataa:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const defaultSteps = {
  "Received Order": "RECEIVING E-KBN",
  "Waiting Post": "WAITING POST",
  "Start Preparation (Pulling)": "PULLING (60')",
  Inspection: "PULLING (60')",
  "Finish Preparation": "WRAPPING",
  "Ready to Shipping Area": "WRAPPING",
  "Create Surat Jalan": "LOADING TRUCK (30')",
  "Arrived Truck": "LOADING TRUCK (30')",
  "Departure Truck": "TRUCK OUT",
};

export const createData = async (req, res) => {
  const {
    nama,
    kolomSelected,
    selectedData,
    sourceValueLabel,
    separator,
    selectedColumns,
    dataReal,
    selectedCustomer,
    selectedFields,
    uniquePartName,
    tracking,
    kanban,
  } = req.body;

  const now = moment().tz("Asia/Jakarta").toISOString();

  if (!nama) {
    return res
      .status(400)
      .json({ success: false, message: "Please provide all fields" });
  }

  try {
    // const materialData = await materialCustomer.find({
    //   customer_material: { $in: kolomSelected.map((d) => d.customer_material) },
    // });

    const customerMaterials = kolomSelected
      .map((d) => d.customer_material)
      .filter(Boolean);

    const materials = kolomSelected.map((d) => d.material).filter(Boolean);

    const materialData = await materialCustomer.find({
      $or: [
        { customer_material: { $in: customerMaterials } },
        { material: { $in: materials } },
      ],
    });
    console.log(kolomSelected, customerMaterials, materials);

    console.log(materialData[0]);
    if (!materialData) {
      return res.status(404).json({ message: "Material tidak ditemukan" });
    }

    const updatedKolomSelected = {
      data: kolomSelected.map((dataItem) => {
        // const matchingMaterial = materialData.find(
        //   (m) => m.customer_material === dataItem.customer_material
        // );
        const matchingMaterial = materialData.find((m) => {
          if (dataItem.customer_material) {
            return m.customer_material === dataItem.customer_material;
          } else if (dataItem.material) {
            if (dataItem.customer) {
              return (
                m.material === dataItem.material &&
                m.customer === dataItem.customer
              );
            } else {
              return m.material === dataItem.material;
            }
          }
        });

        console.log(matchingMaterial, "ini cocok");
        return {
          ...dataItem,
          material: dataItem?.material
            ? dataItem.material
            : matchingMaterial?.material || "",
          material_description: dataItem?.description
            ? dataItem.description
            : matchingMaterial?.material_description || "",
          customer_material_description: dataItem.customer_material_description
            ? dataItem.customer_material_description
            : matchingMaterial?.customer_material_description || "",
          customer_material: dataItem.customer_material
            ? dataItem.customer_material
            : matchingMaterial?.customer_material || "",
          line: matchingMaterial?.line,
          customer: matchingMaterial?.customer_description,
        };
      }),
      createdAt: now,
      selectedData: selectedData,
      sequence: uniquePartName,
    };

    const payload = {
      nama,
      kolomSelected: updatedKolomSelected,
      sourceValueLabel,
      separator,
      selectedColumns,
      selectedCustomer,
      selectedFields,
      dataReal,
      kanban,
    };

    // console.log(payload, "data masuk");

    // try {
    const newDataCustomer = new Tes(payload);
    const savedData = await newDataCustomer.save();
    // res.status(201).json({ success: true, data: newDataCustomer });

    const result = [];
    const processedDnNumbers = new Set();

    for (const dataItem of kolomSelected) {
      // console.log(dataItem, "item");
      const dnNumber =
        dataItem.dn_number ||
        dataItem.order_delivery ||
        dataItem.delivery_order;

      if (processedDnNumbers.has(dnNumber)) continue; // skip jika sudah diproses
      processedDnNumbers.add(dnNumber);
      // console.log(processedDnNumbers, "dn");

      // for (const item of tracking) {
      //   const matchedStep = Object.keys(defaultSteps).find(
      //     (key) => defaultSteps[key] === item.processName
      //   );
      //   console.log(item, typeof dataItem.delivery_cycle, "cycle");
      //   if (
      //     (parseInt(dataItem.delivery_cycle) === parseInt(item.cycle) ||
      //       parseInt(dataItem.delivery_cycle) === 1) &&
      //     matchedStep !== undefined
      // )

      for (const [stepKey, processName] of Object.entries(defaultSteps)) {
        const matchedItem = tracking.find(
          (item) =>
            processName === item.processName &&
            (parseInt(dataItem.delivery_cycle) === parseInt(item.cycle) ||
              parseInt(dataItem.delivery_cycle) === 1)
        );
        console.log(dataItem.delivery_date, "tanggal apa");
        {
          result.push({
            cycle: dataItem.delivery_cycle,
            dnNumber,
            waktu: matchedItem.waktu || null,
            durasi: matchedItem.durasi,
            step: stepKey,
            waktuDelv: dataItem.delivery_date,
          });
        }
      }
    }
    const trackingUpdates = [];

    for (const data of result) {
      const { cycle, dnNumber, waktu, durasi, step, waktuDelv } = data;

      console.log(data, "data tracking", cycle);
      let waktuAktual = null;
      let delay = null;
      let status = "-";
      let waktuStandar = null;

      const waktuAktualUTC = moment.tz(waktuDelv, "Asia/Jakarta");
      // const waktuStandarUTC = moment.utc(waktu);
      const waktuStandarUTC = moment.tz(
        moment.utc(waktu).format("YYYY-MM-DD HH:mm"),
        "Asia/Jakarta"
      );
      // console.log(waktu, "ini valid ga", waktuAktualUTC);
      // .utc();
      const waktuNow = moment().tz("Asia/Jakarta");

      const waktuStandarJakarta = waktuStandarUTC.set({
        year: waktuAktualUTC.year(),
        month: waktuAktualUTC.month(),
        date: waktuAktualUTC.date(),
      });

      // console.log(
      //   waktuStandarUTC,
      //   moment(waktuStandarUTC).tz("Asia/Jakarta"),
      //   "imi"
      // );

      // const waktuStandarJakarta = waktuStandarCorrected.tz("Asia/Jakarta");
      // console.log("Waktu Aktual (Jakarta):", waktuAktualJakarta.format());
      // console.log("Waktu Standar:", waktuStandarJakarta.format());

      const durasiFormatted = moment(
        durasi == null ? "1970-01-01T05:00:00.000Z" : durasi
      )
        .utc()
        .format("HH:mm");
      const [jam, menit] = durasiFormatted.split(":").map(Number);

      waktuStandar = waktuStandarJakarta;

      // if (step === "Finish Preparation") {
      //   waktuStandar = moment(waktuStandarJakarta)
      //     .add(jam, "hours")
      //     .add(menit, "minutes");
      // }

      if (step === "Ready to Shipping Area") {
        waktuStandar = moment(waktuStandarJakarta)
          .add(jam, "hours")
          .add(menit, "minutes");
        // .add(15, "minutes");
      }

      if (step === "Create Surat Jalan") {
        waktuStandar = moment(waktuStandarJakarta);
      }

      if (step === "Waiting Post") {
        const waktuStandarCorrect = waktuStandarUTC.set({
          year: waktuAktualUTC.year(),
          month: waktuAktualUTC.month(),
          date: waktuAktualUTC.date() - 1,
        });

        waktuStandar = waktuStandarCorrect;
      }

      if (step === "Received Order") {
        const waktuStandarCorrect = waktuStandarUTC.set({
          year: waktuAktualUTC.year(),
          month: waktuAktualUTC.month(),
          date: waktuAktualUTC.date() - 1,
        });

        // const waktuStandarJakarta = waktuStandarCorrected.tz("Asia/Jakarta");
        // const waktuAktualNow = waktuNow.set({
        //   year: waktuAktualUTC.year(),
        //   month: waktuAktualUTC.month(),
        //   date: waktuAktualUTC.date(),
        // });
        // console.log("Waktu Aktual (Jakarta):", waktuAktualJakarta.format());
        // console.log("Waktu Standar:", waktuStandarJakarta.format());

        const diffMinutes = waktuNow.diff(waktuStandarCorrect, "minutes");

        waktuStandar = waktuStandarCorrect;
        // console.log(
        //   waktuStandar,
        //   "standar",
        //   waktuNow,
        //   moment.tz("Asia/Jakarta")
        // );
        waktuAktual = waktuNow;

        if (diffMinutes > 1) {
          delay = `-${diffMinutes} menit`;
          status = "Delay";
        } else if (diffMinutes < 1) {
          delay = `+${diffMinutes * -1} menit`;
          status = "Advanced";
        } else {
          delay = `0 menit`;
          status = "On Time";
        }
      }

      console.log(waktuStandar, jam, menit, "contoh input");

      const newTracking = new trackingDelv({
        customerId: savedData._id, // bukan 'id'
        cycleNumber: cycle,
        dnNumber,
        tanggal: waktuDelv,
        nama: step,
        waktuStandar,
        waktuAktual: waktuAktual ? waktuAktual : null,
        delay,
        status,
        ket: "-",
        persentase: 0,
        createdAt: moment.tz("Asia/Jakarta"),
        verificationCode: null,
      });

      trackingUpdates.push(newTracking.save());
    }
    // console.log("baru", trackingUpdates, "update");
    await Promise.all(trackingUpdates);
    res.status(201).json({ success: true, data: newDataCustomer });
  } catch (error) {
    console.error("Error in Create Customer:", error.message);
    res.status(500).json({
      success: false,
      message: `Gagal menambahkan data, ${error.message}`,
      detail: error.message,
    });
  }
};

// export const updateData = async (req, res) => {
//   const { id } = req.params;
//   console.log(id);

//   const { kolomSelected, selectedData } = req.body;

//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res
//       .status(404)
//       .json({ success: false, message: "Invalid Customer Id" });
//   }

//   try {
//     const existingData = await Tes.findById(id);
//     if (!existingData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "Customer not found" });
//     }
//     console.log(existingData);

//     const updateData = {
//       lastUpdated: new Date(),
//     };

//     if (kolomSelected && Array.isArray(kolomSelected.data)) {
//       updateData.kolomSelected = {
//         ...(existingData.kolomSelected || {}),
//         data: [
//           ...(existingData.kolomSelected?.data || []),
//           ...kolomSelected.data,
//         ],
//         createdAt: kolomSelected.createdAt || new Date(),
//       };
//     }

//     if (selectedData && Array.isArray(selectedData)) {
//       updateData.selectedData = [
//         ...(existingData.selectedData || []),
//         ...selectedData,
//       ];
//     }

//     const updated = await Tes.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: true }
//     );

//     res
//       .status(200)
//       .json({ success: true, message: "Data updated success", data: updated });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };

export const updateData = async (req, res) => {
  const { id } = req.params;
  const { kolomSelected, matchedCycle } = req.body;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Customer Id" });
  }

  try {
    const existingData = await Tes.findById(id);
    if (!existingData) {
      return res
        .status(404)
        .json({ success: false, message: "Customer not found" });
    }

    const updateData = {
      lastUpdated: new Date(),
    };

    if (kolomSelected) {
      // if (selectedData && Array.isArray(selectedData)) {
      //   updateData.$addToSet = { selectedData: { $each: selectedData } };
      // }
      console.log(kolomSelected, "conoth");

      const customerMaterials = kolomSelected.data
        .map((d) => d.customer_material)
        .filter(Boolean);

      const materials = kolomSelected.data
        .map((d) => d.material)
        .filter(Boolean);

      const materialData = await materialCustomer.find({
        $or: [
          { customer_material: { $in: customerMaterials } },
          { material: { $in: materials } },
        ],
      });

      console.log(materialData[0]);
      if (!materialData) {
        return res.status(404).json({ message: "Material tidak ditemukan" });
      }

      const updatedKolomSelected = kolomSelected.data.map((dataItem) => {
        // const matchingMaterial = materialData.find(
        //   (m) => m.customer_material === dataItem.customer_material
        // );
        const matchingMaterial = materialData.find((m) => {
          if (dataItem.customer_material) {
            return m.customer_material === dataItem.customer_material;
          } else if (dataItem.material) {
            if (dataItem.customer) {
              return (
                m.material === dataItem.material &&
                m.customer === dataItem.customer
              );
            } else {
              return m.material === dataItem.material;
            }
          }
        });

        console.log(matchingMaterial, "ini cocok");
        return {
          ...dataItem,
          material: dataItem?.material
            ? dataItem.material
            : matchingMaterial?.material || "",
          material_description: dataItem?.description
            ? dataItem.description
            : matchingMaterial?.material_description || "",
          customer_material_description: dataItem.customer_material_description
            ? dataItem.customer_material_description
            : matchingMaterial?.customer_material_description || "",
          customer_material: dataItem.customer_material
            ? dataItem.customer_material
            : matchingMaterial?.customer_material || "",

          line: matchingMaterial?.line,
          customer: matchingMaterial?.customer_description,
        };
      });

      const newKolom = {
        ...kolomSelected,
        data: updatedKolomSelected,
      };

      updateData.$push = {
        kolomSelected: newKolom,
      };
      // updateData.$push = {
      //   kolomSelected: {
      //     $each: updatedKolomSelected,
      //   },
      // };
    }
    const updated = await Tes.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    const trackingUpdates = [];

    for (const kolom of updated.kolomSelected) {
      const globalProcessedDnNumbers = new Map();

      for (const dataItem of kolom.data) {
        // console.log("masuk", dataItem, kolom.data);

        let waktuDelv = dataItem.delivery_date;

        // console.log(
        //   dataItem.delivery_date,
        //   "tanggal asli",
        //   moment.tz(
        //     `${moment(waktuDelv).format("YYYY-MM-DD")} 00:00`,
        //     "Asia/Jakarta"
        //   ),
        //   moment.utc(waktuDelv),
        //   moment(waktuDelv)
        // );
        console.log(waktuDelv, "waktu delv");
        if (!waktuDelv) {
          const currentKolomIndex = updated.kolomSelected.indexOf(kolom);
          const currentDataIndex = kolom.data.indexOf(dataItem);
          for (let i = currentDataIndex - 1; i >= 0; i--) {
            if (kolom.data[i].delivery_date) {
              waktuDelv = kolom.data[i].delivery_date;
              break;
            }
          }

          // jika tetap null, boleh juga cari ke depan (opsional)
          if (!waktuDelv && currentKolomIndex > 0) {
            const prevKolom = updated.kolomSelected[currentKolomIndex - 1];
            for (let i = prevKolom.data.length - 1; i >= 0; i--) {
              if (prevKolom.data[i].delivery_date) {
                waktuDelv = prevKolom.data[i].delivery_date;
                break;
              }
            }
          }

          if (!waktuDelv) {
            for (let i = currentDataIndex + 1; i < kolom.data.length; i++) {
              if (kolom.data[i].delivery_date) {
                waktuDelv = kolom.data[i].delivery_date;
                break;
              }
            }
          }

          // 4. Jika tetap tidak ada, skip
          if (!waktuDelv) continue;
        }

        // const waktuAktualUTC = moment
        //   .tz(waktuDelv, "Asia/Jakarta")
        //   .add(7, "hours");

        const numberCycle = dataItem.delivery_cycle;

        // console.log(waktuDelv, waktuAktualUTC, "WAKTU ASLI");
        const dnNumber = dataItem.dn_number;
        const uniqueKey = `${dnNumber}-${numberCycle}`;
        if (globalProcessedDnNumbers.has(uniqueKey)) continue;
        globalProcessedDnNumbers.set(uniqueKey, true);

        // console.log(globalProcessedDnNumbers, "dn");
        // console.log(updated, matchedCycle, "data update");
        // const matchedCycle = updated.cycle.find(
        //   (c) => c.numberCycle === numberCycle
        // );
        const matchedCycleForNumber = matchedCycle.filter(
          (c) => Number(c.cycle) === Number(numberCycle)
        );

        if (!matchedCycleForNumber) continue;

        // for (const step of matchedCycleForNumber) {
        //   const stepKey = Object.keys(defaultSteps).find(
        //     (key) => defaultSteps[key] === step.processName
        //   );

        for (const [stepKey, processName] of Object.entries(defaultSteps)) {
          const step = matchedCycleForNumber.find(
            (item) => item.processName === processName
          );
          if (!step) continue;

          const existingTracking = await trackingDelv.findOne({
            customerId: id,
            numberCycle,
            nama: stepKey,
            dnNumber,
          });

          if (!existingTracking) {
            let waktuAktual = null;
            let delay = null;
            let status = "-";
            // const waktuAktualUTC = moment
            //   .tz(waktuDelv, "Asia/Jakarta")
            //   .add(7, "hours");

            const waktuAktualUTC = moment.tz(waktuDelv, "Asia/Jakarta");
            // const waktuStandarUTC = moment.utc(step.waktu);
            const waktuStandarUTC = moment.tz(
              moment.utc(step.waktu).format("YYYY-MM-DD HH:mm"),
              "Asia/Jakarta"
            );

            const waktuStandarJakarta = waktuStandarUTC.set({
              year: waktuAktualUTC.year(),
              month: waktuAktualUTC.month(),
              date: waktuAktualUTC.date(),
            });

            // console.log(waktuAktualUTC, "berapa jam");

            let waktuStandar = waktuStandarJakarta;

            const durasiFormatted = moment(
              step.durasi == null ? "1970-01-01T00:00:00.000Z" : step.durasi
            )
              .utc()
              .format("HH:mm");
            const [jam, menit] = durasiFormatted.split(":").map(Number);

            if (stepKey === "Inspection") {
              waktuStandar = moment(waktuStandarJakarta)
                .add(jam, "hours")
                .add(menit, "minutes");
            }

            if (stepKey === "Create Surat Jalan") {
              waktuStandar = moment(waktuStandarJakarta);
            }

            if (step === "Ready to Shipping Area") {
              waktuStandar = moment(waktuStandarJakarta)
                .add(jam, "hours")
                .add(menit, "minutes");
              // .add(15, "minutes");
            }

            if (stepKey === "Received Order") {
              const waktuStandarCorrected = waktuStandarUTC.set({
                year: waktuAktualUTC.year(),
                month: waktuAktualUTC.month(),
                date: waktuAktualUTC.date() - 1,
              });
              const waktuNow = moment().tz("Asia/Jakarta");

              // console.log(waktuStandarCorrected, "imi");

              // const waktuAktualJakarta = waktuAktualUTC.tz("Asia/Jakarta");

              // console.log("Waktu Standar:", waktuStandarJakarta.format());

              const diffMinutes = waktuNow.diff(
                waktuStandarCorrected,
                "minutes"
              );
              // console.log(
              //   "etdah",
              //   diffMinutes,
              //   waktuNow,
              //   waktuStandarCorrected
              // );
              waktuStandar = waktuStandarCorrected;

              waktuAktual = waktuNow;

              if (diffMinutes > 0) {
                delay = `-${diffMinutes} menit`;
                status = "Delay";
              } else if (diffMinutes < 0) {
                delay = `+${diffMinutes * -1} menit`;
                status = "Advanced";
              } else {
                delay = `0 menit`;
                status = "On Time";
              }
            }

            if (step === "Waiting Post") {
              const waktuStandarCorrect = waktuStandarUTC.set({
                year: waktuAktualUTC.year(),
                month: waktuAktualUTC.month(),
                date: waktuAktualUTC.date() - 1,
              });

              waktuStandar = waktuStandarCorrect;
            }

            const newTracking = new trackingDelv({
              customerId: id,
              numberCycle,
              dnNumber,
              tanggal: waktuDelv,
              nama: stepKey,
              waktuStandar,
              waktuAktual: waktuAktual ? waktuAktual : null,
              delay,
              status,
              ket: "-",
              persentase: 0,
              createdAt: moment.tz("Asia/Jakarta"),
            });
            console.log(waktuStandar, jam, menit, "contoh input");
            // const waktuStandarJakarta = waktuStandarCorrected.tz("Asia/Jakarta");
            // const waktuAktualNow = waktuNow.set({
            //   year: waktuAktualUTC.year(),
            //   month: waktuAktualUTC.month(),
            //   date: waktuAktualUTC.date(),
            // });
            // console.log("Waktu Aktual (Jakarta):", waktuAktualJakarta.format());
            // console.log("Waktu Standar:", waktuStandarJakarta.format());

            if (
              !trackingUpdates.some(
                (t) =>
                  t.dnNumber === dnNumber &&
                  t.numberCycle === numberCycle &&
                  t.nama === stepKey
              )
            ) {
              trackingUpdates.push(newTracking.save());
            }
          } else {
            existingTracking.waktuStandar = step.waktu_standar;
            trackingUpdates.push(existingTracking.save());
          }
        }
      }
    }

    await Promise.all(trackingUpdates);

    const allTrackings = await trackingDelv.find({ customerId: id });

    // console.log(trackingUpdates);
    // if (trackingUpdates.length > 0) {
    res.status(200).json({
      success: true,
      message: "Data updated success",
      data: updated,
    });
    // } else {
    //   res
    //     .status(200)
    //     .json({ success: false, message: "Data tidak berhasil diperbarui!" });
    // }
  } catch (error) {
    console.error("Update Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

// if (cycle && Array.isArray(cycle)) {
//   const existingTypes = updatedDataCustomer.cycle.map((c) => c.type);
//   const newCycle = cycle.filter((c) => !existingTypes.includes(c.type));

//   if (newCycle.length > 0) {
//     updateOps.$push = {
//       ...updateOps.$push,
//       cycle: { $each: newCycle },
//     };
//   }
// }

// if (!updateOps.$push) {
//   return res
//     .status(400)
//     .json({ success: false, message: "No new data to update" });
// }

//     const updated = await Tes.findByIdAndUpdate(
//       id,
//       { $set: updateData },
//       { new: true, runValidators: truncates }
//     );
//     res
//       .status(200)
//       .json({ success: true, message: "Data updated success", data: updated });
//   } catch (error) {
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };

export const updateDataCycle = async (req, res) => {
  const { id } = req.params;
  const { cycles } = req.body;
  // const session = await mongoose.startSession();

  try {
    // session.startTransaction();
    const exist = await Tes.findById(id);

    if (!exist)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    const cycleNumbers = cycles.map((c) => c.numberCycle);
    if (new Set(cycleNumbers).size !== cycleNumbers.length) {
      return res
        .status(400)
        .json({ message: "Nomor cycle harus unik dalam input!" });
    }

    const existingNumbers = exist.cycle.map((c) => c.numberCycle);
    if (cycleNumbers.some((num) => existingNumbers.includes(num))) {
      return res
        .status(400)
        .json({ message: "Nomor cycle sudah ada di database!" });
    }

    const newCycles = cycles.map((cycle) => ({
      numberCycle: cycle.numberCycle,
      stepCycle: cycle.stepCycle.map((step) => ({
        nama: step.nama,
        waktu_standar: step.waktu_standar,
      })),
    }));

    const updated = await Tes.findByIdAndUpdate(
      id,
      {
        $push: {
          cycle: { $each: newCycles },
        },
      },
      { new: true, runValidators: true }
    );
    // if (!updated) {
    //   return res.status(404).json({ message: "Data tidak ditemukan" });
    // }

    // for (const cycle of updated.cycle) {
    //   for (const step of cycle.stepCycle) {
    //     const existingTracking = await trackingDelv.findOne({
    //       customerId: id,
    //       numberCycle: cycle.numberCycle,
    //       nama: step.nama,
    //     });

    //     if (!existingTracking) {
    //       const newTracking = new trackingDelv({
    //         // customerId: id,
    //         // numberCycle: cycle.numberCycle,

    //         nama: step.nama,
    //         waktuStandar: step.waktu_standar,
    //         waktuAktual,
    //         delay,
    //         status: "-",
    //         ket: "-",
    //         createdAt: moment.tz(new Date(), "Asia/Jakarta"),
    //       });
    //       trackingUpdates.push(newTracking.save());
    //     } else {
    //       existingTracking.waktuStandar = step.waktu_standar;
    //       trackingUpdates.push(existingTracking.save());
    //     }
    //   }
    // }

    // await Promise.all(trackingUpdates);

    // const allTrackings = await trackingDelv.find({ customerId: id });
    // console.log(allTrackings);
    // const bulkOps = [];
    const trackingUpdates = [];
    const now = new Date();

    for (const kolom of updated.kolomSelected) {
      const waktuDelv = kolom.createdAt || now;
      const processedDnNumbers = new Set();

      for (const dataItem of kolom.data) {
        const dnNumber = dataItem.dn_number;
        if (processedDnNumbers.has(dnNumber)) continue; // skip jika sudah diproses
        processedDnNumbers.add(dnNumber);
        const numberCycle = dataItem.cycle || 1;

        //       for (const step of updated.stepCycle || []) {
        //         bulkOps.push({
        //           updateOne: {
        //             filter: {
        //               customerId: id,
        //               numberCycle,
        //               nama: step.nama,
        //               dnNumber,
        //             },
        //             update: {
        //               $set: {
        //                 waktuStandar: step.waktu_standar,
        //                 createdAt: now,
        //                 customerId: id,
        //                 numberCycle,
        //                 dnNumber,
        //                 tanggalDelv: createdAt,
        //                 nama: step.nama,
        //                 waktuAktual: dataItem.waktuAktual || null,
        //                 delay: dataItem.delay || null,
        //                 status: dataItem.status || "-",
        //                 ket: dataItem.ket || "-",
        //               },
        //               $setOnInsert: {
        //                 createdAt: moment.tz(createdAt, "Asia/Jakarta").toDate(),
        //               },
        //             },
        //             upsert: true,
        //           },
        //         });
        //       }
        //     }
        //   }

        //   if (bulkOps.length > 0) {
        //     await trackingDelv.bulkWrite(bulkOps);
        //   }

        //   return res.json({
        //     message: "Cycle berhasil diperbarui",
        //     data: updated,
        //   });
        // } catch (error) {
        //   console.error("Error:", {
        //     message: error.message,
        //     stack: error.stack,
        //     code: error.code,
        //   });

        //   if (error.code === 11000) {
        //     return res.status(400).json({
        //       message: "Data duplikat terdeteksi",
        //       suggestion: "Periksa nomor cycle yang unik",
        //     });
        //   }

        //   return res.status(500).json({
        //     message: "Terjadi kesalahan server",
        //     error: process.env.NODE_ENV === "development" ? error.message : undefined,
        //   });
        // }
        // };

        // //     for (const dataItem of kolom.data) {
        // //       const dnNumber = dataItem.dn_number;
        // //       const numberCycle = dataItem.cycle || 1;

        const matchedCycle = updated.cycle.find(
          (c) => c.numberCycle === numberCycle
        );
        if (!matchedCycle) continue;
        // for (const cycle of updated.cycle) {
        for (const step of matchedCycle.stepCycle || []) {
          const existingTracking = await trackingDelv.findOne({
            customerId: id,
            numberCycle,
            nama: step.nama,
            dnNumber,
          });

          if (!existingTracking) {
            let waktuAktual = null;
            let delay = null;
            let status = "-";

            if (step.nama === "Received Order") {
              const waktuAktualUTC = moment.utc(waktuDelv);
              const waktuStandarUTC = moment.utc(step.waktu_standar);

              const waktuStandarCorrected = waktuStandarUTC.set({
                year: waktuAktualUTC.year(),
                month: waktuAktualUTC.month(),
                date: waktuAktualUTC.date(),
              });

              const waktuAktualJakarta = waktuAktualUTC.tz("Asia/Jakarta");
              const waktuStandarJakarta =
                waktuStandarCorrected.tz("Asia/Jakarta");
              // console.log(
              //   "Waktu Aktual (Jakarta):",
              //   waktuAktualJakarta.format()
              // );
              // console.log("Waktu Standar:", waktuStandarJakarta.format());

              const diffMinutes = waktuAktualJakarta.diff(
                waktuStandarJakarta,
                "minutes"
              );
              // console.log(
              //   diffMinutes,
              //   "kok",
              //   waktuAktualJakarta,
              //   waktuStandarJakarta
              // );

              waktuAktual = waktuAktualJakarta.format("HH:mm");

              if (diffMinutes > 0) {
                delay = `-${diffMinutes} menit`;
                status = "Delay";
              } else if (diffMinutes < 0) {
                delay = `+${diffMinutes} menit`;
                status = "Advanced";
              } else {
                delay = `0 menit`;
                status = "On Time";
              }
            }

            const newTracking = new trackingDelv({
              customerId: id,
              numberCycle,
              dnNumber,
              tanggal: waktuDelv,
              nama: step.nama,
              waktuStandar: step.waktu_standar,
              waktuAktual: waktuAktual,
              delay,
              status,
              ket: "-",
              createdAt: moment.tz(waktuDelv, "Asia/Jakarta"),
            });

            trackingUpdates.push(newTracking.save());
          } else {
            existingTracking.waktuStandar = step.waktu_standar;
            trackingUpdates.push(existingTracking.save());
          }
        }
      }
    }

    await Promise.all(trackingUpdates);

    const allTrackings = await trackingDelv.find({ customerId: id });

    return res.json({ message: "Cycle berhasil diperbarui", data: updated });
  } catch (error) {
    console.error("Gagal update cycle:", error);
    return res.status(500).json({ message: "Nomor cycle sudah ada!", error });
  }
};
// for (const dataItem of kolom.data) {
//   const dnNumber = dataItem.dn_number;
//   const numberCycle = dataItem.cycle || 1;

//   for (const step of updated.stepCycle || []) {
//     const filter = {
//       customerId: id,
//       numberCycle,
//       nama: step.nama,
//       dnNumber,
//     };

//     const update = {
//       $set: {
//         waktuStandar: step.waktu_standar,

//         customerId: id,
//         numberCycle,
//         dnNumber,
//         tanggalDelv: createdAt,
//         nama: step.nama,
//         waktuStandar: step.waktu_standar,
//         waktuAktual,
//         delay,
//         status: "-",
//         ket: "-",
//       },
//       $setOnInsert: {
//         status: "-",
//         ket: "-",
//         createdAt: moment.tz(createdAt, "Asia/Jakarta").toDate(),
//       },
//     };

//     trackingUpdates.push(
//       trackingDelv.updateOne(filter, update, { upsert: true })
// .session(session)
//         );
//       }
//     }
//   }

//   await Promise.all(trackingUpdates);
//   // await session.commitTransaction();

//   return res.json({
//     message: "Cycle berhasil diperbarui",
//     data: updated,
//   });
// } catch (error) {
// await session.abortTransaction();

//     console.error("Error detail:", {
//       message: error.message,
//       stack: error.stack,
//       code: error.code,
//     });

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Data duplikat terdeteksi",
//         suggestion: "Periksa nomor cycle yang unik",
//       });
//     }

//     return res.status(500).json({
//       message: "Terjadi kesalahan server",
//       error: process.env.NODE_ENV === "development" ? error.message : undefined,
//     });

export const deleteData = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res
      .status(404)
      .json({ success: false, message: "Invalid Customer Id" });
  }

  try {
    await Tes.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Customer deleted" });
  } catch (error) {
    console.log("error in deleting Customer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getDataByName = async (req, res) => {
  try {
    const { namaCust } = req.params;

    if (!namaCust) {
      return res.status(400).json({
        success: false,
        message: "Full Name is required",
      });
    }

    // const data = await Tes.findOne({
    //   // nama: { $regex: new RegExp(`\\b${namaCust}\\b`, "i") },
    //   // nama: { $regex: new RegExp(`(^|\\s)${namaCust}(\\s|$)`, "i") },

    // });
    const containsNumber = /\d/.test(namaCust);

    let data = null;

    if (containsNumber) {
      // 2. Coba cari dulu dengan nama asli (apa adanya)
      data = await Tes.findOne({
        nama: { $regex: new RegExp(namaCust, "i") },
      });

      // 3. Kalau tidak ketemu, baru coba versi dibersihkan
      if (!data) {
        const cleaned = namaCust.replace(/[-_\s]/g, " ");
        data = await Tes.findOne({
          nama: { $regex: new RegExp(cleaned, "i") },
        });
      }
    } else {
      // 4. Kalau tidak mengandung angka, langsung pakai pecahan kata (split & regex per word)
      // const regexes = namaCust
      //   .replace(/[-_]/g, " ")
      //   .split(/\s+/)
      //   .map((word) => new RegExp(word, "i"));

      const words = namaCust.toLowerCase().split(/\s+/);
      const regexes = words.map((w) => new RegExp(`\\b${w}\\b`, "i"));

      data = await Tes.findOne({
        $and: regexes.map((r) => ({ nama: { $regex: r } })),
      });

      // data = await Tes.findOne({
      //   $or: regexes.map((r) => ({ nama: { $regex: r } })),
      // });
    }

    // 5. Balikan response
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Data not found",
      });
    }

    res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    console.error("Error in fetching data by fullname:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};

export const deleteCycle = async (req, res) => {
  const { id, numberCycle } = req.params;
  // const { numberCycle } = req.body;

  try {
    // const updated = await Tes.updateOne(
    //   id,
    //   {
    //     $pull: {
    //       cycle: { numberCycle: numberCycle },
    //     },
    //   },
    //   { new: true }
    // );

    // await Tes.updateOne(
    //   { _id: customerId, cycle: { $size: 0 } },
    //   { $set: { cycle: [] } }
    // );

    // if (!updated) {
    //   return res.status(404).json({ message: "Data tidak ditemukan" });
    // }

    const result = await Tes.updateOne(
      { _id: id },
      {
        $pull: {
          cycle: { numberCycle: Number(numberCycle) },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Customer tidak ditemukan" });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: `Cycle ${numberCycle} tidak ditemukan pada customer ini`,
      });
    }

    await Tes.updateOne(
      { _id: id, cycle: { $size: 0 } },
      { $set: { cycle: [] } }
    );

    return res.json({
      message: `Cycle ${numberCycle} berhasil dihapus`,
      data: result,
    });
  } catch (error) {
    console.error("Gagal menghapus cycle:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan saat menghapus cycle",
      error: error.message,
    });
  }
};

export const deleteDataHarian = async (req, res) => {
  const { id, idDataHarian } = req.params;

  // console.log(id, idDataHarian);
  try {
    const result = await Tes.updateOne(
      { _id: id },
      {
        $pull: {
          kolomSelected: { _id: idDataHarian },
        },
      }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    if (result.modifiedCount === 0) {
      return res.status(404).json({
        message: `Data harian dengan id ${idDataHarian} tidak ditemukan pada customer ini`,
      });
    }

    await Tes.updateOne(
      { _id: id, kolomSelected: { $size: 0 } },
      { $set: { kolomSelected: [] } }
    );

    return res.json({
      message: `Id data harian ${idDataHarian} berhasil dihapus`,
      data: result,
    });
  } catch (error) {
    console.error("Gagal menghapus data:", error);
    return res.status(500).json({
      message: "Terjadi kesalahan saat menghapus data",
      error: error.message,
    });
  }
};
