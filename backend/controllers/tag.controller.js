import labelTag from "../models/labelTag.js";
import moment from "moment-timezone";
export const updateProduksi = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { customer, material, line, operator, shift, date } = req.body;

  if (!material || !operator || !shift) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    let tag = await labelTag.findOne({
      customer,
      material,
      line,
      shift: String(shift),
      date: moment(date).format("DD-MM-YY"),
    });

    if (tag) {
      tag.qty += 1;
      tag.history.push({
        operator,
        waktuUpdated: moment.tz("Asia/Jakarta"),
      });

      await tag.save();
    } else {
      tag = await labelTag.create({
        customer,
        material,
        line,
        shift,
        qty: 1,
        sequence: 0,
        history: [
          {
            operator,
            waktuUpdated: moment.tz("Asia/Jakarta"),
          },
        ],
        date: moment(date).format("DD-MM-YY"),
      });
    }

    const allTags = await labelTag.find({
      customer,
      material,
      line,
      date: moment(date).format("DD-MM-YY"),
    });

    const totalQty = allTags.reduce((sum, doc) => sum + doc.qty, 0);

    await labelTag.updateMany(
      {
        customer,
        material,
        line,
        date: moment(date).format("DD-MM-YY"),
      },
      { $set: { sequence: totalQty } }
    );

    return res
      .status(200)
      .json({ success: true, message: "Update success!", data: tag });
  } catch (error) {
    console.error("Error updating produksi:", error.message);
    res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

export const getProduksi = async (req, res) => {
  const { customer, material, line, shift, date } = req.query;
  console.log(customer, material, line, shift, date);
  if (!material || !date || !shift) {
    return res.status(400).json({ message: "Missing required query params" });
  }

  console.log("masuk sini");
  try {
    const tags = await labelTag.find({
      customer,
      material,
      line,
      shift,
      date: moment(date).format("DD-MM-YY"),
    });

    console.log(tags, "data ini");
    return res.status(200).json({
      success: true,
      message: "Data retrieved successfully",
      data: tags,
    });
  } catch (error) {
    console.error("Error getting produksi:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};
