import axios from "axios";
import { Room, Shape } from "./types";
export function initDraw(canvas: HTMLCanvasElement, room: Room) {
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    ctx.strokeStyle = "red";

    let existingShapes: Shape[] = [];
    
    // Load existing shapes asynchronously
    (async () => {
        try {
            existingShapes = await getExistingShapes(room.slug);
            clearCanvas(ctx, existingShapes);
        } catch (error) {
            console.error("Failed to load existing shapes:", error);
        }
    })();
    let startX = 0;
    let startY = 0;
    let width = 0;
    let height = 0;
    let isDrawing = false;
    canvas.addEventListener("mousedown", (e)=>{
        isDrawing = true;
        startX = e.clientX;
        startY = e.clientY;
    })

    canvas.addEventListener("mousemove", (e)=>{
        width = e.clientX - startX;
        height = e.clientY - startY;
        if(isDrawing){
            clearCanvas(ctx, existingShapes);
            ctx.strokeRect(startX, startY, width, height);
        }
    })
    canvas.addEventListener("mouseup", (e)=>{
        isDrawing = false;
        width = e.clientX - startX;
        height = e.clientY - startY;
        existingShapes.push({
            name: "rectangle",
            x: startX,
            y: startY,
            width, height
        })
    })
}

function clearCanvas(ctx: CanvasRenderingContext2D, existingShapes: Shape[]) {

    if(!ctx) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    existingShapes.forEach(shape => {
        if(shape.name === "rectangle") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
        if(shape.name === "circle") {
            ctx.arc(shape.x, shape.y, shape.radius, 0, 2 * Math.PI);
        }
        if(shape.name === "line") {
            ctx.beginPath();
            ctx.moveTo(shape.x1, shape.y1);
            ctx.lineTo(shape.x2, shape.y2);
            ctx.stroke();
        }
    })
}

async function getExistingShapes(roomSlug: string): Promise<Shape[]> {
    try {
        const _response = await axios.get(`/api/shapes/${roomSlug}`);
        
        // Backend returns { chats: [...] } but we need shapes
        // For now, return empty array since the backend endpoint returns chats, not shapes
        return [] as Shape[];
    } catch (error) {
        console.error("Error getting existing shapes:", error);
        return [] as Shape[];
    }
}