import './appearing.module.css';


const OutputText = ({ text }: { text: string }) => {
    return (
        <div className="to-appearing flex justify-center items-center">
            <h1 className='text-5xl lg:text-7xl md:text-6xl sm:text-5xl to-appearing text-center'>{text}</h1>
        </div>
    )
}

export default OutputText;