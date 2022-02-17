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
                borderRadius: 1,
                p: 2,
                mt: 1,
                minWidth: 300,
                fontSize: 14,
            }}
        >
            <Box sx={{ fontWeight: 'bold' }}>{heading}</Box>
            <Box sx={{ overflow: 'hidden', mt: 0.5 }}>{link ? <Link to={link}>{text}</Link> : text}</Box>
        </Box>
    );
};

export default DisplayItem;
