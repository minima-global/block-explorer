import { useState, useEffect, SyntheticEvent } from 'react';
import { useParams } from 'react-router-dom';
import { getTxpow } from './../../minima/rpc-commands';
import { Box, Tab, Tabs } from '@mui/material';
import DisplayItem from './DisplayItem';

const BlockDetail = () => {
    const [value, setValue] = useState(0);
    const [txpow, setTxpow] = useState(null);
    const routerParams = useParams();
    const txpowid = routerParams.txpowid;

    useEffect(() => {
        if (routerParams.txpowid) {
            getTxpow(routerParams.txpowid).then(
                (txpow: any) => {
                    // TODO: create txpow type
                    setTxpow(txpow);
                },
                (err) => {
                    console.error(err);
                }
            );
        }
    }, [txpowid]);

    console.log(txpow);

    const handleChange = (event: SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    console.log(value);

    const Detail = ({ myTxpow }: any) => {
        return (
            <>
                <DisplayItem heading="TxPoW ID" text={myTxpow.txpowid} />
                <DisplayItem heading="Timestamp" text={myTxpow.header.date} />
                <DisplayItem heading="Size" text={myTxpow.size} />
                <DisplayItem heading="Is a block?" text={myTxpow.isblock} />
                <DisplayItem heading="Nonce" text={myTxpow.header.nonce} />
                <DisplayItem heading="Superblock level" text={myTxpow.superblock} />
                <DisplayItem
                    heading="Parent"
                    text={myTxpow.header.superparents[0].parent}
                    link={`/block/${myTxpow.header.superparents[0].parent}`}
                />
            </>
        );
    };

    return (
        <>
            <h1>Detail</h1>
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                        <Tab label="Details" />
                        <Tab label="Inputs" />
                        <Tab label="Outputs" />
                    </Tabs>
                </Box>
                {txpow ? <Detail myTxpow={txpow} /> : null}
            </Box>
        </>
    );
};

export default BlockDetail;
