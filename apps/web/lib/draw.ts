export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if(!ctx) return;
    ctx.strokeStyle = "red";
    
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
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.strokeRect(startX, startY, width, height);
        }
    })
    canvas.addEventListener("mouseup", (e)=>{
        isDrawing = false;
    })
}