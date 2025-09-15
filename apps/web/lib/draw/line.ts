import { Shape } from "../types";
import { clearCanvas } from "./draw";

export function handleMouseMove(
  e: MouseEvent,
  startX: number,
  startY: number,
  endX: number,
  endY: number,
  isDrawing: boolean,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[]
) {
  endX = e.clientX;
  endY = e.clientY;
  if (isDrawing) {
    clearCanvas(ctx, existingShapes);
    ctx.beginPath();
    ctx.moveTo(startX, startY);
    ctx.lineTo(endX, endY);
    ctx.stroke();
  }
  return {
    endX,
    endY,
  };
}

export function renderLine(ctx: CanvasRenderingContext2D, shape: Shape) {
    if (shape.name === "line") {
        ctx.beginPath();
        ctx.moveTo(shape.x1, shape.y1);
        ctx.lineTo(shape.x2, shape.y2);
        ctx.stroke();
    }
}