import useStatus from './useStatus';
import { useState, useEffect } from 'react';
import { getTxpow } from './rpc-commands';

export interface RecentBlock {
    block: number;
    hash: string;
    transactions: number;
    relayed: Date;
}

const useRecentBlocks = () => {
    const [recentBlocks, setRecentBlocks] = useState<RecentBlock[]>([]);
    const status = useStatus();

    useEffect(() => {
        const blockNum: number = status.chain.block;

        const newBlock = recentBlocks.find((recentBlock) => recentBlock.block === blockNum);

        // if the block is already in the list, don't add it again
        if (typeof newBlock === 'undefined') {
            const txpowId = status.chain.hash;
            console.log('searching txpowid:', txpowId);
            getTxpow(txpowId).then(
                (txpow: any) => {
                    // TODO: create txpow type
                    const newRecentBlock: RecentBlock = {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                    };
                    console.log('update recent blocks', recentBlocks);
                    setRecentBlocks((oldArray) => [...oldArray, newRecentBlock]);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }, [status]);

    return recentBlocks;
};

export default useRecentBlocks;
