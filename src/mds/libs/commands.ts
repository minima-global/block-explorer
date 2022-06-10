const status = () : Promise<Status> => {
    return new Promise((resolve, reject) => {
        MDS.cmd('status', (data: any) => {
            if (data.status) {
                const statusData: Status = data.response
                resolve(statusData)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_block = (blockNumber: number) : Promise<Txpow> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow block:${blockNumber}`, (data: any) => {
            if (data.status) {
                const txpow: Txpow = data.response
                resolve(txpow)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_txpowid = (txpowid: string) : Promise<Txpow> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow txpowid:${txpowid}`, (data: any) => {
            if (data.status) {
                const txpow: Txpow = data.response
                resolve(txpow)
            } else {
                reject(data)
            }
        })
    })
}

const txpow_address = (address: string) : Promise<Txpow[]> => {
    return new Promise((resolve, reject) => {
        MDS.cmd(`txpow address:${address}`, (data: any) => {
            if (data.status) {
                const txpows: Txpow[] = data.response
                resolve(txpows)
            } else {
                reject(data)
            }
        })
    })
}

export const commands = {
    status,
    txpow_block,
    txpow_txpowid,
    txpow_address
}