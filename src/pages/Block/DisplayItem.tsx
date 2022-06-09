import { Box, List, ListItem, ListItemText, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

interface Iprops {
    heading: string;
    text: string;
    link?: string;
}

const DisplayItem = ({ heading, text, link }: Iprops) => {
    return (
        <ListItem
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: 0,
                borderRadius: 1,
                p: 2,
                mt: 1,
                // minWidth: 300,
                fontSize: 14,
            }}
        >
            <ListItemText
                disableTypography
                primary={<Typography variant="h6">{heading}</Typography>}
                secondary={
                    <Typography
                        variant="subtitle1"
                        sx={{ overflowX: 'hidden', textOverflow: 'ellipsis', mt: 0.5, overflowY: 'hidden' }}
                    >
                        {link ? <Link to={link}>{text}</Link> : text}
                    </Typography>
                }
            />
            {/* <Typography variant="h6">{heading}</Typography>
            <Typography
                variant="subtitle1"
                sx={{ overflowX: 'hidden', textOverflow: 'ellipsis', mt: 0.5, overflowY: 'hidden' }}
            >
                {link ? <Link to={link}>{text}</Link> : text}
            </Typography> */}
        </ListItem>
    );
};

export default DisplayItem;
