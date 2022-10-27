// lib imports
import { useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, Box, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { NavLink } from 'react-router-dom';
import { KingBed, MeetingRoom, StarBorderOutlined, ViewList, AccountCircle, AccessibleForwardIcon, Pix } from '@mui/icons-material';

import landingIcon from '../../assets/svg/1.svg';
import stakingIcon from '../../assets/svg/2.svg';
import governanceIcon from '../../assets/svg/3.svg';
import bridgeIcon from '../../assets/svg/4.svg';
import sIcon from '../../assets/svg/5.svg';


//constants
import { routes } from '../../routes';
import theme from './../../theme';
import {Icons} from './../../icons';

const drawerWidth = theme.drawerWidth+'px';
const useStyles = makeStyles({

  drawer: {
    width: drawerWidth,
    zIndex: theme.drawerIndex,

    flexShrink: 0,
  },
  drawerPaper: {
    backgroundColor: theme.DrawerBackground,
    color: theme.DrawerText,
  },
  content: {
    overflowX: 'hidden'
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
  linkClass: {
    textDecoration: 'none',
    padding: '12px 8px 8px 24px',
    color: '#b4bccb !important',
    fontWeight: 'bold !important',
    display: 'block',
    alignItems: 'center',
    fontSize: '.875rem',
    lineHeight: '1rem',
    letterSpacing: '.0125em',
  },
  linkClassActive: {
    background: '#383944 !important',
    borderLeft:'4px solid blue !important',
    color: 'white  !important',
    fontWeight: 600,
  },
  linkItem: {
    padding: '0px !important'
  },
  linkText: {
    fontWeight: 600,
  },
  sideToolbar: {
    color: theme.SideHeaderText,
    background: theme.SideHeaderBackground,
    fontWeight: 600,
  },
  listItemIcon: {
    minWidth: '35px !important'
  },
  sideBarIcons: theme.sideBarIcons,
  headerIcon:theme.headerIcon,
  divider: {
    borderColor: theme.palette.divider + ' !important'
  }
});

export default function Home(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  //  props.mobileOpen=!mobileOpen
  const handleDrawerToggle = () => {
    props.setMobileOpen(!props.mobileOpen)
  };

  // useEffect(() => {
  //   props.setMobileOpen(!props.mobileOpen)
  // },[props.mobileOpen])
  const open = Boolean(anchorEl);

  const drawer = (
    <div>
      <Toolbar variant="dense" sx={{ height: theme.sideHeaderHeight }} className={classes.sideToolbar}>
        <img className={classes.headerIcon} src={Icons.flutewhite1} alt=""></img>
        {/* <Pix color="primary"  ></Pix> */}
      </Toolbar>
      <div className={classes.content}>
        <List  onClick={()=>{handleDrawerToggle()}}>
          <NavLink className={classes.linkClass}  to={routes.lending} activeClassName={classes.linkClassActive}>
            <ListItem button key={routes.lending} className={classes.linkItem}>
              <img className={classes.sideBarIcons} src={landingIcon} alt=''></img>
              <ListItemText primary="Lending" className={classes.linkText} />
            </ListItem>
          </NavLink>
          <NavLink className={classes.linkClass} to={routes.staking} activeClassName={classes.linkClassActive}>
            <ListItem button key={routes.staking} className={classes.linkItem}>
              <img className={classes.sideBarIcons} src={stakingIcon} alt=''></img>

              <ListItemText primary="Staking" />
            </ListItem>
          </NavLink>
          <NavLink className={classes.linkClass} to="/bridge" activeClassName={classes.linkClassActive}>
            <ListItem button key="BlockchainBridge" className={classes.linkItem}>

              <img className={classes.sideBarIcons} src={bridgeIcon} alt=''></img>
              <ListItemText primary="Bridge" className={classes.linkText} />
            </ListItem>
          </NavLink>
          <NavLink className={classes.linkClass} to="/governance" activeClassName={classes.linkClassActive}>
            <ListItem button key="Governance" className={classes.linkItem} >

              <img className={classes.sideBarIcons} src={governanceIcon} alt=''></img>
              <ListItemText primary="Governance" className={classes.linkText} />
            </ListItem>
          </NavLink>
        </List>
      </div>

    </div>
  );
  return (
    <>
      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="mailbox folders">
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="temporary"
          open={props.mobileOpen}
          onClose={handleDrawerToggle}
          sx={{
            display: { xs: 'block', sm: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          className={classes.drawer}
          classes={{
            paper: classes.drawerPaper,
          }}
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
    </>

  );
}
