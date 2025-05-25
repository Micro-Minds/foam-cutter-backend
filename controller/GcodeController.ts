import { Request, Response } from "express";
import { generateGCodeForCircle } from "../service/GCodeService";

export const generateCircleGCode = (req: Request, res: Response) => {
    const { radius, feedRate, stepSize } = req.body;

    if (!radius || !feedRate || !stepSize) {
        res.status(400).json({ message: "Missing required fields" });
    }

    const gcode = generateGCodeForCircle(radius, feedRate, stepSize);
    res.setHeader("Content-Type", "text/plain");
    res.send(gcode);
};
