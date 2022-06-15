import { useState, useEffect, useCallback } from 'react';
import { commands, events } from '../mds';
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
const MINIMA_MAX_ROWS = 1000;


const buildRecentBlockFromTxpow = (txpow: any): RecentBlock => {
    // add one to transaction list if the block is a transaction
    let transactions = 0;
    if (txpow.istransaction) {
        console.log('found transaction in block ' + parseInt(txpow.header.block), txpow.body.txnlist.length + 1);
        transactions = txpow.body.txnlist.length + 1;
    } else {
        transactions = txpow.body.txnlist.length;
    }

    return {
        block: parseInt(txpow.header.block),
        hash: txpow.txpowid,
        transactions,
        relayed: new Date(parseInt(txpow.header.timemilli)),
        parent: txpow.header.superparents[0].parent,
        txpowid: txpow.txpowid,
    };
};

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

    /**
     * @param {string} address, a minima address
     * @returns {boolean} true if it is an address, false otherwise
     */
    const isAddress = useCallback((address: string) => {
        const startsCorrect = address.startsWith('0x') || address.startsWith('Mx');
        const lengthCorrect = address.length > 58 && address.length < 67;
        return startsCorrect && lengthCorrect;
    }, []);

    /**
     * @param {txpow[]} txpows
     * @returns {txpow[]} with none having the same txpowid
     */
    const removeDuplicates = useCallback((txpows: any[]) => {
        let unique: any = {};
        txpows.forEach((txpow) => {
            const txpowid: string = txpow.txpowid;
            unique[txpowid] = txpow;
        });
        const uniqueArray = Object.values(unique);
        return uniqueArray;
    }, []);

    /**
     * @param {string} txpowid
     * @returns {promise<RecentBlock>} a single RecentBlock object
     */
    const getRecentBlockByTxpowId: (txpowid: string) => Promise<RecentBlock> = useCallback((txpowid: string) => {
        return commands.txpow_txpowid(txpowid).then((txpow: any) => {
            return buildRecentBlockFromTxpow(txpow);
        });
    }, []);

    /**
     * @param {number[]} blockNumbers an array of block numbers
     * @returns {promise<RecentBlock[]>} an array of RecentBlock objects (each is a block, so no transactions)
     */
    const getRecentBlocksByBlockNumber: (b: number[]) => Promise<RecentBlock[]> = useCallback(
        async (blockNumbers: number[]) => {
            const txpowPromises = blockNumbers.map((blockNumber) => commands.txpow_block(blockNumber));
            return Promise.all(txpowPromises).then((txpows) => {
                const recentBlocks: RecentBlock[] = txpows.map((txpow: any) => {
                    return buildRecentBlockFromTxpow(txpow);
                });
                return recentBlocks;
            });
        },
        []
    );

    /**
     * @param {string} address, a minima address
     * gets all the blocks and transactions associated with that address
     * @returns {promise<RecentBlock[]>} an array of RecentBlock objects (each is a block, so no transactions)
     */
    const getRecentBlocksByAddress: (address: string) => Promise<RecentBlock[]> = useCallback(
        async (address: string) => {
            const txpows = await commands.txpow_address(address);
            console.log('address search results', txpows);
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

    /**
     * @param {string} searchString, could be a minima block number
     * search for a number against minima block number
     * update search results state if successful
     * @returns {void}
     */
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

    /**
     * @param {string} searchString, could be a txpowid or address
     * search for a string against minima txpowid
     * and if it fails try against minima address
     * update search results state if successful
     * @returns {void}
     */
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

    /**
     * side effect to change state on searchString change
     * @returns {void}
     */
    useEffect(() => {
        setRowsState((prev) => ({ ...prev, page: 0 }));
    }, [searchString]);

    /**
     * side effect to pagination of search results
     * @returns {void}
     */
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

    /**
     * ALL NETWORK REQUESTS ARE HANDLED IN THIS EFFECT
     * Side effect to handle the main data grid
     * This will show either the block history
     * or the results of a search
     * @returns {void}
     */
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
            pageBlockNumbers = pageBlockNumbers.filter((blockNumber) => blockNumber > 0);

            setRowsState((prev) => ({ ...prev, loading: true }));
            getRecentBlocksByBlockNumber(pageBlockNumbers).then(
                (recentBlocks) => {
                    setRowsState((prev) => ({
                        ...prev,
                        loading: false,
                        rows: recentBlocks,
                        rowCount: Math.min(MINIMA_MAX_ROWS, latestBlockNumber), // use max number of blocks (or less if from genesis)
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
