# Minima DApp System (MDS)

Blockchain data come from the Minima DApp System

Functions used are

-   commands.txpow_address(address)
-   commands.txpow_txpowid(txpowid)
-   commands.txpow_block(blockNumber)

These return a TxPow object

TODO - show TxPow type
TODO - why are we using that type
TODO - what properties do we use and what do we do with them

TODO - block type txpow vs transaction type txpow

# MDS Setup

-   Dapps directory, new folder 8083
-   dapp.yml

Uses useStatus() hook which polls mds. TODO - do we want to keep this or use the websocket??

# Tooling

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).


# Quick Start Guide


# QnA


- Q. What is a minidapp and how is it different from a regular app?
- A. Traditional web apps use a centralised database as part of thier back end. Minidapps use the minima blockchain instead for thier back end.

- Q. How do I create a minima dapp?
- A. You can import the MDS library into any javascript project. This will give you access to all minima data and services.

- Q. How/Why do I use MDS in my project?
- A. Atm will need access token. Update .npmrc etc.. MDS is the applications service layer 

- Q. How do i deploy my project?
- A. Build it and distribute it yourself to users.

- Q. What is a TxPow and why do i need to know about it?
- A. TxPow is a basic building block in Minima. A block is a txpow, a transaction is a txpow...

- Q. How do i see a transaction on the blockchain?
- Q. We can view the transactoins in any block by going into the `txpow.body.txnlist`. There you will find the txpow id for each transaction. Calling `commands.txpow_txpowid(txpowid)` will return the transaction txpow. In there will be the inputs and outputs of the transaction that are part of the UTXO model.