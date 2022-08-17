
import { responsiveFontSizes, createTheme } from '@mui/material/styles'

const theme = responsiveFontSizes(createTheme({
    spacing: 4,
    drawerIndex: 1000,
    headerHeight:'80px',
    components: {
        MuiAppBar: {
            styleOverrides: {
                colorPrimary: {
                    backgroundColor: "red"
                },
            }
        },



        MuiToolbar: {
            styleOverrides: {


                root: {
                    background: 'black',
                    color: 'white'

                }
            }
        },
        Drawer: {
            width: '240px',
            fontSize: '12px',
            lineHeight: '24px',
            background: '#1d1b22',
            color: '#56525d'
        },

    },

    typography: {
        fontFamily: [
            'Roboto',
            'Raleway',
            'Open Sans',
        ].join(','),
        h1: {
            fontSize: '5rem',
            fontFamily: 'Raleway',
        },
        h2: {
            fontSize: '3.5rem',
            fontFamily: 'Open Sans',
            fontStyle: 'bold',
        },
        h3: {
            fontSize: '2.5rem',
            fontFamily: 'Roboto',
        },
    },
    palette: {
        background: {
            default: '#009900'//green
        },
        primary: {
            main: '#2B37D4',//indigo
            text:'#56525d'
        },
        secondary: {
            main: '#E769A6',//pink
        },
        error: {
            main: '#D72A2A',//red
        },
        warning: {
            main: '#FC7B09',//orange
        },
        info: {
            main: '#6B7D6A',//gray
        },
        success: {
            main: '#09FE00',//green
        },
        text: {
            primary: '#000000',//black
            secondary: '#FFFFFF',//white
        },
    },
}));


export default theme;