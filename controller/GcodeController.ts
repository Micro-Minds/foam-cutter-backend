/*
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
*/

import { Request, Response } from "express";
import { sendGCodeToArduino } from "../service/ArduinoService";

export const generateCircleGCode = async (req: Request, res: Response) => {
    const { radius, feedRate, stepSize } = req.body;

    if (!radius || !feedRate || !stepSize) {
         res.status(400).json({ error: "Missing input values." });
    }

    const gcodeLines: string[] = [];

    gcodeLines.push("G21");
    gcodeLines.push("G90");
    gcodeLines.push(`F${feedRate}`);

    const steps = 360 / stepSize;
    for (let angle = 0; angle <= 360; angle += stepSize) {
        const rad = (angle * Math.PI) / 180;
        const x = +(radius * Math.cos(rad)).toFixed(2);
        const y = +(radius * Math.sin(rad)).toFixed(2);
        gcodeLines.push(`G1 X${x} Y${y}`);
    }

    const gcodeString = gcodeLines.join("\n");

    try {
        await sendGCodeToArduino(gcodeString, "COM3", 115200); // update COM3 if needed
        res.json({ message: "G-code sent to Arduino successfully." });
    } catch (err: any) {
        console.log(err);
        res.status(500).json({ error: "Failed to send G-code to Arduino.", detail: err.message });
    }
};
