import useStatus from './useStatus';
import { useState, useEffect } from 'react';
import { getTxpow } from './rpc-commands';
import { ContactsOutlined } from '@mui/icons-material';
import { callStatus } from './rpc-commands';

export interface RecentBlock {
    block: number;
    hash: string;
    transactions: number;
    relayed: Date;
    parent: string;
}

const HISTORICAL_BLOCK_COUNT = 10;

const useRecentBlocks = () => {
    const [recentBlocks, setRecentBlocks] = useState<RecentBlock[]>([]);
    const status = useStatus();

    // Do this only once
    // use status command to get the first txpowid
    // follow the parents up the chain
    // populate the recentBlocks array with these historical blocks
    useEffect(() => {
        const historicalTxPows: any[] = [];

        // take a txpowid,
        // get the txpow,
        // and resolve the promise to its parent txpowid
        const getParentId = (txpowId: string) => {
            console.log('getting parent id:', txpowId);
            return getTxpow(txpowId).then((txpow: any) => {
                historicalTxPows.push(txpow);
                return txpow.header.superparents[0].parent;
            });
        };

        // get the txpowid for the latest block
        const getCurrentTxpowid = () => {
            return callStatus().then((status) => {
                return status.chain.hash;
            });
        };

        // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises
        const applyAsync = (acc: any, val: any) => acc.then(val);
        const composeAsync =
            (...funcs: any[]) =>
            (x: any) =>
                funcs.reduce(applyAsync, Promise.resolve(x));

        // create all the promises we are going to chain to get the historical txpowids
        const historicalTxpowIdPromises = new Array(HISTORICAL_BLOCK_COUNT).fill(getParentId);
        const transformData = composeAsync(...historicalTxpowIdPromises);

        // get the first txpowid and fire off the chain of promises
        getCurrentTxpowid().then((firstParent) => {
            console.log('firstParent:', firstParent);
            const allComplete = transformData(firstParent);
            allComplete.then((res: any) => {
                console.log('historicalTxPows', historicalTxPows);
                const historicalRecentBlocks: RecentBlock[] = historicalTxPows.map((txpow: any) => {
                    return {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                        parent: txpow.header.superparents[0].parent,
                    };
                });
                setRecentBlocks((oldArray) => historicalRecentBlocks.concat(oldArray));
            });
        });
    }, []);

    // update recent blocks every time status shows a new block
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
                        parent: txpow.header.superparents[0].parent,
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
