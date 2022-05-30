
const MinimaEvent = {
    NEWBLOCK: "NEWBLOCK",
    NEWBALANCE: "NEWBALANCE",
    MAXIMA: "MAXIMA",
    MINING: "MINING",
};

const createNewWebSocket = () => {
    return new WebSocket(`ws://${window.location.hostname}:8091`);
};

/**
 * For now we are creating the web socket in this app, and putting a library wrapper around it
 * We need to eventually move this web socket and the library wrapper into mds-api
 */
let ws;

//////////////////////// empty functions before registration //////////////////////
let whenNewBlock = (d: any) => {
    console.log("NEWBLOCK event ... please resgister custom callback", d);
};
let whenMining = (d: any) => {
    console.log("MINIMG event ... please resgister custom callback", d);
};
let whenMaxima = (d: any) => {
    console.log("MAXIMA event ... please resgister custom callback", d);
};

///////////////////////////

const registerWebSocketEvents = () => {
    ws = createNewWebSocket();

    ws.onopen = () => {
        console.log("MINIMA WEBSOCKET OPENED");
    };

    ws.onclose = () => {
        console.log("WEBSOCKET CONNECTION LOST!!!!!!!!!! ... recreating...");

        // If websocket closes, recreate it
        setTimeout(function () {
            registerWebSocketEvents();
        }, 10 * 1000);
    };

    ws.onmessage = (evt: any) => {
        let data = JSON.parse(evt.data);
        const event = data.event;
        switch (event) {
            case MinimaEvent.NEWBLOCK:
                whenNewBlock(data);
                break;
            case MinimaEvent.MINING:
                whenMining(data);
                break;
            case MinimaEvent.MAXIMA:
                whenMaxima(data);
                break;
            default:
                console.error("Unknown event type: ", event);
        }
    };
};

// Do registration
registerWebSocketEvents();

///////////////////////// application registers custom callbacks ///////////////////////

function onNewBlock(callback: (data: any) => void) {
    whenNewBlock = callback;
}

function onMining(callback: (data: any) => void) {
    whenMining = callback;
}

function onMaxima(callback: (data: any) => void) {
    whenMaxima = callback;
}

export const events = {
    onNewBlock,
    onMining,
    onMaxima,
};
