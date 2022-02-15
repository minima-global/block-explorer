import { useState, useEffect } from 'react';
import Minima from './minimanew.js';


const useMinimaInit = () => {
    const [connected, setConnected] = useState(false);
    
    Minima.useMinidappSystem();
    
    useEffect(() => {
        Minima.init((msg: any) => {
            if (msg.event == 'connected') {
                setConnected(true);
            }
        });
    }, []);

    return connected;
};

export default useMinimaInit;
