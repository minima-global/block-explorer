import useStatus from './useStatus';
import { useState, useEffect, useCallback } from 'react';
import { getTxpowByBlockNumber, getTxpowByAddress } from './rpc-commands';
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

    const isAddress = useCallback((address: string) => {
        return address.startsWith('0x') && address.length === 66;
    }, []);

    // takes an array of txpow objects
    // returns an array of txpow objects with none having the same txpowid
    const removeDuplicates = useCallback((txpows: any[]) => {
        let unique: any = {};
        txpows.forEach((txpow) => {
            const txpowid: string = txpow.txpowid;
            unique[txpowid] = txpow;
        });
        const uniqueArray = Object.values(unique);
        return uniqueArray;
    }, []);

    // takes an array of block numbers
    // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
    const getRecentBlocks: (b: number[]) => Promise<RecentBlock[]> = useCallback(async (blockNumbers: number[]) => {
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
    }, []);

    // takes a minima address
    // gets all the blocks and transactions associated with that address
    // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
    const getRecentBlocksByAddress: (address: string) => Promise<RecentBlock[]> = useCallback(
        async (address: string) => {
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
        },
        [getRecentBlocks, removeDuplicates]
    );

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
            const startIndex = rowsState.page * PAGE_SIZE;
            const endIndex = (rowsState.page + 1) * PAGE_SIZE;
            const displayRows = searchResultBlocks.slice(startIndex, endIndex);
            setRowsState((prev) => ({ ...prev, rows: displayRows, rowCount: searchResultBlocks.length }));
        }
    }, [searchResultBlocks, rowsState.page, searchString]);

    /////////////////// Network requests all happen in this effect ///////////////////
    useEffect(() => {
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
                setRowsState((prev) => ({ ...prev, loading: true }));
                getRecentBlocks([parseInt(searchString)]).then(
                    (recentBlocks: any) => {
                        setSearchResultBlocks(recentBlocks);
                        setRowsState((prev) => ({ ...prev, loading: false }));
                    },
                    (err: any) => {
                        setRowsState((prev) => ({ ...prev, loading: false }));
                        console.error(err);
                    }
                );
            } else {
                console.log('NaN, checking for address');
                if (isAddress(searchString)) {
                    setRowsState((prev) => ({ ...prev, loading: true }));
                    getRecentBlocksByAddress(searchString).then(
                        (recentBlocks: any) => {
                            console.log('got recent blocks for ' + searchString, recentBlocks);
                            setSearchResultBlocks(recentBlocks);
                            setRowsState((prev) => ({ ...prev, loading: false }));
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
    }, [rowsState.page, latestBlockNumber, searchString, getRecentBlocks, getRecentBlocksByAddress, isAddress]);

    return { setSearchString, rowsState, setRowsState, pageSize: PAGE_SIZE };
};

export default useRecentBlocks;
