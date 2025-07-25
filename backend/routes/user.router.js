import express from "express";
import { rateLimit } from "express-rate-limit";
import { protect } from "../middleware/middleware.js";
import {
  getUser,
  createUser,
  loginUser,
  refreshAccessToken,
  deleteUser,
  logoutUser,
  updatePassword,
} from "../controllers/user.controller.js";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many login attempts, please try again later.",
});

const ubahLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 3,
  message: "Too many edit password attempts, please try again later.",
});

router.get("/", getUser);
router.put("/update-password/:userId", ubahLimiter, updatePassword);
router.post("/auth/login", loginLimiter, loginUser);
router.post("/auth/logout", logoutUser);
router.post("/auth/register", createUser);
router.post("/auth/refresh-token", refreshAccessToken);
router.get("/auth/me", protect, (req, res) => {
  res.json({
    success: true,
    message: "Token is valid",
    user: req.user,
  });
});
// router.get("/production", getUserinProduction);
router.delete("/:id", protect, deleteUser);
export default router;
