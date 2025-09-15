import { Shape } from "../types";
import { clearCanvas } from "./draw";
export function handleMouseMove(e: MouseEvent, startX: number, startY: number, width: number, height: number, isDrawing: boolean, ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {
    width = e.clientX - startX;
    height = e.clientY - startY;
    if (isDrawing) {
      clearCanvas(ctx, existingShapes);
      ctx.strokeRect(startX, startY, width, height);
    }
}