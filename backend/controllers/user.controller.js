import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateAccessToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      npk: user.npk,
      fullname: user.fullname,
      position: user.position,
      dept: user.dept,
    },
    process.env.SECRET_ACCESS_TOKEN,
    { expiresIn: "1h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      npk: user.npk,
      fullname: user.fullname,
      position: user.position,
      dept: user.dept,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

export const getUser = async (req, res) => {
  const { position } = req.query;
  try {
    let filter = {};

    if (position) {
      filter.position = {
        $in: Array.isArray(position) ? position : [position],
      };
    }
    const fields = await user.find(filter);
    res
      .status(200)
      .json({ success: true, message: "Berhasil diambil", data: fields });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const User = await user.findById(id);
    if (!User) {
      res.status(404).json({ success: false, message: "User tidak ditemukan" });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid user ID format");
    }

    await user.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User berhasil dihapus!" });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
function getLocalISODate() {
  const now = new Date();
  const offset = now.getTimezoneOffset() * 60000;
  const localISO = new Date(now.getTime() - offset).toISOString();
  return localISO;
}

export const createUser = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: "Request body is missing" });
  }

  const { fullname, npk, password, position, dept } = req.body;
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    let User = await user.findOne({ fullname, npk });
    if (User) return res.status(400).json({ message: "User already exists" });

    User = new user({
      fullname,
      npk,
      password: hashedPassword,
      position,
      dept,
    });
    await User.save();

    return res
      .status(200)
      .json({ success: true, message: "Register success!", data: User });
  } catch (error) {
    console.error("Error saving user:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  const { userId } = req.params;
  const { oldPassword, newPassword } = req.body;

  try {
    const User = await user.findById(userId);
    if (!User)
      return res.status(404).json({ message: "User Tidak Ditemukan!" });

    const isMatch = await bcrypt.compare(oldPassword, User.password);
    if (!isMatch)
      return res.status(400).json({ message: "Password Lama Tidak Sesuai!" });

    const salt = await bcrypt.genSalt(12);
    User.password = await bcrypt.hash(newPassword, salt);
    await User.save();

    res
      .status(200)
      .json({ success: true, message: "Password Berhasil Diperbarui!" });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { npk, password } = req.body;

  try {
    const existingUser = await user.findOne({ npk });
    console.log(existingUser);
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid password" });
    }

    const accessToken = generateAccessToken(existingUser);
    const refreshToken = generateRefreshToken(existingUser);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Lax",
    });
    console.log(refreshToken, "ada toeken refresh");
    res.status(200).json({
      success: true,
      data: {
        accessToken,
        // existingUser: {
        //   id: existingUser._id,
        //   fullname: existingUser.fullname,
        //   role: existingUser.roles,
        // },
      },
    });
  } catch (error) {
    console.error("Error saving user:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const refreshAccessToken = (req, res) => {
  console.log("Cookies from client:", req.cookies);
  console.log("refreshToken:", req.cookies.refreshToken);
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.REFRESH_TOKEN, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  });
};

export const logoutUser = async (req, res) => {
  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: "Lax",
  });

  res.status(200).json({
    success: true,
    message: "Sukses logout",
  });
};
