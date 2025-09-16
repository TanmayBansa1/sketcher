import axios from "axios";
import { Shape } from "../types";
import { handleMouseMove as handleMouseMoveRectangle } from "./rectangle";
import { handleMouseMove as handleMouseMoveCircle, renderCircle } from "./circle";
import { handleMouseMove as handleMouseMoveLine, renderLine } from "./line";
export function initDraw(
  canvas: HTMLCanvasElement,
  roomSlug: string,
  socket: WebSocket,
  currentShape: "rectangle" | "circle" | "line"
) {
  // Ensure previous listeners can be cleaned up when tool changes
  const controller = new AbortController();
  const { signal } = controller;
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
      renderIncomingShape(shape, ctx, existingShapes);
    }
  };
  if (currentShape === "rectangle") {
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;
    let isDrawing = false;
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
    }, { signal });

    canvas.addEventListener("mousemove", (e) =>
      handleMouseMoveRectangle(
        e,
        startX,
        startY,
        width,
        height,
        isDrawing,
        ctx,
        existingShapes
      )
    , { signal });
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
    }, { signal });
  }
  if (currentShape === "circle") {
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;
    let radius = 0;
    let isDrawing = false;
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
    }, { signal });
    canvas.addEventListener("mousemove", (e) =>
      handleMouseMoveCircle(e, startX, startY, radius, isDrawing, ctx, existingShapes)
    , { signal });
    canvas.addEventListener("mouseup", (e) => {
      isDrawing = false;
      width = e.clientX - startX;
      height = e.clientY - startY;
      radius = Math.max(width, height) / 2;
      const shape = {
        name: "circle",
        x: startX + width / 2,
        y: startY + height / 2,
        radius: radius,
      } as Shape;
      existingShapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "room_message",
          roomSlug: roomSlug,
          message: JSON.stringify(shape),
        })
      );
    }, { signal });
  }
  if(currentShape === "line") {
    let startX = 0;
    let startY = 0;
    let endX = 0;
    let endY = 0;
    let isDrawing = false;
  
    canvas.addEventListener("mousedown", (e) => {
      isDrawing = true;
      startX = e.clientX;
      startY = e.clientY;
    }, { signal });
    canvas.addEventListener("mousemove", (e) => {
      const { endX: newEndX, endY: newEndY } = handleMouseMoveLine(e, startX, startY, endX, endY, isDrawing, ctx, existingShapes)
      endX = newEndX;
      endY = newEndY;
    }, { signal });
  
    canvas.addEventListener("mouseup", () => {
      isDrawing = false;
      const shape = {
        name: "line",
        x1: startX,
        y1: startY,
        x2: endX,
        y2: endY,
      } as Shape;
      existingShapes.push(shape);
      socket.send(
        JSON.stringify({
          type: "room_message",
          roomSlug: roomSlug,
          message: JSON.stringify(shape),
        })
      );
    }, { signal });
  }

  // return cleanup to remove all listeners when shape changes
  return () => {
    controller.abort();
    // Avoid duplicating message handlers if re-initialized
    socket.onmessage = null as unknown as (this: WebSocket, ev: MessageEvent<unknown>) => unknown;
  };
}

export function clearCanvas(
  ctx: CanvasRenderingContext2D,
  existingShapes: Shape[]
) {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  if (!Array.isArray(existingShapes) || existingShapes.length === 0) return;
  existingShapes.forEach((shape) => {
    if (shape.name === "rectangle") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.name === "circle") {
      renderCircle(ctx, shape);
    }
    if (shape.name === "line") {
      renderLine(ctx, shape);
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

function renderIncomingShape(
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
    renderCircle(ctx, shape);
  }
  if (shape.name === "line") {
    renderLine(ctx, shape);
  }
}
