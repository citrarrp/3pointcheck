import user from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, roles: user.roles },
    process.env.SECRET_ACCESS_TOKEN,
    { expiresIn: "3h" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, username: user.username, roles: user.roles },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: "7d",
    }
  );
};

export const getUser = async (req, res) => {
  const { roles } = req.query;
  try {
    let filter = {};

    if (roles) {
      filter.roles = { $in: Array.isArray(roles) ? roles : [roles] };
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
  console.log("Askes ini");
  const { id } = req.params;
  console.log(req.user, "RES");

  try {
    const User = await user.findById(id);
    if (!User) {
      res.status(404).json({ success: false, message: "User tidak ditemukan" });
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
    await user.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "User berhasil dihapus!" });
  } catch (error) {
    console.log("error in fetching User:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
// export const getUserId = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userData = await user.findOne({ where: { id } });
//     if (!userData) {
//       return res
//         .status(404)
//         .json({ success: false, message: "User not found" });
//     }
//     res.status(200).json({ success: true, data: fields });
//   } catch (error) {
//     console.log("error in fetching Label Fields:", error.message);
//     res.status(500).json({ success: false, message: "Server Error" });
//   }
// };

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

  const { username, password, roles } = req.body;
  console.log(username, password, roles, req.body);
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  try {
    let User = await user.findOne({ username });
    if (User) return res.status(400).json({ message: "User already exists" });

    User = new user({ username, password: hashedPassword, roles });
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

export const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    const existingUser = await user.findOne({ username: username });
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
      secure: process.env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "Strict",
    });

    res.status(200).json({
      success: true,
      data: {
        accessToken,
        existingUser: {
          id: existingUser._id,
          username: existingUser.username,
          role: existingUser.roles,
        },
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
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).json({ message: "No token" });

  jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid refresh token" });

    const newAccessToken = generateAccessToken(user);
    res.status(200).json({ accessToken: newAccessToken });
  });
};
