import { useState, useEffect } from 'react';
import { Txpow } from '@minima-global/mds-api';

import { MDS } from './mds';

import { txpow_block, callStatus } from './mds-api';

const useNewBlock = () => {
    const [newBlock, setNewBlock] = useState<Txpow | null>(null);

    useEffect(() => {
        // get the top block while we wait for the first NEWBLOCK event
        
        MDS.init((msg: any) => {
            
            
            const evt = msg.event;
            const data = msg.data;
            
            if(evt === 'inited') {
                callStatus().then((res: any) => {
                    const topBlock = res.response.chain.block;
                    txpow_block(topBlock).then((resp: any) => {
                        setNewBlock(resp.response);
                    });
                });
            }
            
            
            if (evt === 'NEWBLOCK') {
                console.log(`NEWBLOCK EVENT, ADD BLOCK`, data.txpow);
                setNewBlock(data.txpow);                
            }
        })

        // connect to the websocket and wait for NEWBLOCK events
        // if (ws) {
        //     ws.onmessage = (message: any) => {
        //         const res = JSON.parse(message.data);
        //         const event = res.event;
        //         const data = res.data;
        //         console.log(`NEW EVENT MESSAGE! ${event}`);
        //         if (event === 'NEWBLOCK') {
        //             console.log(`NEWBLOCK EVENT, ADD BLOCK`, data.txpow);
        //             setNewBlock(data.txpow);
        //         }
        //     };
        // } else {
        //     console.error('No websocket connection');
        // }

        return () => {
            console.log('destroying useNewBlock hook');
        };
    }, [MDS]);

    return newBlock;
};

export default useNewBlock;
