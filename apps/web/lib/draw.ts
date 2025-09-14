import axios from "axios";
import { Shape } from "./types";
export function initDraw(
  canvas: HTMLCanvasElement,
  roomSlug: string,
  socket: WebSocket
) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.strokeStyle = "red";

  let existingShapes: Shape[] = [];

  // Load existing shapes asynchronously
  (async () => {
    try {
      const shapes = await getExistingShapes(roomSlug);
      existingShapes = Array.isArray(shapes) ? shapes : [];
      clearCanvas(ctx, existingShapes);
    } catch (error) {
      console.error("Failed to load existing shapes:", error);
      existingShapes = [];
    }
  })();
  socket.onmessage = (e) => {
    const message = JSON.parse(e.data);

    if (message.type === "room_message") {
        const shape: Shape = JSON.parse(message.message);
        drawShape(shape, ctx, existingShapes);
    }
  };
  let startX = 0;
  let startY = 0;
  let width = 0;
  let height = 0;
  let isDrawing = false;
  canvas.addEventListener("mousedown", (e) => {
    isDrawing = true;
    startX = e.clientX;
    startY = e.clientY;
  });

  canvas.addEventListener("mousemove", (e) => {
    width = e.clientX - startX;
    height = e.clientY - startY;
    if (isDrawing) {
      clearCanvas(ctx, existingShapes);
      ctx.strokeRect(startX, startY, width, height);
    }
  });
  canvas.addEventListener("mouseup", (e) => {
    isDrawing = false;
    width = e.clientX - startX;
    height = e.clientY - startY;
    const shape = {
      name: "rectangle",
      x: startX,
      y: startY,
      width,
      height,
    } as Shape;
    existingShapes.push(shape);
    socket?.send(
      JSON.stringify({
        type: "room_message",
        roomSlug: roomSlug,
        message: JSON.stringify(shape),
      })
    );
  });
}

function clearCanvas(ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (!Array.isArray(existingShapes) || existingShapes.length === 0) return;
  existingShapes.forEach((shape) => {
    if (shape.name === "rectangle") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.name === "circle") {
      ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
    }
    if (shape.name === "line") {
      ctx.beginPath();
      ctx.moveTo(shape.x1, shape.y1);
      ctx.lineTo(shape.x2, shape.y2);
      ctx.stroke();
    }
  });
  return;
}

async function getExistingShapes(roomSlug: string): Promise<Shape[]> {
  try {
    const _response = await axios.get(`/api/shapes/${roomSlug}`);
    const shapes = _response.data.map((shape: any) =>
      JSON.parse(shape.message)
    );
    console.log(shapes);
    return Array.isArray(shapes) ? shapes : [];
  } catch (error) {
    console.error("Error getting existing shapes:", error);
    return [];
  }
}

function drawShape(
  shape: Shape,
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[]
) {
  existingShapes.push(shape);
  clearCanvas(ctx, existingShapes);
  if (shape.name === "rectangle") {
    ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
  }
  if (shape.name === "circle") {
    ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
  }
  if (shape.name === "line") {
    ctx.beginPath();
    ctx.moveTo(shape.x1, shape.y1);
    ctx.lineTo(shape.x2, shape.y2);
    ctx.stroke();
  }
}
