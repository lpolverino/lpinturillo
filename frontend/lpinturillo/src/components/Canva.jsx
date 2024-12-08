import { useEffect, useRef, useState } from "react"
import { socket } from "../socket";

function draw(position, canvas ,ctx){
  
  bresenhamsLineAlgorith(
    ctx,
    canvas.lastPressedPosition,
    {
      x: position.x - canvas.x,
      y: position.y - canvas.y
    }
  )
}

function plotPixel(ctx, x1, y1, x2,y2, dx,dy, decide){
  let pk = 2 * dy - dx;
  for(let i = 0 ; i<= dx; i++){
    if(decide == 0){ 
      ctx.fillRect(x1, y1, 10,10)
    }else {
      ctx.fillRect(x1, y1, 10 ,10)
    }
    if(x1<x2) x1++
    else x1--
    if(pk< 0 ){
      if(decide == 0){
        pk = pk + 2 * dy;
      }else {
        pk = pk + 2 * dx;
      }
    }
    else {
      if(y1 < y2) y1++
      else y1--

      pk = pk + 2 * dy - 2 * dx;

    }
  }
}

function bresenhamsLineAlgorith(ctx, start, finish) {
  const dx = Math.abs(finish.x - start.x);
  const dy = Math.abs(finish.y - start.y);
  if(dx > dy ){
    plotPixel(ctx, start.x, start.y, finish.x, finish.y ,dx,dy,0)
  } else {
    plotPixel(ctx , start.x, start.y, finish.x, finish.y ,dx,dy,1)
  }
}

const Canva = () => {

  const [mouse, setMouse] = useState({
    x:undefined,
    y: undefined,
    pressed: false,
    inCanvas:false
  })

  const [isLoading, setIsLoading] = useState(true)
  const [ctx, setCtx] = useState(undefined);

  const canvasRef = useRef({
    x:undefined,
    y:undefined,
    lastPressedPosition:{
      x:0,
      y:0,
    }
  });

  useEffect(()=>{
    const canvas = document.getElementById("canva")
    const cord = canvas.getBoundingClientRect()
    const initialCtx = canvas.getContext("2d");
    initialCtx.fillStyle ="rgba(133, 133, 133, 255)"
    setCtx(initialCtx)
    setIsLoading(false)
    canvasRef.current = {
      ...canvasRef.current,
      x: cord.left,
      y: cord.top,
    }
  },[])

  useEffect(()=>{

    const handleMouseDrag = (position) => {
      const currentCanvas = canvasRef.current;
      canvasRef.current.lastPressedPosition = {
        x: position.x - currentCanvas.x,
        y:position.y - currentCanvas.y
      }
      draw(position,currentCanvas,ctx);
    }

    const handleMouseDown = (position) => {
      console.log(position);
      const currentCanvas = canvasRef.current;
      canvasRef.current.lastPressedPosition = {
        x: position.x - currentCanvas.x,
        y:position.y - currentCanvas.y
      }
      ctx.fillRect(position.x, position.y, 10 , 10)
    }

    if(isLoading) return
    socket.on("mouse-drag",handleMouseDrag)
    socket.on("mouse-down", handleMouseDown)
    
    return () => {
      socket.off("mouse-drag",handleMouseDrag)
      socket.off("mouse-down", handleMouseDown)
    }
  },[isLoading, ctx])

  return (
    <div>
      <div><p>{mouse.inCanvas ? "dentro":"fuera"}
        </p>
      </div>
      <canvas id="canva" width={400} height={400} 
        onMouseEnter={(e) => 
        {
          setMouse(prev => {
            return {
              ...prev,
              x:e.pageX,
              y:e.pageY,
              inCanvas: true,
            }
          })
        }}
        onMouseLeave={() => 
          {
            setMouse(prev => {
              return {
                ...prev,
                inCanvas: false,
                pressed:false
              }
            })
          }
        }
        onMouseDown={(e) => {
          setMouse(prev => {
              return {
                ...prev,
                x: e.pageX,
                y: e.pageY,
                pressed: true,
              }
          })
          
          
          socket.emit("mouse-down", {
            x: e.pageX - canvasRef.current.x ,
            y: e.pageY - canvasRef.current.y
          })

          canvasRef.current.lastPressedPosition = {
            x:e.pageX - canvasRef.current.x,
            y:e.pageY - canvasRef.current.y
          }
          ctx.fillRect(e.pageX - canvasRef.current.x, e.pageY - canvasRef.current.y, 10 , 10)
        }}
        onMouseUp={(e)=>{
           setMouse(prev => {
              return {
                ...prev,
                x: e.pageX,
                y: e.pageY,
                pressed: false,
              }
          })
          console.log(ctx);

        }}
        onMouseMove={ (e) => {
            setMouse(prev => {
              return {
                ...prev,
                x:e.pageX,
                y:e.pageY,
              }
            })
            if(mouse.pressed){
              canvasRef.current.lastPressedPosition = {
                x:e.pageX - canvasRef.current.x,
                y:e.pageY - canvasRef.current.y
              }
              socket.emit("mouse-drag",{x: e.pageX , y:e.pageY} )
              draw({x:e.pageX, y:e.pageY}, canvasRef.current, ctx)
            }
          }
        }
      >
      </canvas>
    </div>
  )
}

export default Canva