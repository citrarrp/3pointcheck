import trucks from "../models/truck.js";
import Tes from "../models/tes.js";

export const getTrucks = async (req, res) => {
  try {
    const data = await trucks.find().populate("customerId");
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data trucks", error: error.message });
  }
};

export const getTruckById = async (req, res) => {
  try {
    const data = await trucks.findById(req.params.id).populate("customerId");
    if (!data)
      return res.status(404).json({ message: "Truck tidak ditemukan" });
    res.status(200).json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data truck", error: error.message });
  }
};

export const createTruck = async (req, res) => {
  // try {
  //   const {
  //     partnerName,
  //     route,
  //     destination,
  //     typeTruck,
  //     ETACust,
  //     // cycleSteps,
  //     // lastSyncFromSOD,
  //   } = req.body;

  //   const filter = {
  //     destination,
  //   };

  //   let results = {};
  //   const customerDoc = await Tes.findOne({ nama: destination });
  //   if (!customerDoc) {
  //     return res.status(404).json({
  //       message: `Customer dengan nama "${destination}" tidak ditemukan`,
  //     });
  //   }

  //   // const newTruck = new trucks({
  //   //   partnerName,
  //   //   route,
  //   //   destination,
  //   //   typeTruck,
  //   //   ETACust,
  //   //   // cycleSteps,
  //   //   // lastSyncFromSOD,
  //   //   customerId: customerDoc._id,
  //   // });

  //   // const savedTruck = await newTruck.save();
  //   // res.status(201).json(savedTruck);
  //   const update = {
  //     $set: {
  //       partnerName,
  //       typeTruck,
  //       route,
  //       ETACust,
  //     },
  //   };

  //   const options = { upsert: true, new: true };
  //   const result = await trucks.findOneAndUpdate(filter, update, options);
  //   results.push(result);

  //   res
  //     .status(200)
  //     .json({ message: "Berhasil Mengunggah Data!", data: results });
  // } catch (error) {
  //   res
  //     .status(400)
  //     .json({ message: "Gagal membuat truck baru", error: error.message });
  // }
  try {
    const truckData = req.body; // array of trucks

    // const bulkOps = truckData.map((truck) => ({
    //   updateOne: {
    //     filter: { destination: truck.destination },
    //     update: { $set: truck },
    //     upsert: true,
    //   },
    // }));

    // await trucks.bulkWrite(bulkOps);
    const results = [];

    for (const truck of truckData) {
      try {
        const customerDoc = await Tes.findOne({ nama: truck.destination });
        if (!customerDoc) {
          results.push({
            destination: truck.destination,
            status: "failed",
            reason: "Customer not found",
          });
          continue;
        }

        const updateData = { ...truck, customerId: customerDoc._id };

        await trucks.updateOne(
          { destination: truck.destination },
          { $set: updateData },
          { upsert: true }
        );

        results.push({
          destination: truck.destination,
          status: "success",
        });
      } catch (err) {
        results.push({
          destination: truck.destination,
          status: "error",
          reason: err.message,
        });
      }
    }

    res.json({ message: "Upsert trucks success", count: truckData.length });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Error upserting trucks", error: err.message });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const {
      partnerName,
      route,
      destination,
      typeTruck,
      ETACust,
      // cycleSteps,
      // lastSyncFromSOD,
    } = req.body;

    let customerId = null;

    console.log(destination);
    if (destination) {
      const customerDoc = await Tes.findOne({ nama: "TMMIN KARAWANG 1" });
      if (!customerDoc) {
        return res.status(404).json({
          message: `Customer dengan nama "${destination}" tidak ditemukan`,
        });
      }
      console.log(customerDoc);
      customerId = customerDoc._id;
    }

    const updatedTruck = await trucks.findByIdAndUpdate(
      req.params.id,
      {
        partnerName,
        route,
        destination,
        typeTruck,
        ETACust,
        // cycleSteps,
        // lastSyncFromSOD,
        ...(customerId && { customerId }),
      },
      { new: true, runValidators: true }
    );
    console.log(updatedTruck);

    if (!updatedTruck)
      return res.status(404).json({ message: "Truck tidak ditemukan" });
    res.status(200).json(updatedTruck);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal mengupdate truck", error: error.message });
  }
};

export const deleteTruck = async (req, res) => {
  try {
    const deletedTruck = await trucks.findByIdAndDelete(req.params.id);
    if (!deletedTruck)
      return res.status(404).json({ message: "Truck tidak ditemukan" });
    res.status(200).json({ message: "Truck berhasil dihapus" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal menghapus truck", error: error.message });
  }
};
