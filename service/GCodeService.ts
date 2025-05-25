export function generateGCodeForCircle(
    radius: number,
    feedRate: number,
    stepSize: number
): string {
    const gcode: string[] = [];

    gcode.push("G21 ; Set units to mm");
    gcode.push("G90 ; Absolute positioning");
    gcode.push("G1 Z5.0 F500 ; Raise to safe height");
    gcode.push("G0 X0 Y0 ; Go to start");
    gcode.push(`G1 Z-1.0 F200`);
    gcode.push(`G1 F${feedRate}`);

    for (let angle = 0; angle <= 360; angle += stepSize) {
        const radians = (angle * Math.PI) / 180;
        const x = radius * Math.cos(radians);
        const y = radius * Math.sin(radians);
        gcode.push(`G1 X${x.toFixed(3)} Y${y.toFixed(3)}`);
    }

    gcode.push("G1 Z5.0 ; Lift up");
    gcode.push("G0 X0 Y0 ; Back to origin");
    gcode.push("M30 ; End program");

    return gcode.join("\n");
}
