import { useState } from 'react';
import { AppBar, Toolbar, Typography, IconButton, Drawer, Box, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Routes from '../app.routes';
import { RouteType } from './../app.routes';
import { useLocation, useRoutes, useNavigate } from 'react-router-dom';
import SideMenu from './SideMenu';
import { useRecentBlocksContext } from '../minima/RecentBlocksContext';

const drawerWidth = 240;

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
        routerNavigate('/block');
    };

    // path will look like this on detail page: /block/0x0000002AC916A9733CE92ED56036142419EBA57386F723E5D59B5843DDD33B97
    // path will look ike this on main page: /block
    function isOnBlockDetailPage(path: string) {
        const sections = path.split('/');
        return sections.length > 2;
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
            <AppBar
                position="static"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Toolbar sx={{ bgcolor: 'text.secondary' }}>Block</Toolbar>
                <Toolbar>
                    {isOnBlockDetailPage(location.pathname) ? (
                        <IconButton sx={{ pl: 0 }} color="inherit" onClick={onBackArrowClicked}>
                            <ArrowBackIcon />
                        </IconButton>
                    ) : (
                        <IconButton
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                pl: 0,
                            }}
                            color="inherit"
                            aria-label="menu"
                            onClick={handleDrawerToggle}
                        >
                            <MenuIcon />
                        </IconButton>
                    )}

                    <Typography>{getPageName()}</Typography>
                </Toolbar>
            </AppBar>

            <Box
                component="main"
                sx={{
                    width: { sm: `calc(100% - ${drawerWidth}px)` },
                    ml: { sm: `${drawerWidth}px` },
                }}
            >
                <Container maxWidth="sm">{myRoutes}</Container>
            </Box>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                <Drawer
                    variant="temporary"
                    open={isOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    <SideMenu handleDrawerToggle={handleDrawerToggle}></SideMenu>
                </Drawer>
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    <SideMenu handleDrawerToggle={handleDrawerToggle}></SideMenu>
                </Drawer>
            </Box>
        </>
    );
}
