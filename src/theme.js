
import { responsiveFontSizes, createTheme } from '@mui/material/styles'

const drawerWidth = 240;
const rightDrawerWidth = '40%';
const drawerIndex = 1000;
const headerBackground = '#1F2028 !important';
const headerText = 'white  !important';
const SideHeaderBackground = '#282931 !important';
const SideHeaderText = 'white  !important';
const TabsBackground='#71777c !important';
const DrawerBackground = '#282931 !important';
const DrawerText = '#9096a5  !important';
const contentBackGround = '#1F2028';
const headerHeight = '66px';
const sideHeaderHeight = '120px';
const footerHeight = '66px';
const midContainerHeight = `calc(100% - ${(66 * 2) + 'px'})`;
const darkText = '#d6d6d6';
const lightText = '#e2e2e2';
const lightBlueText = '#999999';
const darkBlueText = '#c1dfff';
const cardBackground = 'black';
const theme = createTheme({
    spacing: (factor) => `${0.25 * factor}rem`,
    drawerIndex: drawerIndex,
    headerBackground,
    headerText,
    SideHeaderBackground,
    SideHeaderText,
    DrawerBackground,
    DrawerText,
    drawerWidth,
    rightDrawerWidth,
    contentBackGround,
    headerHeight,
    sideHeaderHeight,
    midContainerHeight,
    footerHeight,
    darkText,
    lightText,
    lightBlueText,
    darkBlueText,
    TabsBackground,
    cardBackground,
    rightDrawerHeader: {
        /* The image used */
        color: headerText,
        backgroutnd: 'none  !important',
        backgroundColor: 'transparent !important',
        /* Add the blur effect */
        backgroundBlendMode: 'screen',
        zIndex: 100,
        /* Full height */
        height: (66 * 2) + 'px',

        /* Center and scale the image nicely */
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',

    },
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
    avatar: {
        height: '33px',

        width: '33px',
    },
    // actionButton: {
    //     color: lightText + ' !important',
    //     fontSize: '11px !important',
    //     fontWeight: '800 !important',
    //     background: '##28293124 !important',
    // },
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
                    background: 'white',
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
    headerIcon:{
        width: '11em',
        fill:'white',
        paddingRight:'4px'
    },
    sideBarIcons:{
        width: '2em',
        background: 'transparent',
        padding: '2px',
        margin: '4px',
        borderRadius: '4px',
        color:'white'
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
            main: '#1976d2',//indigo
            text: '#56525d',
            light: '#1976d2',
            dark: '#1976d2',
        },
        secondary: {
            main: '#1976d2',//indigo
            text: '#1976d2',
            light: '#1976d2',
            dark: '#1976d2',
        },
        otherColors: {
            main: '#C3FC00'
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
            primary: '#000000',//white
            secondary: 'black',//white
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


    rightDrawerPaper: {
        background: contentBackGround + ' !important',
        color: darkText + ' !important',
    },
    drawerContainer: {

    },
    actionButton: {
        backgroundColor: '#4158D0',
        backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white !important',
        fontWeight: '600 !important',
        padding: '10px 24px !important'

    },
    actionButton2: {
        backgroundColor: '#4158D0',
        backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
        color: 'white !important',
        fontWeight: '600 !important',
       

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


export default theme;