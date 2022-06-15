import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, Container, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Routes from '../app.routes';
import { RouteType } from './../app.routes';
import { useLocation, useRoutes, useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import { useRecentBlocksContext } from '../minima/RecentBlocksContext';

// const drawerWidth = 240;

export default function Layout() {
    const blocksContextData = useRecentBlocksContext();
    const myRoutes = useRoutes(Routes);
    const routerNavigate = useNavigate();
    const location = useLocation();
    const [isOpen, setIsOpen] = useState(false);

    const handleDrawerToggle = () => {
        setIsOpen((op) => !op);
    };

    const onBackArrowClicked = () => {
        routerNavigate('/');
    };

    // path will look like this on detail page: /block/0x0000002AC916A9733CE92ED56036142419EBA57386F723E5D59B5843DDD33B97
    // path will look ike this on main page: /block
    function isOnBlockDetailPage(path: string) {
        const sections = path.split('/');
        const lastSection = sections[sections.length - 1];
        return lastSection.startsWith('0x');
    }

    function getPageName() {
        if (isOnBlockDetailPage(location.pathname)) {
            return `Block ${blocksContextData.visibleBlockNumber}`;
        } else {
            return 'Explore the Block';
        }
    }

    return (
        <>
            <AppBar position="static">
                <Toolbar variant="dense">
                    {isOnBlockDetailPage(location.pathname) ? (
                        <IconButton sx={{ pl: 0 }} color="inherit" onClick={onBackArrowClicked}>
                            <ArrowBackIcon />
                        </IconButton>
                    ) : null}

                    <Typography sx={{ mb: 0.25 }} variant="h4">
                        {getPageName()}
                    </Typography>
                </Toolbar>
            </AppBar>

            <Box component="main">
                <Container maxWidth="md">{myRoutes}</Container>
            </Box>
        </>
    );
}
