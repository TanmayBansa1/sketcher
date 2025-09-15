import { Shape } from "../types";
import { clearCanvas } from "./draw";

export function handleMouseMove(e: MouseEvent, startX: number, startY: number, radius: number, isDrawing: boolean, ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {
    const width = e.clientX - startX;
    const height = e.clientY - startY;

    radius = Math.max(width, height) / 2;
    if (isDrawing) {
      clearCanvas(ctx, existingShapes);
      ctx.beginPath();
      ctx.arc(startX + width / 2, startY + height / 2, radius, 0, 2 * Math.PI);
      ctx.closePath();
      ctx.stroke();
    }
}

export function renderCircle(ctx: CanvasRenderingContext2D, shape: Shape) {
    if (shape.name === "circle") {
    ctx.beginPath();
        ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        ctx.closePath();
        ctx.stroke();
    }
}