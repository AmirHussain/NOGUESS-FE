
import { responsiveFontSizes, createTheme } from '@mui/material/styles'

const drawerWidth = 240;
const drawerIndex=1000;
const theme = createTheme({
    spacing: 4,
    drawerIndex: drawerIndex,
    
    drawerWidth: drawerWidth,
    headerHeight: '72px',
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
            text: '#56525d'
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
        divider: '#3A383F'
    },
    
    drawer: {
        width: drawerWidth,
        zIndex: drawerIndex,

        flexShrink: 0,
    },
    drawerPaper: {
        background: '#0b0a0d !important',
        color: '#56525d !important',
    },
    drawerContainer: {

    },
    walletConnect: {
        backgroundColor: '#4158D0',
        backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color:'white !important',
        fontWeight:'600 !important',
        padding:'10px 24px !important'

    },
    cardBackground:{
        background:'#0B0A0D !important',
        color:'#56525d !important',
    },
    modal:{
            position: 'absolute',
            magin: 'auto',
            left: '',
            width: 400,
            background:'#0B0A0D !important',
            color:'#56525d !important',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          
    }
});


export default theme;