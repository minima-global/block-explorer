import useBalance from '../minima/useBalance';
import { List, ListItem, Grid } from '@mui/material';

const Balance = () => {
    const balance = useBalance();

    return (
        <>
            <Grid container spacing={2}>
                <Grid item xs={0} md={2}></Grid>
                <Grid item xs={12} md={8}>
                    <List>
                        {balance?.map((item, i) => (
                            <ListItem
                                sx={{ backgroundColor: 'primary' }}
                                key={i}
                            >{`${item.token} ${item.confirmed}`}</ListItem>
                        ))}
                    </List>
                </Grid>
                <Grid item xs={0} md={2}></Grid>
            </Grid>
        </>
    );
};

export default Balance;

const BalanceItem = () => {};
