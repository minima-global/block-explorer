import uiBackground from './LM.jpg';
import { createTheme } from '@mui/material/styles';

// A custom theme for this app
let theme = createTheme({
    status: {
        danger: '#e53e3e',
    },
    palette: {
        primary: {
            main: '#363a3f',
        },
        secondary: {
            main: '#ff512f',
        },
        background: {
            default: 'rgba(22, 24, 28, 0.05)',
        },
        text: {
            primary: '#363a3f',
        },
        warning: {
            main: '#fdefbe',
        },
        success: {
            main: '#b6f4ee',
        },
        neutral: {
            main: '#64748B',
            contrastText: '#fff',
        },
        darkBlack: { main: '#0D0E10' },
        menu: { main: 'rgba(255, 255, 255, 0.95)' },
    },
    typography: {
        fontFamily: ['Manrope'].join(','),
        h6: {
            fontWeight: 700,
            fontSize: '14px',
            lineHeight: '21px',
        },
        h4: {
            fontWeight: 700,
            fontSize: '18px',
            lineHeight: '27px',
            letterSpacing: '0.02em',
        },
        h2: {
            fontWeight: 700,
            fontSize: 18,
            lineHeight: 1,
        },
        h1: {
            fontSize: 52,
        },
        body1: {
            fontSize: 17,
            fontWeight: 400,
            lineHeight: 1.04,
        },
    },
    shape: {
        borderRadius: 8,
    },

    spacing: 8,

    components: {
        MuiCssBaseline: {
            styleOverrides: `
            body {
                background-image: url(${uiBackground});
                background-size: cover;
            }
          `,
        },
    },
});

theme = createTheme(theme, {
    components: {
        // Name of the component
        MuiButton: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontSize: '1rem',
                },
            },
        },
        MuiAppBar: {
            styleOverrides: {
                root: {
                    backgroundColor: theme.palette.text.primary,
                },
            },
        },
        MuiDrawer: {
            styleOverrides: {
                paperAnchorLeft: {
                    backgroundColor: theme.palette.menu.main,
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.5)',
                    borderRadius: 8,
                    input: {
                        paddingLeft: 16,
                        borderRadius: 8,
                        fontWeight: '400',
                        fontSize: '1rem',
                        '&::placeholder': {
                            color: '#0D0E10',
                            fontSize: '1rem',
                            fontWeight: '400',
                        },
                        '&:focus': {
                            backgroundColor: 'rgba(255, 255, 255, 0.8)',
                        },
                    },
                },
            },
        },
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                    cursor: 'pointer',
                },
                overlay: {
                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                },
                columnHeader: {
                    backgroundColor: 'rgba(255, 255, 255, 0.8)',
                },
            },
        },
    },
});

export default theme;

declare module '@mui/material/styles' {
    interface Theme {
        status: {
            danger: React.CSSProperties['color'];
        };
    }

    interface Palette {
        neutral: Palette['primary'];
        darkBlack: Palette['primary'];
        menu: Palette['primary'];
    }
    interface PaletteOptions {
        neutral: PaletteOptions['primary'];
    }

    interface PaletteColor {
        darker?: string;
    }
    interface SimplePaletteColorOptions {
        darker?: string;
    }

    interface PaletteOptions {
        darkBlack?: PaletteOptions['primary'];
        menu?: PaletteOptions['primary'];
    }

    interface ThemeOptions {
        status: {
            danger: React.CSSProperties['color'];
        };
    }
}
