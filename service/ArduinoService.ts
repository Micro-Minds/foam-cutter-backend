import {SerialPort} from "serialport";

export const sendGCodeToArduino = async (
    gcode: string,
    portName = "COM7",
    baudRate = 115200
): Promise<void> => {
    return new Promise((resolve, reject) => {
        const port = new SerialPort({ path: portName, baudRate }, (err) => {
            if (err) {
                console.error("Error opening serial port:", err.message);
                return reject(new Error(`Error opening serial port: ${err.message}`));
            }
        });

        const lines = gcode.split("\n").filter(line => line.trim().length > 0);
        let currentLine = 0;
        let buffer = "";

        // Function to send the next line
        const sendNextLine = () => {
            if (currentLine < lines.length) {
                const lineToSend = lines[currentLine++];
                console.log("📤 Sending:", lineToSend);
                port.write(lineToSend + "\n");
            } else {
                // All lines sent, close port gracefully
                port.write("\n", () => {
                    port.drain(() => {
                        port.close(() => {
                            console.log("✅ Finished sending G-code and closed port.");
                            resolve();
                        });
                    });
                });
            }
        };

        port.on("open", () => {
            console.log("✅ Serial port opened:", portName);
            sendNextLine(); // start sending first line
        });

        // **Insert your updated data event handler here:**
        port.on("data", (data) => {
            buffer += data.toString();
            process.stdout.write("📥 " + data.toString());

            // Remove echo lines from buffer
            buffer = buffer.replace(/Received:.*(\r\n|\n)/g, "");

            // Check if buffer has "ok" or "ACK" acknowledging the last command
            if (buffer.includes("ok") || buffer.includes("OK") || buffer.includes("ACK")) {
                buffer = "";  // Clear for next response
                sendNextLine();
            }
        });

        port.on("error", (err) => {
            console.error("❌ Serial port error:", err.message);
            reject(err);
        });
    });
};
