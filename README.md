# Block Explorer

Block Explorer Minidapp built for Minima to view the latest blocks produced by the Minima block chain and also search for them

### Prerequisites

With this current version of our mds-api pkg you will need to generate a personal access token that sits in your root directory _e.g_

`~/.npmrc`

which holds something like:

`//npm.pkg.github.com/:_authToken=ghp_D8tXIVpi...4eWX7sV4ExnLV`

(Learn how [to](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry))

and have another `.npmrc` file in the root of this project holding this link:

`@minima-global:registry=https://npm.pkg.github.com`

## Installation

Once you have registered your **_personal access token_** you now have the rights to use **mds-api** 😎.

-   Run `npm i` in the root of this project, this should install all the dependencies including **mds-api**.
-   Run `npm run build-zip` that should build you a `block.zip` minidapp in the root of this project.

Finally,

-   Make sure you have a [Minima](https://github.com/minima-global/Minima) node and [mds](https://github.com/minima-global/mds-core) running.
-   Now open your browser and go to `127.0.0.1:8090/` which should take you to the **minihub**.
-   Click the install btn, and find your `block.zip`.

All done, enjoy.

# QnA

1. What is a MiniDapp and how is it different from a regular app?

    Traditional web apps use a centralised database as part of their back end. MiniDapps are decentralized applications using the Minima blockchain instead for their back end.

2. What is the Minima Dapp System (MDS)?

Explain here what MDS is...

3.  How do I create a MiniDapp?

    You can import the Minima Dapp System (MDS) library into any javascript project. This will give you access to all Minima data and services.

4.  How/Why do I use the Minima Dapp System (MDS) in my project?

    Right now you will need an access token. Update .npmrc etc.. MDS is the applications service layer

5.  How do I deploy my project?

        TODO: so as it stands (subject to change after feedback)....

    package is what we'll call mds files/assets that have been zipped up and are for distribution or installation so I zip up the following:

        dapp.yml
        index.html
        otherJsFromNpmBuild.js
        init.js
        newBlock.js
        mining.js
        And I call it a package. So for installation I say...install this package file on this port (port will be automatically allocated eventually)
        But this all new stuff. So it needs feedback
        ideally we want to have a npm package.json script that does this for us i.e. "minidapp-package": "npm run build && zip -r out.zip ."

6.  What is TxPoW and why do I need to know about it?

    TxPoW stands for Transaction Proof-of-Work. A TxPoW object is a basic building block in Minima. A TxPoW object contains transactions and in some cases will become a block on the Minima blockchain. The MDS library exports the TxPoW interface containing the properties of a TxPoW object.
    TODO - why are we using that type
    TODO - what properties do we use and what do we do with them
    TODO - block type txpow vs transaction type txpow

7.  How do I see a transaction on the blockchain?

    We can view the transactions in any block by going into the `txpow.body.txnlist`. There you will find the TxPoW ID for each transaction. Calling `commands.txpow_txpowid(txpowid)` will return the transaction TxPoW. In there will be the inputs and outputs of the transaction that are part of the UTXO model.

# Minima DApp System (MDS)

In the Block Explorer app, we are using two parts of the the MDS api, `commands` and `events`. Other parts we are not using include `database` and `file`.

For more information on MDS see the dedicated documentation at <mds-docs-more-coming-soon>

**Commands** is a pull based api so we can request data based on our application lifecycle.

**Events** is a push based api (websocket) so our app can subscribe to Minima events as they occur.

## Blockchain data we request from the Minima DApp System

Functions used are

-   commands.txpow_address(address)
-   commands.txpow_txpowid(txpowid)
-   commands.txpow_block(blockNumber)

These return a TxPow object.

## Minima events we listen for

-   NEWBLOCK

# Tooling

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

# Notes (TODO: remove when published)

-   docs should be something like https://web3js.readthedocs.io/en/v1.7.0/
