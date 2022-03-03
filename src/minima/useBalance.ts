import { useState, useEffect } from 'react';
import { MinimaToken } from '@minima-global/mds-api';
import { commands } from '@minima-global/mds-api';

const useBalance = () => {
    const [balance, setBalance] = useState<MinimaToken[]>([]);

    useEffect(() => {
        commands
            .balance()
            .then((data: any) => {
                if (data.status) {
                    setBalance(data.response.balance);
                }
            })
            .catch((err) => {
                console.error(err);
                setBalance([]);
            });
        setInterval(() => {
            commands.balance().then(
                (data: any) => {
                    if (data.status) {
                        setBalance(data.response);
                    }
                },
                (err) => {
                    console.error(err);
                    setBalance([]);
                }
            );
        }, 10000);
    }, []);

    return balance;
};

export default useBalance;
