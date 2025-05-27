import { SerialPort } from "serialport";

export const sendGCodeToArduino = async (gcode: string, portName: string = "COM3", baudRate: number = 115200): Promise<void> => {
    const port = new SerialPort({
        path: portName,
        baudRate: baudRate,
    });

    port.on("open", () => {
        console.log("Serial port opened");

        const gcodeLines = gcode.split("\n");

        let index = 0;

        const sendLine = () => {
            if (index >= gcodeLines.length) {
                port.write("\n"); // optional: end signal
                console.log("Finished sending G-code.");
                port.close();
                return;
            }

            const line = gcodeLines[index].trim();
            if (line) {
                port.write(line + "\n", (err) => {
                    if (err) {
                        console.error("Error writing to serial port:", err.message);
                    }
                });
            }

            index++;
            setTimeout(sendLine, 50); // delay between lines
        };

        sendLine();
    });

    port.on("error", (err) => {
        console.error("Serial port error:", err.message);
    });
};
