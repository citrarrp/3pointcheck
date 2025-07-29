import materialCustomer from "../models/masterPart.js";
import mongoose from "mongoose";

export const getMaterial = async (req, res) => {
  try {
    const materials = await materialCustomer.find({}).sort({ material: 1 });
    res
      .status(200)
      .json({ success: true, message: "Berhasil diambil", data: materials });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getMaterialbyData = async (req, res) => {
  const { customer_material, material, material_description } = req.params;
  try {
    const materials = await materialCustomer.find(
      customer_material,
      material,
      material_description
    );
    res
      .status(200)
      .json({ success: true, message: "Berhasil diambil", data: materials });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteMaterial = async (req, res) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400);
      throw new Error("Invalid ID format");
    }

    const deleted = await materialCustomer.findByIdAndDelete(id);
    if (!deleted) {
      return res
        .status(404)
        .json({ success: false, message: "Material tidak ditemukan" });
    }

    res.status(200).json({ success: true, message: "User berhasil dihapus!" });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// export const createMaterial = async (req, res) => {
//   if (!req.body) {
//     return res.status(400).json({ message: "Request body is missing" });
//   }
//   try {
//     let material = await materialCustomer.findOne({ fullname });
//     if (material)
//       return res.status(400).json({ message: "Material already exists" });

//     const newMaterial = new user({ fullname, password: hashedPassword, roles });
//     await newMaterial.save();

//     return res.status(200).json({ success: true, message: "Data tersimpan!" });
//   } catch (error) {
//     console.error("Error saving user:", error.message);
//     res
//       .status(500)
//       .json({ success: false, message: "Server Error", error: error.message });
//   }
// };
export const createMaterial = async (req, res) => {
  const data = req.body;

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const requiredFields = [
    "sales_organization",
    "distribution_channel",
    "customer",
    "material",
  ];

  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Field berikut diperlukan: ${missingFields.join(", ")}`,
      missingFields,
    });
  }

  try {
    const filter = {
      sales_organization: data.sales_organization,
      distribution_channel: data.distribution_channel,
      customer: data.customer,
      material: data.material,
    };

    const options = {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
    };

    const result = await materialCustomer.findOneAndUpdate(
      filter,
      data,
      options
    );

    return res.status(200).json({
      success: true,
      message: result.isNew
        ? "Data baru berhasil disimpan!"
        : "Data berhasil diperbarui!",
      data: result,
    });
  } catch (error) {
    console.error("Error in upsert material:", error.message);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Data dengan kombinasi unik yang sama sudah ada",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const updateCustomerMaterialDesc = async (req, res) => {
  const data = req.body;
  console.log(data, "tambahan");

  if (!data || Object.keys(data).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Request body is missing",
    });
  }

  const requiredFields = [
    // "sales_organization",
    // "distribution_channel",
    "customer",
    "sap_number",
    "customer_material",
    // "material_description",
  ];
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: `Field berikut diperlukan: ${missingFields.join(", ")}`,
      missingFields,
    });
  }

  function normalizeCustomerMaterial(code) {
    const match = code.match(/^([A-Z]{3,4})0([1-9]\d*)00([1-9]\d*)$/);
    if (!match) return code;

    const prefix = match[1]; // e.g. "ADM"
    const angka1 = match[2]; // e.g. "15"
    const angka2 = match[3]; // e.g. "1"

    return `${prefix}0${angka2}00${angka1}`;
  }

  try {
    const normalized = normalizeCustomerMaterial(data.customer);

    const filter = {
      // sales_organization: data?.sales_organization,
      // distribution_channel: data?.distribution_channel,
      customer: data.customer,
      sap_number: data.sap_number,
      // material: data.sap_number,
      customer_material: data.customer_material,
      // material_description: data.material_description,
    };

    console.log(data.customer, normalized, "contoh customer");
    let existing = await materialCustomer.findOne(filter);

    if (!existing) {
      console.log(
        "Tidak ditemukan, coba ulang pakai fallback normalized customer"
      );

      filter.customer = normalized;
      existing = await materialCustomer.findOne(filter);
    }

    if (!existing) {
      // console.log(data, "data baru");
      const newData = new materialCustomer({
        ...data,
        material: data.sap_number,
        line: data.line === "-" ? "N/A" : data.line,
      });

      await newData.save();

      return res.status(200).json({
        success: true,
        message: "Data baru berhasil ditambahkan!",
        data: newData,
      });
    }
    // const update = {
    //   $set: {
    //     customer_description: data.customer_description,
    //     line: data.line,
    //   },
    //   $setOnInsert: {
    //     material: data.material,
    //     sap_number: data.sap_number,
    //     customer_material: data.customer_material,
    //     material_description: data.material_description,
    //   },
    // };
    else {
      console.log("buruh update");
      const needsUpdate =
        !existing.line?.trim() ||
        existing.line === "-" ||
        !existing.customer_description?.trim() ||
        existing.customer_description === "-";

      if (!needsUpdate) {
        return res.status(200).json({
          success: true,
          message: "Data sudah ada dan lengkap, tidak diupdate.",
          data: existing,
        });
      }
      existing.line = (data.line === "-" ? "N/A" : data.line) || existing.line;
      existing.customer_description =
        data.customer_description || existing.customer_description;

      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Data sudah ada → berhasil diperbarui.",
        data: existing,
      });
    }

    // const options = {
    //   upsert: true,
    //   new: true,
    //   setDefaultsOnInsert: true,
    // };

    // const result = await materialCustomer.findOneAndUpdate(
    //   filter,
    //   update,
    //   options
    // );

    // res.status(200).json({
    //   success: true,
    //   message: result.isNew
    //     ? "Data baru berhasil ditambahkan!"
    //     : "Data berhasil diperbarui!",
    //   data: result,
    // });
  } catch (error) {
    console.error("Error updating customer material:", error.message);

    console.log("disini");
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Data dengan kombinasi unik sudah ada",
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
