import './appearing.module.css';
import OutputText from './OutputText';
import { useEffect, useRef } from 'react';

// const OutputTextCanvasWrite = ({ text }: { text: string }) => {
//     useEffect(() => {
//         var vara = new Vara(
//           "#vara-container",
//           "https://raw.githubusercontent.com/akzhy/Vara/master/fonts/Satisfy/SatisfySL.json",
//           [
//             {
//               text: text,
//               fontSize: 40,
//               strokeWidth: 0.7,
//               duration:5000,
//               textAlign:"left"
//             },
//           ]
//         );
//       }, []);
//     return (
//         <div className="to-appearing flex justify-center items-center">
//             {/* <h1 className='text-5xl lg:text-7xl md:text-6xl sm:text-5xl to-appearing text-center'>{text}</h1> */}
//             <div id="vara-container" className='text-5xl lg:text-7xl md:text-6xl sm:text-5xl to-appearing text-center'></div>
//         </div>
//     )
// }

const OutputTextCanvas = ({ text, duration }: { text: string, duration: number }) => {
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const textRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
        setTimeout(() => {
            const canvas = canvasRef.current;
            if (canvas) {
                (canvas as HTMLCanvasElement).style.opacity = "0";
            }
        }, duration*9/10);
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const width = (canvas.width = window.innerWidth);
        const height = (canvas.height = window.innerHeight);
        const centerX = width / 2;
        const centerY = height / 2;
    
        const numDots = 100;
        const textWidth = textRef?.current?.clientWidth || 200; // fallback if ref isn't ready
    
        // assign each dot a side (left/right)
        const dots = Array.from({ length: numDots }, () => ({
          startX: Math.random() * width,
          startY: Math.random() * height,
          side: Math.random() < 0.5 ? "left" : "right",
          offsetX: (Math.random() - 0.5) * textWidth * 0.4,
          offsetY: (Math.random() - 0.5) * textWidth * 0.2,
        }));
    
        const startTime = performance.now();
    
        function animate(time:any) {
          const elapsed = time - startTime;
          const t = Math.min(elapsed / duration, 1);
          if (!ctx) return;
          ctx.clearRect(0, 0, width, height);
          ctx.fillStyle = "black";
    
          for (const { startX, startY, side, offsetX, offsetY } of dots) {
            const targetX =
              side === "right"
                ? centerX + textWidth / 4
                : centerX - textWidth / 4;
            const targetY = centerY;
    
            const x = startX + (targetX - startX) * t + offsetX;
            const y = startY + (targetY - startY) * t + offsetY;
    
            ctx.beginPath();
            ctx.arc(x, y, 3, 0, Math.PI * 2);
            ctx.fill();
          }
    
          if (t < 1) requestAnimationFrame(animate);
        }
        

        requestAnimationFrame(animate);
      }, [duration, textRef]);

    return (
        <div className="relative to-appearing flex justify-center items-center">
            <div ref={textRef} className='z-10 absolute'>
                <OutputText text={text}/>
            </div>
            <canvas ref={canvasRef}>
            </canvas>
        </div>
    )
}


export { OutputTextCanvas };