
import { responsiveFontSizes, createTheme } from '@mui/material/styles'

const drawerWidth = 240;
const drawerIndex = 1000;
const headerBackground = '#FFFFFF !important';
const headerText = 'black  !important';
const SideHeaderBackground = '#1263BE !important';
const SideHeaderText = 'white  !important';

const DrawerBackground = '#2A303C !important';
const DrawerText = '#21252F  !important';
const contentBackGround = '#EDF0F7';
const headerHeight = '66px';
const darkText = '#343A40';
const lightText = '#81757D';
const lightBlueText = '#0665d0';
const darkBlueText = '#022853';
const cardBackground = 'white';
const custome_theme = createTheme({
    spacing: 4,
    drawerIndex: drawerIndex,
    headerBackground,
    headerText,
    SideHeaderBackground,
    SideHeaderText,
    DrawerBackground,
    DrawerText,
    drawerWidth,
    contentBackGround,
    headerHeight,
    darkText,
    lightText,
    lightBlueText,
    darkBlueText,
    cardBackground,
    innerCard: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'left',
        width: '100%',
        borderRadius: '6px',
        background: cardBackground,
        fontSize: '16px',
        margin: '0px',
        padding: '0px',
    },
    textHighlighted: {
        color: darkText,
        fontSize: '16px',
        fontWeight: 600

    },
    sectionHeading: {
        color: darkText,
        fontSize: '16px',
        fontWeight: 600,
        padding: '8px 0px 18px 0px',
        textAlign: 'left'
    },
    textMutedBold: {
        color: lightText,
        fontSize: '12px',
        fontWeight: 600,
    },

    textBold: {
        color: darkText,
        fontSize: '12px',
        fontWeight: 600,
    },
    textMuted: {
        color: lightText,
        fontSize: '14px'
    },
    card: {
        color: darkBlueText,
        background: DrawerBackground
    },
    cardContent: {
        background: 'white',
        color: darkText,
        textTransform: 'initial',
        fontSize: '11px',
        lineHeight: '1.91234',
        /* margin: 4px 16px; */
        padding: '5px',
        borderRadius: '0px 0px 4px 4px'
    },
    avatar:{
        height:'33px',
        
        width:'33px',
    },
    actionButton:{
        color: lightText+' !important',
        fontSize: '11px !important',
        fontWeight: '800 !important',
        background: '#2a303c24 !important',
    },
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
            main: '#D72A2A',//indigo
            text: '#56525d',
            light: '#2B37D4',
            dark: 'white',
        },
        secondary: {
            main: '#E769A6',//pink
        },
        otherColors:{
            main:'#C3FC00'
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
        divider: '#EDF0F7'
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
        color: 'white !important',
        fontWeight: '600 !important',
        padding: '10px 24px !important'

    },
    cardBackground: {
        background: '#0B0A0D !important',
        color: '#56525d !important',
    },
    modal: {
        position: 'absolute',
        magin: 'auto',
        left: '',
        width: 400,
        background: '#0B0A0D !important',
        color: '#56525d !important',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,

    }
});


export default custome_theme;