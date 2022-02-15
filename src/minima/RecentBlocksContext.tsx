// https://kentcdodds.com/blog/how-to-use-react-context-effectively

import { createContext, useContext, ReactNode } from 'react';
import { useState } from 'react';

interface IRecentBlocksContext {
    visibleBlockNumber: number;
    setVisibleBlockNumber: (blockNumber: number) => void;
}

const RecentBlocksContext = createContext<IRecentBlocksContext | undefined>(undefined);

interface IProps {
    children: ReactNode;
}

function RecentBlocksProvider({ children }: IProps) {
    const [visibleBlockNumber, setVisibleBlockNumber] = useState(0);

    const value = {
        visibleBlockNumber,
        setVisibleBlockNumber,
    };
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
