import { useState, useRef, useEffect } from 'react';
import { ws, Txpow, commands, Status } from '@minima-global/mds-api';

const useNewBlock = () => {
    const [newBlock, setNewBlock] = useState<Txpow | null>(null);
    const websocket = useRef<WebSocket | null>(null);

    useEffect(() => {
        // get the top block while we wait for the first NEWBLOCK event
        commands.status().then((status: Status) => {
            const topBlock = status.chain.block;
            commands.txpow_block(topBlock).then((txpow: Txpow) => {
                setNewBlock(txpow);
            });
        });

        // connect to the websocket and wait for NEWBLOCK events
        if (ws) {
            websocket.current = ws;
            websocket.current.onmessage = (message: any) => {
                const res = JSON.parse(message.data);
                const event = res.event;
                const data = res.data;
                console.log(`NEW EVENT MESSAGE! ${event}`);
                if (event === 'NEWBLOCK') {
                    console.log(`NEWBLOCK EVENT, ADD BLOCK`, data.txpow);
                    setNewBlock(data.txpow);
                }
            };
        } else {
            console.error('No websocket connection');
        }

        return () => {
            if (websocket.current) {
                websocket.current.close();
            }
        };
    }, []);

    return newBlock;
};

export default useNewBlock;
