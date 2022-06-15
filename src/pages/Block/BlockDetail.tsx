import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography } from '@mui/material';
import DisplayItem from './DisplayItem';
import { useRecentBlocksContext } from '../../minima/RecentBlocksContext';
import BlockTabs from './BlockTabs';
import { commands } from './../../mds'

const BlockDetail = () => {
    const blocksContextData = useRecentBlocksContext();
    const [tabNumber, setTabNumber] = useState(0);
    const [txpow, setTxpow] = useState<any>(null);
    const routerParams = useParams();
    const txpowid = routerParams.txpowid;
    // console.log('txpow', JSON.stringify(txpow));

    useEffect(() => {
        if (routerParams.txpowid) {
            commands.txpow_txpowid(routerParams.txpowid).then(
                (txpow: Txpow) => {
                    setTxpow(txpow);
                    blocksContextData.setVisibleBlockNumber(parseInt(txpow.header.block));
                },
                (err: any) => {
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

                <BurnTransaction burntxn={myTxpow.body.burntxn}></BurnTransaction>
                <Transactions transactions={myTxpow.body.txnlist} />
            </>
        );
    };

    const BurnTransaction = ({ burntxn }: any) => {
        return (
            <DetailContainer>
                <Typography variant="h4">Burn Transaction</Typography>
                <DisplayItem heading="Transaction Id" text={burntxn.transactionid} />
                <DisplayItem heading="Link Hash" text={burntxn.linkhash} />
            </DetailContainer>
        );
    };

    const Transactions = ({ transactions }: any) => {
        if (transactions.length === 0) {
            return <></>;
        } else {
            return (
                <DetailContainer>
                    <Typography variant="h4">Transactions</Typography>
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
            return (
                <DetailContainer>
                    <DisplayItem heading="TXPOW is not a transaction" text={''} />
                </DetailContainer>
            );
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
                                <DisplayItem heading="MiniAddress" text={input.miniaddress} />
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
