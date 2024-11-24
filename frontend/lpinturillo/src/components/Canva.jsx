import { useEffect, useState } from "react"


const Canva = () => {
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
  
  function bresenhamsLineAlgorith(canvasCordenetes, ctx, start, finish) {
    const dx = Math.abs(finish.x - start.x);
    const dy = Math.abs(finish.y - start.y);
    if(dx > dy ){
      plotPixel(ctx, start.x, start.y, finish.x, finish.y ,dx,dy,0)
    } else {
      plotPixel(ctx , start.x, start.y, finish.x, finish.y ,dx,dy,1)
    }
  }

  const [mouse, setMouse] = useState({
    x:undefined,
    y: undefined,
    pressed: false,
    inCanvas:false
  })
  const [canvas, setCanvas] = useState({
    x:undefined,
    y:undefined,
    lastPressedPosition:undefined,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [ctx, setCtx] = useState(undefined);

  useEffect(()=>{
    const canvas = document.getElementById("canva")
    const cord = canvas.getBoundingClientRect()
    const initialCtx = canvas.getContext("2d");
    initialCtx.fillStyle ="rgba(133, 133, 133, 255)"
    setCtx(initialCtx)
    setIsLoading(false)
    setCanvas(prev => {
      return {
        ...prev,
        x: cord.left,
        y: cord.top
      }
    })
  },[])

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
          
          setCanvas((prev)=>{
            return {
              ...prev,
              lastPressedPosition:{
                x: e.pageX - canvas.x,
                y: e.pageY - canvas.y,
              }
            }
          })

          ctx.fillRect(e.pageX - canvas.x, e.pageY - canvas.y, 10 , 10)
          //ctx.beginPath();
          //ctx.moveTo(e.pageX -canvas.x, e.pageY -canvas.y)
          //setCtx(ctx)
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
          
          //ctx.lineTo(e.pageX -canvas.x , e.pageY -canvas.y);
          //ctx.stroke();
        }}
        onMouseMove={ (e) => {
            setMouse(prev => {
              return {
                ...prev,
                x: e.pageX,
                y:e.pageY,
              }
            })
            if(mouse.pressed){
              bresenhamsLineAlgorith(
                {x: canvas.x, y: canvas.y},
                 ctx,
                  canvas.lastPressedPosition,
                  {
                    x: e.pageX - canvas.x,
                    y: e.pageY - canvas.y
                  }
                )
              setCanvas(prev => {
                return {
                  ...prev,
                  lastPressedPosition:{
                    x: e.pageX - canvas.x,
                    y: e.pageY - canvas.y,
                }
              }
            })
              //ctx.fillRect(e.pageX - canvas.x, e.pageY - canvas.y, 10 , 10)
            }
          }
        }
      >
      </canvas>
    </div>
  )
}

export default Canva