import React from 'react';
import { useHistory } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Typography, Divider, ListItem, ListItemIcon, ListItemText, Avatar } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { AccountCircle, ArrowBack } from '@mui/icons-material';
import WalletConnecter from '../walletConnect/walletConnect'
import { routeHeaders } from '../../routes';

import theme from './../../theme';
import ConnectWallet from '../walletConnect/login';
import { TokenContext } from '../../tokenFactory';


const drawerWidth = theme.drawerWidth;
const useStyles = makeStyles({
  root: {
    display: 'flex',
    height: theme.headerHeight,
    minHeight: theme.headerHeight,
  },
  menuButton: {
    marginRight: theme.spacing,
  },
  title: {
    flexGrow: 1,
    textAlign: 'left',
    paddingLeft: '10px',
    color: theme.headerText,
    fontSize: '18px',
    fontWeight: 600
  },
  appBar: {
    zIndex: theme.drawerIndex + 1,
    background: theme.headerBackground,
    boxShadow: 'none !important',
    color: theme.headerText,
    fontStyle: 'bold',
  },

  sideBarToolBar: {
    zIndex: theme.drawerIndex + 1,
    background: theme.SideHeaderBackground,
    color: theme.SideHeaderText,
    fontStyle: 'bold',
  },
  drawer: {
    width: drawerWidth,
    zIndex: theme.drawerIndex,

    flexShrink: 0,
  },
  drawerPaper: {
    background: '#0b0a0d !important',
    color: '#56525d !important',
  },
  drawerContainer: {},
  content: {
    background: '#FFFFFF',
    color: 'white',
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
  linkClass: {
    textDecoration: 'none',
    padding: '6px 23px 6px 14px',
    color: theme.palette.primary.text,
    fontWeight: 'bold',
    margin: '6px 6px 6px 0px',
    display: 'block',
  },
  linkClassActive: {
    background: '#EDF0F7',
    color: 'white',
    fontWeight: 400,
  },
  sideToolbar: {
    color: 'white',
    fontWeight: 500,
  },
  divider: {
    borderColor: theme.palette.divider + ' !important'
  },
  sideBarIcons: theme.sideBarIcons
});

function Header(props) {
  let history = useHistory();
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  let location = useLocation();
  const { headerText, setHeaderText } = React.useContext(TokenContext);

  const [ back, setBack ] = React.useState(false);
  React.useEffect(() => { }, [headerText])
  React.useEffect(() => {
    const Locations = location.pathname.split('/');
    setHeaderText(routeHeaders['/' + Locations[1]]?.name)
    setBack(routeHeaders['/' + Locations[1]]?.showBackBotton)
  }, [location, routeHeaders]);

  let auth = true;
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    props.setMobileOpen(!props.mobileOpen)
    // props.mobileOpen1=!mobileOpen
  };

const moveBack=()=>{
  history.goBack();
}

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
        color="primary"
        sx={{ width: { md: `calc(100% - ${drawerWidth}px)` }, ml: { sm: `${drawerWidth}px` } }}
      >
        <Toolbar variant="dense" sx={{ height: theme.headerHeight }}>
          <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuRoundedIcon color="primary" />
          </IconButton>
          {back && (<ArrowBack sx={{ mr: 2 ,cursor:'pointer'}} onClick={moveBack}></ArrowBack>
          )}
          <Typography variant="div" sx={{}} className={classes.title}> {headerText}</Typography>
          <div><ConnectWallet /></div>
        </Toolbar>
        {/* <Divider className={classes.divider}></Divider> */}
      </AppBar>
    </>
  );
}

export default Header;
