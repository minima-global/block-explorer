import { useState, useRef, useEffect } from 'react';
import { Events, Txpow, commands, Status } from '@minima-global/mds-api';

const useNewBlock = () => {
    const [newBlock, setNewBlock] = useState<Txpow | null>(null);
    const websocket = useRef<Events | null>(null);

    useEffect(() => {
        // get the top block while we wait for the first NEWBLOCK event
        commands.status().then((status: Status) => {
            const topBlock = status.chain.block;
            commands.txpow_block(topBlock).then((txpow: Txpow) => {
                setNewBlock(txpow);
            });
        });

        // connect to the websocket and wait for NEWBLOCK events
        websocket.current = new Events();
        websocket.current.ws.onmessage = (message) => {
            const res = JSON.parse(message.data);
            const event = res.event;
            const data = res.data;
            if (event === 'NEWBLOCK') {
                setNewBlock(data.txpow);
            }
        };
        return () => {
            if (websocket.current) {
                websocket.current.ws.close();
            }
        };
    }, []);

    return newBlock;
};

export default useNewBlock;
