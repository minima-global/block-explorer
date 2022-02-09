import { Box } from '@mui/material';
import { Link } from 'react-router-dom';

interface Iprops {
    heading: string;
    text: string;
    link?: string;
}

const DisplayItem = ({ heading, text, link }: Iprops) => {
    return (
        <Box
            sx={{
                bgcolor: 'rgba(255, 255, 255, 0.5)',
                boxShadow: 1,
                borderRadius: 2,
                p: 2,
                mt: 1,
                minWidth: 300,
            }}
        >
            <h5>{heading}</h5>
            <Box sx={{ overflow: 'hidden' }}>{link ? <Link to={link}>{text}</Link> : <p>{text}</p>}</Box>
        </Box>
    );
};

export default DisplayItem;
