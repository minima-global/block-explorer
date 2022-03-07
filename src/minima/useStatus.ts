import { useState, useEffect } from 'react';
import { commands, Status } from '@minima-global/mds-api';
import { POLL_INTERVAL } from './constants';

const useStatus = () => {
    const [latest, setLatest] = useState<Status>(EmptyStatus);

    useEffect(() => {
        commands.status().then(
            (data) => {
                setLatest(data);
            },
            (err) => {
                console.error(err);
                setLatest(EmptyStatus);
            }
        );

        const subscription = setInterval(() => {
            commands.status().then(
                (data) => {
                    setLatest(data);
                },
                (err) => {
                    console.error(err);
                    setLatest(EmptyStatus);
                }
            );
        }, POLL_INTERVAL);

        // cleanup
        return () => {
            clearInterval(subscription);
        };
    }, []);

    return latest;
};

export default useStatus;

const EmptyStatus = {
    version: '',
    devices: 0,
    length: 0,
    weight: 0,
    configuration: '',
    minima: 0,
    coins: 0,
    data: '',
    memory: {
        ram: '',
        disk: '',
        files: {
            txpowdb: '',
            archivedb: '',
            cascade: '',
            chaintree: '',
            wallet: '',
            userdb: '',
            p2pdb: '',
        },
    },
    chain: {
        block: 0,
        time: '',
        hash: '',
        speed: '',
        difficulty: '',
        size: 0,
        length: 0,
        weight: 0,
        branches: 0,
        cascade: {
            start: 0,
            length: 0,
            weight: '',
        },
    },
    txpow: {
        mempool: 0,
        ramdb: 0,
        txpowdb: 0,
        archivedb: 0,
    },
    network: {
        host: '',
        hostset: false,
        port: 0,
        connecting: 0,
        connected: 0,
        rpc: false,
        p2p: {
            address: '',
            isAcceptingInLinks: false,
            numInLinks: 0,
            numOutLinks: 0,
            numNotAcceptingConnP2PLinks: 0,
            numNoneP2PLinks: 0,
            numKnownPeers: 0,
            numAllLinks: 0,
            nio_inbound: 0,
            nio_outbound: 0,
        },
    },
};
