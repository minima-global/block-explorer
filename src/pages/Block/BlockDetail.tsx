import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getTxpow } from './../../minima/rpc-commands';
import { Box, Tab, Tabs } from '@mui/material';
import DisplayItem from './DisplayItem';
import { useRecentBlocksContext } from '../../minima/RecentBlocksContext';
import BlockTabs from './BlockTabs';

const BlockDetail = () => {
    const blocksContextData = useRecentBlocksContext();
    const [tabNumber, setTabNumber] = useState(0);
    const [txpow, setTxpow] = useState<any>(null);
    const routerParams = useParams();
    const txpowid = routerParams.txpowid;
    console.log('txpow', txpow);

    useEffect(() => {
        if (routerParams.txpowid) {
            getTxpow(routerParams.txpowid).then(
                (txpow: any) => {
                    // TODO: create txpow type
                    setTxpow(txpow);
                    blocksContextData.setVisibleBlockNumber(txpow.header.block);
                },
                (err) => {
                    console.error(err);
                }
            );
        }
    }, [txpowid, blocksContextData]);

    const DetailContainer = ({ children }: any) => {
        return (
            <Box
                sx={{
                    bgcolor: 'rgba(255, 255, 255, 0.5)',
                    boxShadow: 1,
                    borderRadius: 1.5,
                    p: 2,
                    mt: 2,
                    mb: 2,
                    minWidth: 300,
                }}
            >
                {children}
            </Box>
        );
    };

    const Detail = ({ myTxpow }: any) => {
        const allTransactions = myTxpow.body.txnlist.concat(myTxpow.body.burntxn);
        console.log('allTransactions', allTransactions);
        return (
            <>
                <DetailContainer>
                    <DisplayItem heading="TxPoW ID" text={myTxpow.txpowid} />
                    <DisplayItem heading="Block" text={myTxpow.header.block} />
                    <DisplayItem heading="Timestamp" text={myTxpow.header.date} />
                    <DisplayItem heading="Size" text={myTxpow.size} />
                    <DisplayItem heading="Is a block?" text={myTxpow.isblock ? 'Yes' : 'No'} />
                    <DisplayItem heading="Nonce" text={myTxpow.header.nonce} />
                    <DisplayItem heading="Superblock level" text={myTxpow.superblock} />
                    <DisplayItem
                        heading="Parent"
                        text={myTxpow.header.superparents[0].parent}
                        link={`/${myTxpow.header.superparents[0].parent}`}
                    />
                </DetailContainer>

                <Transactions transactions={myTxpow.body.txnlist} />
            </>
        );
    };

    const Transactions = ({ transactions }: any) => {
        if (transactions.length === 0) {
            return <></>;
        } else {
            return (
                <DetailContainer>
                    <h4>Transactions</h4>
                    {transactions.map((txnHash: string, i: number) => (
                        <DisplayItem heading="Transaction" text={txnHash} link={`/${txnHash}`} key={i} />
                    ))}
                </DetailContainer>
            );
        }
    };

    // recieves an array of inputs or outputs and creates the display components
    const InOut = ({ inout }: any) => {
        if (inout.length === 0) {
            return <></>;
        } else {
            return (
                <>
                    {inout.map(
                        (
                            input: any,
                            i: number // TODO: create input type
                        ) => (
                            <DetailContainer key={i}>
                                <DisplayItem heading="Index" text={i.toString()} />
                                <DisplayItem heading="Coin ID" text={input.coinid} />
                                <DisplayItem heading="Address" text={input.address} />
                                <DisplayItem heading="Token Id" text={input.tokenid} />
                                <DisplayItem heading="Amount" text={input.amount} />
                                <DisplayItem heading="Token Amount" text={input.tokenamount} />
                            </DetailContainer>
                        )
                    )}
                </>
            );
        }
    };

    // call this only when txpow is loaded (not null)
    const displayTab = () => {
        if (txpow) {
            switch (tabNumber) {
                case 0:
                    return <Detail myTxpow={txpow} />;
                case 1:
                    return <InOut inout={txpow.body.txn.inputs} />;
                case 2:
                    return <InOut inout={txpow.body.txn.outputs} />;
                default:
                    return <Detail myTxpow={txpow} />;
            }
        }
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <BlockTabs tabNumber={tabNumber} setTabNumber={setTabNumber}></BlockTabs>
                {txpow ? displayTab() : null}
            </Box>
        </>
    );
};

export default BlockDetail;
