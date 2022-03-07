import { useState, useEffect, useCallback } from 'react';
import { commands } from '@minima-global/mds-api';
import { GridRowModel } from '@mui/x-data-grid';
import useNewBlock from './useNewBlock';

interface RecentBlock {
    block: number;
    hash: string;
    transactions: number;
    relayed: Date;
    parent: string;
    txpowid: string;
}

export interface RowsState {
    page: number;
    rows: GridRowModel[];
    rowCount: number;
    loading: boolean;
}
const PAGE_SIZE = 10;

// minima stores 1000 blocks
const MINIMA_TOTAL_ROWS = 1000;

const useRecentBlocks = () => {
    const newBlock = useNewBlock();
    const [searchString, setSearchString] = useState<string>('');
    const [searchResultBlocks, setSearchResultBlocks] = useState<RecentBlock[]>([]);
    // visible table rows and pagination state
    const [rowsState, setRowsState] = useState<RowsState>({
        page: 0,
        rows: [],
        rowCount: 0,
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

    // takes a txpowid
    // returns a (promise of) single RecentBlock object
    const getRecentBlockByTxpowId: (txpowid: string) => Promise<RecentBlock> = useCallback((txpowid: string) => {
        return commands.txpow_txpowid(txpowid).then((txpow: any) => {
            return {
                block: parseInt(txpow.header.block),
                hash: txpow.txpowid,
                transactions: txpow.body.txnlist.length,
                relayed: new Date(txpow.header.date),
                parent: txpow.header.superparents[0].parent,
                txpowid: txpow.txpowid,
            };
        });
    }, []);

    // takes an array of block numbers
    // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
    const getRecentBlocksByBlockNumber: (b: number[]) => Promise<RecentBlock[]> = useCallback(
        async (blockNumbers: number[]) => {
            const txpowPromises = blockNumbers.map((blockNumber) => commands.txpow_block(blockNumber));
            return Promise.all(txpowPromises).then((txpows) => {
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
        },
        []
    );

    // takes a minima address
    // gets all the blocks and transactions associated with that address
    // returns (promise of) an array of RecentBlock objects (each is a block, so no transactions)
    const getRecentBlocksByAddress: (address: string) => Promise<RecentBlock[]> = useCallback(
        async (address: string) => {
            const txpows: any[] = await commands.txpow_address(address);
            const uniqueTxpows = removeDuplicates(txpows); // some are blocks some are transactions
            // get all the unique block numbers
            let blockNumbers: Set<number> = new Set();
            uniqueTxpows.forEach((txpow: any) => {
                blockNumbers.add(parseInt(txpow.header.block));
            });
            const blockNumbersArray: number[] = Array.from(blockNumbers);
            return getRecentBlocksByBlockNumber(blockNumbersArray);
        },
        [getRecentBlocksByBlockNumber, removeDuplicates]
    );

    // search for a number against minima block number
    // update search results state if successful
    const searchForBlockNumber = useCallback(
        (searchString: string) => {
            setRowsState((prev) => ({ ...prev, loading: true }));
            getRecentBlocksByBlockNumber([parseInt(searchString)]).then(
                (recentBlocks: any) => {
                    setSearchResultBlocks(recentBlocks);
                    setRowsState((prev) => ({ ...prev, loading: false }));
                },
                (err: any) => {
                    setSearchResultBlocks([]);
                    setRowsState((prev) => ({ ...prev, loading: false }));
                    console.error(err);
                }
            );
        },
        [setSearchResultBlocks, setRowsState, getRecentBlocksByBlockNumber]
    );

    // search for a string against minima txpowid
    // and if it fails try against minima address
    // update search results state if successful
    const searchForTxpowIdOrAddress = useCallback(
        (searchString: string) => {
            getRecentBlockByTxpowId(searchString).then(
                (recentBlock: RecentBlock) => {
                    setSearchResultBlocks([recentBlock]);
                    setRowsState((prev) => ({ ...prev, loading: false }));
                },
                (err) => {
                    console.log('txpow search failed. trying address search', err);
                    if (isAddress(searchString)) {
                        setRowsState((prev) => ({ ...prev, loading: true }));
                        getRecentBlocksByAddress(searchString).then(
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
                        console.error('not an address');
                    }
                }
            );
        },
        [getRecentBlockByTxpowId, getRecentBlocksByAddress, isAddress]
    );

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
            // do nothing on initial state
            if (newBlock == null) {
                return;
            }

            const latestBlockNumber = parseInt(newBlock.header.block);

            let pageBlockNumbers: number[] = [];
            const topBlock = latestBlockNumber - rowsState.page * PAGE_SIZE;
            for (let i = topBlock; i > topBlock - PAGE_SIZE; i--) {
                pageBlockNumbers.push(i);
            }

            setRowsState((prev) => ({ ...prev, loading: true }));
            getRecentBlocksByBlockNumber(pageBlockNumbers).then(
                (recentBlocks) => {
                    setRowsState((prev) => ({
                        ...prev,
                        loading: false,
                        rows: recentBlocks,
                        rowCount: MINIMA_TOTAL_ROWS, // use artificial number of blocks
                    }));
                },
                (err: any) => {
                    setRowsState((prev) => ({ ...prev, loading: false, rowCount: 0 }));
                    console.error(err);
                }
            );
        } else {
            // This is when the table is in search results mode
            let isnum = /^\d+$/.test(searchString);
            if (isnum) {
                searchForBlockNumber(searchString);
            } else {
                // put all searches thorough txpowid search first
                // if it fails try address search
                searchForTxpowIdOrAddress(searchString);
            }
        }
    }, [
        newBlock,
        rowsState.page,
        searchString,
        getRecentBlocksByBlockNumber,
        getRecentBlocksByAddress,
        isAddress,
        getRecentBlockByTxpowId,
        searchForBlockNumber,
        searchForTxpowIdOrAddress,
    ]);

    return { setSearchString, rowsState, setRowsState, pageSize: PAGE_SIZE };
};

export default useRecentBlocks;
