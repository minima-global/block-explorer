import { useState, useRef, useEffect } from 'react';
import { Txpow, commands, Status } from '@minima-global/mds-api';
import { events } from './events';

const useNewBlock = () => {
    const [newBlock, setNewBlock] = useState<Txpow | null>(null);

    useEffect(() => {
        // get the top block while we wait for the first NEWBLOCK event
        commands.status().then((status: Status) => {
            const topBlock = status.chain.block;
            commands.txpow_block(topBlock).then((txpow: Txpow) => {
                setNewBlock(txpow);
            });
        });

        events.onNewBlock((data) => {
            console.log(`NEWBLOCK EVENT, ADD BLOCK`, data.data.txpow);
            setNewBlock(data.data.txpow);
        })

    }, [commands, events]);

    return newBlock;
};

export default useNewBlock;
