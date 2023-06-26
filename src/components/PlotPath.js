import { DrawArrowHead } from "./DrawArrowHead"

export const plotPath = (context, floorPath) => {
    console.log("plot path")
    console.log(floorPath)
    if (floorPath && floorPath.length != 0) {
        console.log("plot inside")
        context.beginPath()
        context.moveTo(floorPath[0][0], floorPath[0][1])
        for (var i = 1; i < floorPath.length; i++) {
            context.lineTo(floorPath[i][0], floorPath[i][1])
        }
        context.lineWidth = 9;
        context.stroke()
        context.closePath()
        for (var i = 2; i < floorPath.length; i++) {
            DrawArrowHead(context, floorPath[i - 1], floorPath[i]);
        }
    }
}  