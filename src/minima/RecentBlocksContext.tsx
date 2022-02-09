// https://kentcdodds.com/blog/how-to-use-react-context-effectively

import { createContext, useContext, ReactNode } from 'react';
import useRecentBlocks from './useRecentBlocks';
import { RecentBlock } from './useRecentBlocks';

const RecentBlocksContext = createContext<RecentBlock[]>([]);

interface IProps {
    children: ReactNode;
}

function RecentBlocksProvider({ children }: IProps) {
    const recentBlocks = useRecentBlocks();
    return <RecentBlocksContext.Provider value={recentBlocks}>{children}</RecentBlocksContext.Provider>;
}

function useRecentBlocksContext() {
    const context = useContext(RecentBlocksContext);
    if (context === undefined) {
        throw new Error('useRecentBlocksContext must be used within a RecentBlocksProvider');
    }
    return context;
}

export { RecentBlocksProvider, useRecentBlocksContext };
