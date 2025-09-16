"use client";
import { useEffect, useRef, useState } from "react";
import { initDraw } from "@/lib/draw/draw";
import { Circle, LineSquiggleIcon, RectangleHorizontalIcon } from "lucide-react";
import ShapeSelectionIcon from "./ShapeSelectionIcon";

export default function CustomCanvas( { roomSlug,socket }: {roomSlug: string, socket: WebSocket}) {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [currentShape, setCurrentShape] = useState<"rectangle" | "circle" | "line">("rectangle");

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const cleanup = initDraw(canvas, roomSlug, socket, currentShape);
			return () => {
				if (typeof cleanup === "function") cleanup();
			};
		}
	}, [canvasRef, roomSlug, socket, currentShape]);

	return (
		<div ref={containerRef} className="bg-amber-100 absolute box-border w-full h-full">
				<canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}>

				</canvas>
			<div className="absolute top-0 p-2 gap-2 w-full bg-amber-100 flex items-center justify-center">
				<ShapeSelectionIcon icon={<RectangleHorizontalIcon />} onClick={() => {setCurrentShape("rectangle")}} isSelected={currentShape === "rectangle"}>
				</ShapeSelectionIcon>
				<ShapeSelectionIcon icon={<Circle />} onClick={() => {setCurrentShape("circle")}} isSelected={currentShape === "circle"}>
				</ShapeSelectionIcon>
				<ShapeSelectionIcon icon={<LineSquiggleIcon/>} onClick={() => {setCurrentShape("line")}} isSelected={currentShape === "line"}>
				</ShapeSelectionIcon>
			</div>
		</div>
	)
}