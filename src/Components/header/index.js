import React from 'react';
import {useLocation} from 'react-router-dom';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { AccountCircle } from '@mui/icons-material';
import WalletConnecter from '../walletConnect/walletConnect'
import { routeHeaders } from '../../routes';
import theme from './../../theme';

const drawerWidth = 240;
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
    color:theme.darkBlueText,
    fontWeight:600
  },
  appBar: {
    zIndex: theme.drawerIndex + 1,
    background: theme.headerBackground,
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
  divider:{
borderColor:theme.palette.divider +' !important'
  }
});

function Header(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [headerText, setHeader] = React.useState(null);
  let location = useLocation();

  // React.useEffect(() => {
  //   setHeader(location)
  // }, [location]);

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

  return (
    <>
      <AppBar
        position="fixed"
        className={classes.appBar}
        color="primary"
        sx={{width: { md: `calc(100% - ${drawerWidth}px)` },ml: { sm: `${drawerWidth}px` }}}
      >
        <Toolbar variant="dense" sx={{ height: theme.headerHeight }}>
          <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuRoundedIcon color="primary"/>
          </IconButton>
          <Typography variant="div" sx={{textTransform:'upperCase'}} className={classes.title}> {routeHeaders[location.pathname].name}</Typography>
          <div><WalletConnecter /></div>
        </Toolbar>
        {/* <Divider className={classes.divider}></Divider> */}
      </AppBar>
    </>
  );
}

export default Header;
