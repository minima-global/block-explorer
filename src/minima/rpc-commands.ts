import { STATUS, BALANCE, RPCHOST, SEND, HELP, ADDRESS, TOKENCREATE } from './constants';
import Minima from './minimanew.js';
import { Status } from '../types/minima';

// call any generic minima command
export const callCommand = (command: string) => {
    return new Promise((resolve, reject) => {
        Minima.cmd(command, (data: any) => {
            if (data.status) {
                resolve(data);
            } else {
                reject(data);
            }
        });
    });
};

export const callToken = (data: any) => () => {
    const command = `${TOKENCREATE}+name:${JSON.stringify(data.name)}+amount:${data.amount}`;
    return callCommand(command);
};

interface SendData {
    address: string;
    amount: string;
    tokenid: string;
}

export const callSend = (data: SendData) => {
    const command = `${SEND}+address:${data.address}+amount:${data.amount}+tokenid:${data.tokenid}`;
    return callCommand(command);
};

export const callAddress = () => {
    return callCommand(ADDRESS);
};

export const callStatus: () => Promise<Status> = () => {
    return new Promise((resolve, reject) => {
        Minima.cmd(STATUS, (data: any) => {
            if (data.status) {
                resolve(data.response);
            } else {
                reject(data); // TODO: handle error
            }
        });
    });
};

export const getTxpow = (txpowId: string) => {
    const command = `txpow txpowid:${txpowId}`;
    return new Promise((resolve, reject) => {
        Minima.cmd(command, (data: any) => {
            if (data.status) {
                resolve(data.response);
            } else {
                reject(data); // TODO: handle error
            }
        });
    });
};

export const getTxpowByBlockNumber = (blockNumber: number) => {
    const command = `txpow block:${blockNumber}`;
    return new Promise((resolve, reject) => {
        Minima.cmd(command, (data: any) => {
            if (data.status) {
                resolve(data.response);
            } else {
                reject(data); // TODO: handle error
            }
        });
    });
};

export const getTxpowByAddress = (address: string) => {
    const command = `txpow address:${address}`;
    return new Promise((resolve, reject) => {
        Minima.cmd(command, (data: any) => {
            if (data.status) {
                resolve(data.response);
            } else {
                reject(data); // TODO: handle error
            }
        });
    });
};

export const callBalance = () => {
    return callCommand(BALANCE);
};

export const callHelp = () => {
    return callCommand(HELP);
};
