import useStatus from './useStatus';
import { useState, useEffect } from 'react';
import { getTxpow, getTxpowByBlockNumber, getTxpowByAddress } from './rpc-commands';
import { ContactsOutlined } from '@mui/icons-material';
import { callStatus } from './rpc-commands';

export interface RecentBlock {
    block: number;
    hash: string;
    transactions: number;
    relayed: Date;
    parent: string;
    txpowid: string;
}

const HISTORICAL_BLOCK_COUNT = 10;

const useRecentBlocks = () => {
    const [recentBlocks, setRecentBlocks] = useState<RecentBlock[]>([]);
    const [blockTablePage, setBlockTablePage] = useState<RecentBlock[]>([]);
    // const [blockTablePageFrom, setBlockTablePageFrom] = useState<number>(0); // highest block number on blockTablePage
    const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);
    const [visiblePage, setVisiblePage] = useState<number>(0);
    const [searchString, setSearchString] = useState<string>('');
    const status = useStatus();

    // table will be in 2 modes.
    // 1) An updating mode when new blocks will be visible straight away
    // 2) A search mode when search resuts are visible but the table doesnt update

    useEffect(() => {
        const blockNum: number = status.chain.block;
        setLatestBlockNumber(blockNum);
    }, [status]);

    useEffect(() => {
        const isAddress = (address: string) => {
            return address.startsWith('0x') && address.length === 66;
        };

        const removeDuplicates = (txpows: any[]) => {
            let unique: any = {};
            txpows.forEach((txpow) => {
                const txpowid: string = txpow.txpowid;
                unique[txpowid] = txpow;
            });
            const uniqueArray = Object.values(unique);
            return uniqueArray;
        };

        if (searchString === '') {
            let pageTxpowPromises: Promise<any>[] = [];
            console.log('new block get the latest 10 blocks from ' + latestBlockNumber);

            const topBlock = latestBlockNumber - visiblePage * HISTORICAL_BLOCK_COUNT;

            for (let i = topBlock; i > topBlock - HISTORICAL_BLOCK_COUNT; i--) {
                pageTxpowPromises.push(getTxpowByBlockNumber(i));
            }

            Promise.all(pageTxpowPromises).then((txpows) => {
                console.log('got txpows for blocks ' + topBlock + ' to ' + (topBlock - HISTORICAL_BLOCK_COUNT), txpows);
                const tableTxpows = txpows.map((txpow) => {
                    return {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                        parent: txpow.header.superparents[0].parent,
                        txpowid: txpow.txpowid,
                    };
                });
                setBlockTablePage(tableTxpows);
            }, console.error);
        } else {
            console.log('searching for ' + searchString);
            let isnum = /^\d+$/.test(searchString);
            if (isnum) {
                console.log('search for txpow by block number ' + searchString);
                getTxpowByBlockNumber(parseInt(searchString)).then((txpows) => {
                    console.log('got txpow for ' + searchString, txpows);
                }, console.error);
            } else {
                console.log('NaN, checking for address');
                if (isAddress(searchString)) {
                    getTxpowByAddress(searchString).then((txpows: any) => {
                        const uniqueTxpows = removeDuplicates(txpows);
                        console.log('got unique txpows for ' + searchString, uniqueTxpows);
                        const searchBlocks: RecentBlock[] = uniqueTxpows.map((txpow: any) => {
                            return {
                                block: parseInt(txpow.header.block),
                                hash: txpow.txpowid,
                                transactions: txpow.body.txnlist.length,
                                relayed: new Date(txpow.header.date),
                                parent: txpow.header.superparents[0].parent,
                                txpowid: txpow.txpowid,
                            };
                        });
                        setBlockTablePage(searchBlocks);
                    }, console.error);
                } else {
                    console.log('not an address');
                }
            }
        }
    }, [visiblePage, latestBlockNumber, searchString]);

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
            const allComplete = transformData(firstParent);
            allComplete.then((res: any) => {
                const historicalRecentBlocks: RecentBlock[] = historicalTxPows.map((txpow: any) => {
                    return {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                        parent: txpow.header.superparents[0].parent,
                        txpowid: txpow.txpowid,
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
            getTxpow(txpowId).then(
                (txpow: any) => {
                    // TODO: create txpow type
                    const newRecentBlock: RecentBlock = {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                        parent: txpow.header.superparents[0].parent,
                        txpowid: txpow.txpowid,
                    };
                    setRecentBlocks((oldArray) => [...oldArray, newRecentBlock]);
                },
                (err) => {
                    console.log(err);
                }
            );
        }
    }, [status]);

    return { recentBlocks, blockTablePage, setVisiblePage, setSearchString };
};

export default useRecentBlocks;
