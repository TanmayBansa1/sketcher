"use client";
import { useEffect, useRef } from "react";
import { initDraw } from "@/lib/draw";
import { useElementSize } from "@/lib/useElementSize";
import {type Room } from "@/lib/types";
export default function CustomCanvas( { room: room }: {room: Room}) {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const dimensions = useElementSize(containerRef);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			initDraw(canvas, room);
		}
	}, [dimensions, canvasRef, room]);

	return (
		<div ref={containerRef} style={{ width: "100%", height: "100%" }}>
			{dimensions.width > 0 && dimensions.height > 0 && (
				<canvas ref={canvasRef} width={dimensions.width} height={dimensions.height}>

				</canvas>
			)}
		</div>
	)
}