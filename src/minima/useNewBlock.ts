import { useState, useEffect } from 'react';
import { commands, events } from '../mds';

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

        // register custom callback for new block events
        events.onNewBlock((newBlockData) => {
            const txpow = newBlockData.txpow
            console.log(`NEWBLOCK EVENT, ADD BLOCK`, txpow);
            setNewBlock(txpow);
        })

    }, [commands, events]);

    return newBlock;
};

export default useNewBlock;
