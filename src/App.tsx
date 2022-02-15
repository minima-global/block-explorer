import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme/theme';
import { useRoutes } from 'react-router-dom';
import Routes from './app.routes';
import Container from '@mui/material/Container';
import Layout from './layout/Layout';
import { SnackbarProvider } from 'notistack';
import { RecentBlocksProvider } from './minima/RecentBlocksContext';

export default function App() {
    const myRoutes = useRoutes(Routes);

    return (
        <>
            <ThemeProvider theme={theme}>
                <SnackbarProvider maxSnack={3}>
                    <RecentBlocksProvider>
                        <CssBaseline />
                        <Layout />
                    </RecentBlocksProvider>
                </SnackbarProvider>
            </ThemeProvider>
        </>
    );
}
