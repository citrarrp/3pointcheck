import express from "express";
import { protect } from "../middleware/middleware.js";
import {
  getUser,
  createUser,
  loginUser,
  refreshAccessToken,
  deleteUser,
} from "../controllers/user.controller.js";

const router = express.Router();

router.get("/", getUser);
router.post("/auth/login", loginUser);
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
