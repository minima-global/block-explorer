import { useState, useEffect } from 'react';
import { commands } from '@minima-global/mds-api';

const useBlockNumber = () => {
    const [blockNumber, setBlockNumber] = useState(-1);

    useEffect(() => {
        setInterval(() => {
            commands.status().then(
                (data: any) => {
                    setBlockNumber(data.response.chain.block);
                },
                (err) => {
                    console.error(err);
                    setBlockNumber(-1);
                }
            );
        }, 10000);
    }, []);

    return blockNumber;
};

export default useBlockNumber;
