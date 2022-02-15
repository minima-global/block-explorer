import useStatus from './useStatus';
import { useState, useEffect } from 'react';
import { getTxpow, getTxpowByBlockNumber, getTxpowByAddress } from './rpc-commands';
import { callStatus } from './rpc-commands';
import { GridRowModel } from '@mui/x-data-grid';

interface RecentBlock {
    block: number;
    hash: string;
    transactions: number;
    relayed: Date;
    parent: string;
    txpowid: string;
}

interface RowsState {
    page: number;
    rows: GridRowModel[];
    rowCount: number;
    loading: boolean;
}
const PAGE_SIZE = 10;

// minima stores 1000 blocks
const MINIMA_TOTAL_ROWS = 1000;

const useRecentBlocks = () => {
    const status = useStatus();
    const [recentBlocks, setRecentBlocks] = useState<RecentBlock[]>([]);
    const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);
    const [searchString, setSearchString] = useState<string>('');
    const [searchResultBlocks, setSearchResultBlocks] = useState<RecentBlock[]>([]);

    // visible table rows and pagination state
    const [rowsState, setRowsState] = useState<RowsState>({
        page: 0,
        rows: [],
        rowCount: MINIMA_TOTAL_ROWS,
        loading: false,
    });

    // table will be in 2 modes.
    // 1) An updating mode when new blocks will be visible straight away
    // 2) A search mode when search resuts are visible but the table doesnt update

    useEffect(() => {
        const blockNum: number = status.chain.block;
        setLatestBlockNumber(blockNum);
    }, [status]);

    useEffect(() => {
        setRowsState((prev) => ({ ...prev, page: 0 }));
    }, [searchString]);

    useEffect(() => {
        if (searchString === '') {
            // do nothing, we will handle this in another useEffect
        } else {
            // display the correct slice of the searchResultsBlocks into the rowsState.rows
            // page 0 = [0,9]
            // page 1 = [10,19]
            // page 2 = [20,29]
            const startIndex = rowsState.page * PAGE_SIZE;
            const endIndex = (rowsState.page + 1) * PAGE_SIZE;
            const displayRows = searchResultBlocks.slice(startIndex, endIndex);
            setRowsState((prev) => ({ ...prev, rows: displayRows, rowCount: searchResultBlocks.length }));
        }
    }, [searchResultBlocks, rowsState.page, searchString]);

    useEffect(() => {
        const isAddress = (address: string) => {
            return address.startsWith('0x') && address.length === 66;
        };

        // takes an array of txpow objects
        // returns an array of txpow objects with none having the same txpowid
        const removeDuplicates = (txpows: any[]) => {
            let unique: any = {};
            txpows.forEach((txpow) => {
                const txpowid: string = txpow.txpowid;
                unique[txpowid] = txpow;
            });
            const uniqueArray = Object.values(unique);
            return uniqueArray;
        };

        // takes an array of block numbers
        // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
        const getRecentBlocks: (b: number[]) => Promise<RecentBlock[]> = async (blockNumbers: number[]) => {
            const txpowPromises = blockNumbers.map((blockNumber) => getTxpowByBlockNumber(blockNumber));
            return Promise.all(txpowPromises).then((txpows) => {
                console.log('got txpows for blocks ', txpows);
                const recentBlocks: RecentBlock[] = txpows.map((txpow: any) => {
                    return {
                        block: parseInt(txpow.header.block),
                        hash: txpow.txpowid,
                        transactions: txpow.body.txnlist.length,
                        relayed: new Date(txpow.header.date),
                        parent: txpow.header.superparents[0].parent,
                        txpowid: txpow.txpowid,
                    };
                });
                return recentBlocks;
            });
        };

        // takes a minima address
        // gets all the blocks and transactions associated with that address
        // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
        const getRecentBlocksByAddress: (address: string) => Promise<RecentBlock[]> = async (address: string) => {
            const txpows: any[] = await getTxpowByAddress(address);
            const uniqueTxpows = removeDuplicates(txpows); // some are blocks some are transactions
            // get all the unique block numbers
            let blockNumbers: Set<number> = new Set();
            uniqueTxpows.forEach((txpow: any) => {
                blockNumbers.add(parseInt(txpow.header.block));
            });
            const blockNumbersArray: number[] = Array.from(blockNumbers);
            console.log('blockNumbersArray for address', blockNumbersArray);
            return getRecentBlocks(blockNumbersArray);
        };

        if (searchString === '') {
            let pageBlockNumbers: number[] = [];
            console.log('new block get the latest 10 blocks from ' + latestBlockNumber);

            const topBlock = latestBlockNumber - rowsState.page * PAGE_SIZE;

            for (let i = topBlock; i > topBlock - PAGE_SIZE; i--) {
                pageBlockNumbers.push(i);
            }

            setRowsState((prev) => ({ ...prev, loading: true }));
            getRecentBlocks(pageBlockNumbers).then(
                (recentBlocks) => {
                    console.log(
                        'got recentBlocks for blocks ' + topBlock + ' to ' + (topBlock - PAGE_SIZE),
                        recentBlocks
                    );
                    setRowsState((prev) => ({
                        ...prev,
                        loading: false,
                        rows: recentBlocks,
                        rowCount: MINIMA_TOTAL_ROWS, // use artificial number of blocks
                    }));
                },
                (err: any) => {
                    setRowsState((prev) => ({ ...prev, loading: false }));
                    console.error(err);
                }
            );
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
                    setRowsState((prev) => ({ ...prev, loading: true }));
                    getRecentBlocksByAddress(searchString).then(
                        (recentBlocks: any) => {
                            console.log('got recent blocks for ' + searchString, recentBlocks);
                            setSearchResultBlocks(recentBlocks);
                            setRowsState((prev) => ({ ...prev, loading: false }));
                            // setRowsState((prev) => ({
                            //     ...prev,
                            //     loading: false,
                            //     rows: recentBlocks,
                            //     rowCount: recentBlocks.length, // use actual number of blocks
                            // }));
                        },
                        (err: any) => {
                            setRowsState((prev) => ({ ...prev, loading: false }));
                            console.error(err);
                        }
                    );
                } else {
                    console.log('not an address');
                }
            }
        }
    }, [rowsState.page, latestBlockNumber, searchString]);

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
        const historicalTxpowIdPromises = new Array(PAGE_SIZE).fill(getParentId);
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

    return { recentBlocks, setSearchString, rowsState, setRowsState, pageSize: PAGE_SIZE };
};

export default useRecentBlocks;
