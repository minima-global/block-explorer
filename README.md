# QnA

-   Q. What is a minidapp and how is it different from a regular app?
-   A. Traditional web apps use a centralised database as part of thier back end. Minidapps use the minima blockchain instead for thier back end.

-   Q. How do I create a minima dapp?
-   A. You can import the MDS library into any javascript project. This will give you access to all minima data and services.

-   Q. How/Why do I use MDS in my project?
-   A. Right now will need access token. Update .npmrc etc.. MDS is the applications service layer

-   Q. How do i deploy my project?
-   A. TODO: so as it stands (subject to change after feedback)....
    package is what we'll call mds files/assets that have been zipped up and are for distribution or installation
    so I zip up the following:

    dapp.yml
    index.html
    otherJsFromNpmBuild.js
    init.js
    newBlock.js
    mining.js
    And I call it a package. So for installation I say...install this package file on this port (port will be automatically allocated eventually)
    But this all new stuff. So it needs feedback
    ideally we want to have a npm package.json script that does this for us i.e. "minidapp-package": "npm run build && zip -r out.zip ."

-   Q. What is a TxPow and why do i need to know about it?
-   A. TxPow is a basic building block in Minima. A block is a txpow, a transaction is a txpow... The MDS library exports the Txpow interface.
    TODO - why are we using that type
    TODO - what properties do we use and what do we do with them
    TODO - block type txpow vs transaction type txpow

-   Q. How do i see a transaction on the blockchain?
-   A. We can view the transactoins in any block by going into the `txpow.body.txnlist`. There you will find the txpow id for each transaction. Calling `commands.txpow_txpowid(txpowid)` will return the transaction txpow. In there will be the inputs and outputs of the transaction that are part of the UTXO model.
-

# Minima DApp System (MDS)

In the Block Explorer app, we are using two parts of the the mds api. This is `commands` and `events`. Other parts we are not using include `database` and `file`

For more information on MDS see the dedicated documentation at <mds-docs-more-coming-soon>

Commands is a pull based api so we can request data based on our application lifecycle.
Events is a push based api (websocket) so our app can subscribe to minima events as they occur.

## Blockchain data we request from the Minima DApp System

Functions used are

-   commands.txpow_address(address)
-   commands.txpow_txpowid(txpowid)
-   commands.txpow_block(blockNumber)

These return a TxPow object

## Minima events we listen for

-   NEWBLOCK

# Tooling

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Notes (TODO: remove when published)

-   docs should be something like https://web3js.readthedocs.io/en/v1.7.0/
