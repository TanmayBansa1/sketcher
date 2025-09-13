"use client";
import { useEffect, useRef } from "react";
import { initDraw } from "@/lib/draw";
import { useElementSize } from "@/lib/useElementSize";

export default function CustomCanvas( { roomSlug,socket }: {roomSlug: string, socket: WebSocket | null}) {

	const canvasRef = useRef<HTMLCanvasElement>(null);
	const containerRef = useRef<HTMLDivElement | null>(null);
	const dimensions = useElementSize(containerRef);

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			initDraw(canvas, roomSlug, socket);
		}
	}, [dimensions, canvasRef, roomSlug, socket]);

	return (
		<div ref={containerRef} className="bg-amber-100" style={{ width: "100%", height: "100%" }}>
			{dimensions.width > 0 && dimensions.height > 0 && (
				<canvas ref={canvasRef} width={dimensions.width} height={dimensions.height}>

				</canvas>
			)}
		</div>
	)
}