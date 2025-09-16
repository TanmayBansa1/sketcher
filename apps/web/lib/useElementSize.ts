"use client";
import { useEffect, useState } from "react";

export function useElementSize<T extends HTMLElement>(target: React.RefObject<T | null>) {
	const [size, setSize] = useState({ width: 0, height: 0 });

	useEffect(() => {
		const element = target.current;
		if (!element) return;

		const update = () => {
			const rect = element.getBoundingClientRect();
			setSize({ width: Math.round(rect.width), height: Math.round(rect.height) });
		};

		update();

		const observer = new ResizeObserver(() => update());
		observer.observe(element);

		return () => {
			observer.disconnect();
		};
	}, [target]);

	return size;
}


