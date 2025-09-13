export type Shape = {
    name: "rectangle",
    x: number,
    y: number,
    width: number,
    height: number
} | {
    name: "circle",
    x: number,
    y: number,
    radius: number
} | {
    name: "line",
    x1: number,
    y1: number,
    x2: number,
    y2: number
}

export interface Room{
    id: string,
    name: string,
    slug: string,
    description: string | null
}