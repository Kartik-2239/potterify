import { useEffect, useRef, useState } from 'react'
import bg from './assets/old_paper.jpg'
import InputCanvas from './components/InputCanvas'
import OutputText from './components/OutputText'
import './components/appearing.module.css'
import logo from './assets/logo-Photoroom.png'


type responseType = {
  response: string
  imageDescription: string
}

function App() {
  const [inputMode, setInputMode] = useState(true)
  const [response, setResponse] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [imageData, setImageData] = useState<string | null>(null)

  const [chats, setChats] = useState<responseType[]>([])

  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<any>(null);

  const getResponse = async (base64Image: string) => {
    // const response = await fetch('https://potterify-production.up.railway.app/api/judgeimage', {
    const response = await fetch('http://127.0.0.1:8000/api/judgeimage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ base64_image: base64Image, chats: chats }),
    })
    const data = await response.json();
    console.log("data", data)
    setChats(prev => [...prev, {response: data.text, imageDescription: data.imageDescription}])
    const curChat = chats
    curChat.push({response: data.text, imageDescription: data.imageDescription})
    setChats(curChat)
    setResponse(data.text)
    console.log("curChat", chats)
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
        {/* <div className='w-20 sm:w-20 md:w-50 lg:w-50 potter-font absolute z-999 top-12 rounded-lg text-shadow-lg text-6xl left-7 text-fuchsia-600 rotate-340 text-center gap-0'>
            <div className='rotate-357 w-2/3'>Potterify</div>
            <img src={logo} className='w-2/3 z-999 absolute top-0 rotate-50 left-10' alt="logo" />
        </div> */}
        <div className='w-30 sm:w-30 md:w-50 lg:w-50 potter-font absolute z-999 top-0 rounded-lg text-shadow-lg text-6xl left-2 text-fuchsia-600 text-center gap-0'>
          <img src={logo} alt="Potterify Logo" className='pointer-events-none select-none'/>
        </div>
        
        

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
                <div className='relative flex flex-col justify-center items-center gap-10'>
                  <img src={imageData ?? undefined} alt="image" className='to-appearing top-4 border-0 rounded-md lg:w-1/4 md:w-1/4 sm:w-1/3 w-1/2  object-cover'/>
                  <div className='flex flex-col'>
                    <OutputText text={response ?? "OH NO ERROR *tom freaks out*"}/>
                    <div className='relative w-full flex justify-center items-center mt-10 to-appearing'>
                      <button className='bg-amber-200 border-2 border-black text-3xl text-black px-3 py-1 rounded shadow select-none' onClick={() => setInputMode(true)}>Ask Again</button>
                    </div>
                  </div>
                  
                </div>
              )
            }
          </div>
        </div>
        <img className='z-0 w-full h-full object-cover absolute top-0 left-0' src={bg} alt="background" />
        
      </div>
    </>
  )
}

export default App
