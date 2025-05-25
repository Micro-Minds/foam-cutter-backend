import express from "express";
import { generateCircleGCode } from "../controller/GcodeController";

const router = express.Router();
router.post("/circle", generateCircleGCode);

export default router;
