import { SerialPort } from "serialport";

export const sendGCodeToArduino = async (
    gcode: string,
    portName: string = "COM3", // Use the actual port ESP32 is connected to
    baudRate: number = 115200
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const port = new SerialPort({ path: portName, baudRate: baudRate }, (err) => {
            if (err) return reject(err);
        });

        port.on("open", () => {
            console.log("Serial port opened");
            const lines = gcode.split("\n");
            let i = 0;

            const sendLine = () => {
                if (i >= lines.length) {
                    console.log("Finished sending G-code");
                    port.write("\n", () => port.close());
                    return resolve();
                }

                const line = lines[i++];
                port.write(line + "\n", (err) => {
                    if (err) console.error("Write error:", err.message);
                });

                setTimeout(sendLine, 50);
            };

            sendLine();
        });

        port.on("error", (err) => {
            console.error("Serial port error:", err.message);
            reject(err);
        });
    });
};
