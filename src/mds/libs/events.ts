
////////////// response interfaces //////////
interface InitResponse {
    event: 'inited';
}
function isInitResponse(obj: any): obj is InitResponse {
    return obj.event === 'inited';
}

interface MiningResponse {
    event: 'MINING';
    data: MiningData;
}
interface MiningData {
    mining: boolean;
    txpow: Txpow;
}
function isMiningResponse(obj: any): obj is MiningResponse {
    return obj.event === 'MINING';
}

interface NewBlockResponse {
    event: 'NEWBLOCK';
    data: NewBlockData;
}
interface NewBlockData {
    txpow: Txpow;
}
function isNewBlockResponse(obj: any): obj is NewBlockResponse {
    return obj.event === 'NEWBLOCK';
}

interface MinimaLogResponse {
    event: 'MINIMALOG';
    data: MinimaLogData;
}
interface MinimaLogData {
    message: string;
}
function isMinimaLogResponse(obj: any): obj is MinimaLogResponse {
    return obj.event === 'MINIMALOG';
}

interface NewBalanceResponse {
    event: 'NEWBALANCE';
    data: NewBalanceData;
}
interface NewBalanceData {
    // TODO
}
function isNewBalanceResponse(obj: any): obj is NewBalanceResponse {
    return obj.event === 'NEWBALANCE';
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
function isMaximaResponse(obj: any): obj is MaximaResponse {
    return obj.event === 'MAXIMA';
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
