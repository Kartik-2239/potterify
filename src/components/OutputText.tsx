import './appearing.module.css';
import { useEffect, useState } from 'react';

const OutputText = ({ text }: { text: string }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        setTimeout(() => {
            setVisible(true);
        }, 1000);
    }, []);
    return (
        <div className={`flex justify-center items-center ${visible ? 'to-appearing' : 'opacity-0'}`}>
            <h1 className='text-5xl lg:text-7xl md:text-6xl sm:text-5xl to-appearing text-center select-none'>{text}</h1>
        </div>
    )
}


export default OutputText;