
////////////// response interfaces //////////
interface InitResponse {
    event: 'inited';
}

interface MiningResponse {
    event: 'MINING';
    data: MiningData;
}
interface MiningData {
    mining: boolean;
    txpow: Txpow;
}

interface NewBlockResponse {
    event: 'NEWBLOCK';
    data: NewBlockData;
}
interface NewBlockData {
    txpow: Txpow;
}

interface MinimaLogResponse {
    event: 'MINIMALOG';
    data: MinimaLogData;
}
interface MinimaLogData {
    message: string;
}

interface NewBalanceResponse {
    event: 'NEWBALANCE';
    data: NewBalanceData;
}
interface NewBalanceData {
    // TODO
}

interface MaximaResponse {
    event: 'MAXIMA';
    data: MaximaData;
}
interface MaximaData {
    application: string;
    data: string;
    from: string;
    msgid: string;
    random: string;
    time: string;
    timemilli: number;
    to: string;
}


//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: NewBlockData) => {
    console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: MiningData) => {
    console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: MaximaData) => {
    console.log("MAXIMA event ... please resgister custom callback", d);
};
let whenNewBalance = (d: NewBalanceData) => {
    console.log("NEW BALANCE event ... please resgister custom callback", d);
};
let whenInit = () => {
    console.log("INIT event ... please resgister custom callback");
};
let whenMinimaLog = (d: MinimaLogData) => {
    console.log("MINIMA LOG event ... please resgister custom callback", d);
};

///////////////////////////

const initializeMinima = () => {

    MDS.init((nodeEvent: InitResponse | MiningResponse | NewBlockResponse | MinimaLogResponse | NewBalanceResponse | MaximaResponse) => {

        switch (nodeEvent.event) {
            case 'inited':
                whenInit()
                break;
            case 'NEWBLOCK':
                const newBlockData = nodeEvent.data
                whenNewBlock(newBlockData);
                break;
            case 'MINING':
                const minimgData = nodeEvent.data
                whenMining(minimgData);
                break;
            case 'MAXIMA':
                const maximaData = nodeEvent.data
                whenMaxima(maximaData);
                break;
            case 'NEWBALANCE':
                const newBalanceData = nodeEvent.data
                whenNewBalance(newBalanceData);
                break;
            case 'MINIMALOG':
                const minimaLogeData = nodeEvent.data
                whenMinimaLog(minimaLogeData);
                break;
            default:
                console.error("Unknown event type: ", nodeEvent);
        }
    });
};

// Do registration
initializeMinima();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: NewBlockData) => void) {
    whenNewBlock = callback;
}

function onMining(callback: (data: MiningData) => void) {
    whenMining = callback;
}

function onMaxima(callback: (data: MaximaData) => void) {
    whenMaxima = callback;
}

function onNewBalance(callback: (data: NewBalanceData) => void) {
    whenNewBalance = callback;
}

function onInit(callback: () => void) {
    whenInit = callback;
}

function onMinimaLog(callback: (data: MinimaLogData) => void) {
    whenMinimaLog = callback;
}

export const events = {
    onNewBlock,
    onMining,
    onMaxima,
    onNewBalance,
    onInit,
    onMinimaLog
};
