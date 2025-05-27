import { Request, Response } from "express";
import { generateGCodeForCircle } from "../service/GCodeService";
import { sendGCodeToArduino } from "../service/ArduinoService";

export const generateCircleGCode = async (req: Request, res: Response) => {
    const { radius, feedRate, stepSize } = req.body;

    if (!radius || !feedRate || !stepSize) {
        res.status(400).json({ error: "Missing input values." });
    }

    const gcode = generateGCodeForCircle(radius, feedRate, stepSize);
    console.log(gcode);

    try {
        await sendGCodeToArduino(gcode, "COM3", 115200);
        res.status(200).json({ message: "G-code sent to Arduino successfully." });
    } catch (error: any) {
        res.status(500).json({ error: "Failed to send G-code", detail: error.message });
    }
};
