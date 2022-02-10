// https://kentcdodds.com/blog/how-to-use-react-context-effectively

import { createContext, useContext, ReactNode } from 'react';
import useRecentBlocks from './useRecentBlocks';
import { RecentBlock } from './useRecentBlocks';
import { useState } from 'react';

interface IRecentBlocksContext {
    recentBlocks: RecentBlock[];
    visibleBlockNumber: number;
    setVisibleBlockNumber: (blockNumber: number) => void;
}

const RecentBlocksContext = createContext<IRecentBlocksContext | undefined>(undefined);

interface IProps {
    children: ReactNode;
}

function RecentBlocksProvider({ children }: IProps) {
    const recentBlocks = useRecentBlocks();
    const [visibleBlockNumber, setVisibleBlockNumber] = useState(0);
    const value = { recentBlocks, visibleBlockNumber, setVisibleBlockNumber };
    return <RecentBlocksContext.Provider value={value}>{children}</RecentBlocksContext.Provider>;
}

function useRecentBlocksContext() {
    const context = useContext(RecentBlocksContext);
    if (context === undefined) {
        throw new Error('useRecentBlocksContext must be used within a RecentBlocksProvider');
    }
    return context;
}

export { RecentBlocksProvider, useRecentBlocksContext };
