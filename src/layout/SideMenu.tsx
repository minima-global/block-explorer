import {
    Toolbar,
    Typography,
    ListItemText,
    Button,
    Box,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    Radio,
    Grid,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import Routes, { RouteType } from '../app.routes';
// import useBlockNumber from '../minima/useBlockNumber';
import { ReactComponent as LandscapeLogo } from './LANDSCAPE-01.svg';
import AppLogo from './../assets/images/app-logo.png';

interface IProps {
    handleDrawerToggle: () => void;
}

const SideMenu = ({ handleDrawerToggle }: IProps) => {
    const navigate = useNavigate();
    const routerLocation = useLocation();
    // const blockNumber = useBlockNumber();
    const activeRoute = (routeName: any) => {
        return routerLocation.pathname === routeName ? true : false;
    };

    const onMenuItemClicked = (path: string) => () => {
        navigate(path);
        handleDrawerToggle();
    };

    const sidebarRoutes = Routes.filter((route: RouteType) => !!route.sidebarName);

    return (
        <>
            <Toolbar variant="dense">
                <img src={AppLogo} alt="applogo" id="applogo" />
                <Typography variant="h2" sx={{ pl: 2 }}>
                    Block Explorer
                </Typography>
            </Toolbar>
            <Divider />

            <Grid container direction="column" justifyContent="space-between" sx={{ height: '100%' }}>
                {/* Add div so space-between puts logo to bottom */}
                <div></div>

                <Grid item sx={{ mb: 2 }}>
                    <Grid container sx={{ pl: 2, pr: 2, mt: 4 }} alignItems="flex-end">
                        <Grid item xs={4}>
                            <Box sx={{ fontSize: 12, letterSpacing: 0.02, lineHeight: 1.5 }}>Powered by</Box>
                        </Grid>
                        <Grid item xs={8}>
                            <LandscapeLogo></LandscapeLogo>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};

export default SideMenu;
