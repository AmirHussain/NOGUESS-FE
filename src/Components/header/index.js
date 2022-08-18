import React from 'react';
import { makeStyles } from '@mui/styles';
import { AppBar, Toolbar, IconButton, Menu, MenuItem, Button, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import { AccountCircle } from '@mui/icons-material';
import WalletConnecter from '../walletConnect/walletConnect'

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
  },
  appBar: {
    zIndex: theme.drawerIndex + 1,
    background: '#1D1B22 !important',
    color: 'white !important',
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
    background: '#3a383f',
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
    background: '#3A383F',
    color: 'white',
    fontWeight: 400,
  },
  sideToolbar: {
    color: 'white',
    fontWeight: 500,
  },
});

function Header() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  let auth = true;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
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
            <MenuRoundedIcon />
          </IconButton>

          <Typography variant="h6" className={classes.title}>
            D Finance
          </Typography>
          <div><WalletConnecter /></div>
        </Toolbar>
      </AppBar>
    </>
  );
}

export default Header;
