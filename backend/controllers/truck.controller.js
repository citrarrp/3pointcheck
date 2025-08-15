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
  try {
    const {
      partnerName,
      customerName,
      route,
      destination,
      typeTruck,
      cycleSteps,
      lastSyncFromSOD,
    } = req.body;

    const customerDoc = await Tes.findOne({ customerName });
    if (!customerDoc) {
      return res.status(404).json({
        message: `Customer dengan nama "${customerName}" tidak ditemukan`,
      });
    }

    const newTruck = new trucks({
      partnerName,
      customerName,
      route,
      destination,
      typeTruck,
      cycleSteps,
      lastSyncFromSOD,
      customerId: customerDoc._id,
    });

    const savedTruck = await newTruck.save();
    res.status(201).json(savedTruck);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Gagal membuat truck baru", error: error.message });
  }
};

export const updateTruck = async (req, res) => {
  try {
    const {
      partnerName,
      customerName,
      route,
      destination,
      typeTruck,
      cycleSteps,
      lastSyncFromSOD,
    } = req.body;

    if (customerName) {
      const customerDoc = await Tes.findOne({ customerName });
      if (!customerDoc) {
        return res.status(404).json({
          message: `Customer dengan nama "${customerName}" tidak ditemukan`,
        });
      }
      customerId = customerDoc._id;
    }

    const updatedTruck = await trucks.findByIdAndUpdate(
      req.params.id,
      {
        partnerName,
        customerName,
        route,
        destination,
        typeTruck,
        cycleSteps,
        lastSyncFromSOD,
        ...(customerId && { customerId }),
      },
      { new: true, runValidators: true }
    );

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
