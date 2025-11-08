import CanvasDraw from "react-canvas-draw";
import { useEffect, useState } from "react";
import './appearing.module.css'

const InputCanvas = ({ onKeyDown, loading, containerRef, canvasRef }: { onKeyDown: (e: KeyboardEvent) => void, loading: boolean, containerRef: React.RefObject<HTMLDivElement | null>, canvasRef: React.RefObject<any> }) => {
    
    const [size, setSize] = useState({ width: 0, height: 0 });
    const [brushSize, setBrushSize] = useState(3);

    useEffect(() => {
        const updateSize = () => {
            const el = containerRef.current;
            if (!el) return;
            setSize({ width: el.clientWidth, height: el.clientHeight });
        };

        updateSize();

        const resizeObserver = new ResizeObserver(() => updateSize());
        if (containerRef.current) resizeObserver.observe(containerRef.current);
        window.addEventListener("resize", updateSize);
        return () => {
            resizeObserver.disconnect();
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    const handleClick = () => {
        onKeyDown(new KeyboardEvent("keydown", { key: "Enter" }));
    }

    const handleDraw = (event: any) => {
        console.log("draw", event)
    }
    const handleEraser = () => {
        canvasRef.current.clear();
    }

    const defaultProps = {
        onChange: handleDraw,
        loadTimeOffset: 5,
        lazyRadius: 1,
        brushRadius: brushSize,
        brushColor: "#444",
        catenaryColor: "#0a0302",
        gridColor: "rgba(150,150,150,0.17)",
        hideGrid: true,
        // canvasWidth: 400,
        // canvasHeight: 400,
        disabled: false,
        imgSrc: "",
        saveData: undefined,
        immediateLoading: false,
        hideInterface: false,
        gridSizeX: 25,
        gridSizeY: 25,
        hideGridX: false,
        hideGridY: false,
        enablePanAndZoom: true,
        mouseZoomFactor: 0.01,
        zoomExtents: { min: 0.33, max: 3 },
        backgroundColor: "transparent",
    };

    const BrushSizes = [1, 2, 3, 4, 5];
    

    return (
        <div
            ref={containerRef}
            className={`w-full h-full relative transition-opacity duration-3000 ease-out ${loading ? 'opacity-0' : 'opacity-100'}`}
        >
            {size.width > 0 && size.height > 0 && (
                <CanvasDraw
                    ref={canvasRef}
                    {...defaultProps}
                    canvasWidth={size.width}
                    canvasHeight={size.height}
                    style={{ width: "100%", height: "100%" }}
                />
            )}
            <button
                type="button"
                onClick={handleClick}
                className="absolute bottom-3 right-3 bg-amber-200 text-black px-3 py-1 rounded shadow"
            >
                Ask
            </button>
            <div className="w-full h-10 flex justify-center items-center gap-10">
                <div className="w-auto px-4 h-10 relative border rounded-md flex justify-center items-center gap-10">
                    <div className="brush flex justify-center items-center gap-2">
                        {BrushSizes.map((size) => (
                            <div key={size}>
                                <div
                                    className="bg-black rounded-full"
                                    style={{ width: `${size*5}px`, height: `${size*5}px` }}
                                    onClick={() => setBrushSize(size)}
                                />
                            </div>
                        ))}
                    </div>
                    <div className="eraser flex justify-center items-center">
                        <div className="cursor-pointer px-2 font-mono text-lg" onClick={handleEraser}>
                            clear
                        </div>
                    </div>
                </div>
            </div>
        </div>
        
    )
}

export default InputCanvas;