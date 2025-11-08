import { useEffect, useRef, useState } from 'react'
import bg from './assets/old_paper.jpg'
import InputCanvas from './components/InputCanvas'
import OutputText from './components/OutputText'
import './components/appearing.module.css'

function App() {
  const [inputMode, setInputMode] = useState(true)
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageData, setImageData] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<any>(null);

  const getResponse = async (base64Image: string) => {
    const response = await fetch('https://potterify-production.up.railway.app/api/judgeimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64_image: base64Image }),
    })
    const data = await response.json();
    console.log(data.text)
    setResponse(data.text)
  }
  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Enter') return;
    if (!inputMode) return; // only when in input mode
    const inst = canvasRef.current;
    if (!inst || !inst.canvas || !inst.canvas.drawing) return;
    const dataUrl = inst.canvas.drawing.toDataURL("image/png");
    setImageData(dataUrl)
    setLoading(true)
    console.log("logging base64")
    getResponse(dataUrl).then(() => {
      setLoading(false)
      handleEnter()
    });
  }
  useEffect(() => {
    
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [inputMode])

  const handleEnter = () => {
    console.log("loading", loading)
    setInputMode(prev => !prev)
  }
  return (
    <>
      <div className="w-screen h-screen relative">
        <div className='relative z-10 flex justify-center items-center h-full py-20 px-4 sm:px-8 md:px-30'>
          <div className='h-full w-full border-0 border-amber-100 flex justify-center items-center'>
            {
              inputMode ? (
                <>
                  {/* <input type="text" className='text-4xl border-2 border-amber-500 p-4' />
                  <button onClick={handleEnter}>Enter</button> */}
                  <InputCanvas onKeyDown={onKeyDown} loading={loading} containerRef={containerRef} canvasRef={canvasRef} />

                </>
              ) : (
                <>
                  <img src={imageData ?? undefined} alt="image" className='to-appearing absolute top-10 border-0 rounded-md w-1/4 h-1/4 object-cover'/>
                  <OutputText text={response ?? "OH NO ERROR *tom freaks out*"}/>
                </>
              )
            }
          </div>
        </div>
        <img className='z-0 w-full h-full object-cover absolute top-0 left-0' src={bg} alt="background" />
        <div className='potter-font absolute top-10 text-shadow-lg text-6xl left-7 text-fuchsia-600 rotate-340 text-center'>Potterify</div>
      </div>
    </>
  )
}

export default App
