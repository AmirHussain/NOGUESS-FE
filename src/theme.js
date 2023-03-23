import { responsiveFontSizes, createTheme } from '@mui/material/styles';

const drawerWidth = 224;
const rightDrawerWidth = '40%';
const drawerIndex = 1000;
const greenColor = '#18DF8B';
const backgroundImage = 'url(https://www.varnofx.com/styles/assets/images/bg.png) #100f15 no-repeat center top';
const headerBackground = '#1F2028 !important';
const headerText = 'white  !important';
const SideHeaderBackground = '#282931 !important';
const SideHeaderText = 'white  !important';
const TabsBackground = '#28293194 !important';
const hoverBackground = '#33343e  !important';
const DrawerBackground = '#282931 !important';
const DrawerText = '#9096a5  !important';
const contentBackGround = '#1F2028 !important';
const cardContentBackGround = '#28293194 !important';
const headerHeight = '66px';
const sideHeaderHeight = '120px';
const cardBorderRadius = '28px !important';
const footerHeight = '66px';
const chipBackground = '#383944';
const midContainerHeight = `calc(100% - ${66 * 2 + 'px'})`;
const modalMdMidContainerHeight = `calc(100% - 90px)`;
const modalXsMidContainerHeight = `calc(100% - 48px)`;

const modalMdMidContainerMaxHeight = `calc(100vh - 100px)`;
const modalXsMidContainerMaxHeight = `calc(100vh - 48px)`;

const darkText = '#d6d6d6';
const lightText = 'rgb(149, 151, 161)';
const lightBlueText = '#999999';
const darkBlueText = '#c1dfff';
const borderColor = 'rgb(149 151 161 / 19%)';
const theme = createTheme({
  spacing: (factor) => `${0.25 * factor}rem`,
  drawerIndex: drawerIndex,
  headerBackground,
  headerText,
  hoverBackground,
  SideHeaderBackground,
  SideHeaderText,
  DrawerBackground,
  DrawerText,
  drawerWidth,
  rightDrawerWidth,
  contentBackGround,
  backgroundImage,
  greenColor,
  headerHeight,
  sideHeaderHeight,
  midContainerHeight,
  modalMdMidContainerHeight,
  modalXsMidContainerHeight,
  modalMdMidContainerMaxHeight,
  modalXsMidContainerMaxHeight,
  footerHeight,
  darkText,
  lightText,
  lightBlueText,
  darkBlueText,
  TabsBackground,
  borderColor,
  cardBorderRadius,
  rightDrawerHeader: {
    /* The image used */
    color: headerText,
    background: 'none  !important',
    backgroundColor: 'transparent !important',
    /* Add the blur effect */
    backgroundBlendMode: 'screen',
    zIndex: 100,
    /* Full height */
    // height: (66 * 2) + 'px',

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
    borderRadius: cardBorderRadius,
    background: TabsBackground,
    color: lightText + ' !important',
    fontSize: '16px',
    margin: '0px',
    padding: '0px',
  },
  textHighlighted: {
    color: darkText,
    fontSize: '16px',
    fontWeight: 600,
  },
  sectionHeading: {
    color: darkText,
    fontSize: '16px',
    fontWeight: 600,
    padding: '8px 0px 18px 0px',
    textAlign: 'left',
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
    fontSize: '14px',
  },
  card: {
    color: darkBlueText,
    background: cardContentBackGround,
    borderRadius: cardBorderRadius,
    padding: '10px',
    marginBottom: '10px',
  },
  cardContent: {
    color: darkText,
    // background: cardContentBackGround,
    textTransform: 'initial',
    fontSize: '11px',
    lineHeight: '1.91234',
    /* margin: 4px 16px; */
    padding: '5px',
    paddingBottom: 'inherit !important',
    borderRadius: '0px 0px 28px 28px !important',
  },
  avatar: {},
  // actionButton: {
  //     color: lightText + ' !important',
  //     fontSize: '11px !important',
  //     fontWeight: '800 !important',
  //     background: '##28293124 !important',
  // },
  components: {
    MuiStepIcon: {
      styleOverrides: {
        root: {
          '&$completed': {
            color: 'pink',
          },
          '&$active': {
            color: 'red',
          },
        },
        active: {},
        completed: {},
      },
    },
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: 'red',
        },
      },
    },

    MuiToolbar: {
      styleOverrides: {
        root: {
          background: 'white',
          color: 'white',
        },
      },
    },
    Drawer: {
      width: drawerWidth + 'px',
      fontSize: '12px',
      lineHeight: '24px',
      background: '#1d1b22',
      color: '#56525d',
    },
  },
  headerIcon: {
    width: '8em',
    fill: 'white',
    paddingRight: '4px',
  },
  sideBarIcons: {
    width: '2em',
    background: 'transparent',
    padding: '2px',
    margin: '4px',
    borderRadius: '4px',
    color: 'white',
  },
  typography: {
    h1: {
      fontSize: '5rem !important',

      fontFamily: 'Tahu',
    },
    h2: {
      fontSize: '3.5rem !important',
      fontFamily: 'Tahu',
    },
    h3: {
      fontSize: '2.5rem !important',
      fontFamily: 'Tahu',
    },
    p: {
      fontFamily: 'Tahu',
    },
  },
  palette: {
    background: {
      default: '#009900', //green
    },
    primary: {
      main: '#1976d2', //indigo
      text: '#56525d',
      light: '#1976d2',
      dark: '#1976d2',
    },
    secondary: {
      main: '#1976d2', //indigo
      text: '#1976d2',
      light: '#1976d2',
      dark: '#1976d2',
    },
    otherColors: {
      main: '#C3FC00',
    },
    error: {
      main: '#D72A2A', //red
    },
    warning: {
      main: '#FC7B09', //orange
    },
    info: {
      main: '#6B7D6A', //gray
    },
    success: {
      main: '#09FE00', //green
    },
    text: {
      primary: '#000000', //white
      secondary: 'black', //white
    },
    divider: '#EDF0F7',
  },
  boxRoot: {
    background: cardContentBackGround,
    color: 'white !important',
    borderRadius: cardBorderRadius,
    border: '0px solid #0B0A0D',
  },
  modal: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: contentBackGround,
    boxShadow: 24,
    p: 4,
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
  drawerContainer: {},
  actionButton: {
    backgroundColor: '#4158D0',
    backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
    color: 'white !important',
    fontWeight: '600 !important',
    padding: '10px 24px !important',
  },
  actionButton2: {
    backgroundColor: '#4158D0',
    backgroundImage: 'linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%)',
    color: 'white !important',
    fontWeight: '600 !important',
  },
  cardBackground: {
    background: contentBackGround,
    color: darkText + ' !important',
  },
  chip: {
    background: chipBackground,
    color: darkText + ' !important',
    borderRadius: '4px',
    marginRight: 8,
    padding: 8,
  },
});

export default theme;
