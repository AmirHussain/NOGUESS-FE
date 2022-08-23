// lib imports
import {useEffect,useState} from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, Box, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { NavLink } from 'react-router-dom';
import { KingBed, MeetingRoom, StarBorderOutlined, ViewList, AccountCircle, AccessibleForwardIcon ,Pix} from '@mui/icons-material';




//constants
import { routes } from '../../routes';
import theme from './../../theme';

const drawerWidth = 240;
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
   margin: '0 auto',
    padding:' 1.125rem 1.125rem 1px',
    overflowX: 'hidden'
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
  linkClass: {
    textDecoration: 'none',
    padding: '2px',
    color: '#b4bccb !important',
    fontWeight: 'bold !important',
    display: 'block',
    alignItems: 'center',
    fontSize: '.875rem',
    lineHeight: '1.25rem',
    letterSpacing: '.0125em',
    borderRadius: '0.25rem',
  },
  linkClassActive: {
    background: '#21252f !important',
    color: 'white  !important',
    fontWeight: 600,
  },
  linkItem: {
    padding: '4px !important'
  },
  linkText:{
    fontWeight:600,
  },
  sideToolbar: {
    color: theme.SideHeaderText,
    background: theme.SideHeaderBackground,
    fontWeight: 600,
  },
  listItemIcon:{
    minWidth: '35px !important'
  },
  divider:{
    borderColor:theme.palette.divider +' !important'  }
});

export default function Home (props) {
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
      <Toolbar variant="dense" sx={{ height: theme.headerHeight }} className={classes.sideToolbar}>
        <Pix color="primary" sx={{ fontSize: "40px" }} ></Pix>
        <Typography variant="h5">D Finance</Typography>
      </Toolbar>
      <div className={classes.content}>
      <List>
        <NavLink className={classes.linkClass} to="/market" activeClassName={classes.linkClassActive}>
          <ListItem button key="Home" className={classes.linkItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <StarBorderOutlined color="primary"> : </StarBorderOutlined>
            </ListItemIcon>
            <ListItemText primary="Home" className={classes.linkText}/>
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to={routes.lending} activeClassName={classes.linkClassActive}>
          <ListItem button key={routes.lending} className={classes.linkItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <StarBorderOutlined color="primary" />
            </ListItemIcon>
            <ListItemText primary="Lending"  className={classes.linkText}/>
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to={routes.staking} activeClassName={classes.linkClassActive}>
          <ListItem button key={routes.staking} className={classes.linkItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <StarBorderOutlined color="primary" />
            </ListItemIcon>
            <ListItemText primary="Staking" />
          </ListItem>
        </NavLink>

        <NavLink className={classes.linkClass} to="/bridge" activeClassName={classes.linkClassActive}>
          <ListItem button key="BlockchainBridge" className={classes.linkItem}>
            <ListItemIcon className={classes.listItemIcon}>
              <KingBed color="primary"> : </KingBed>
            </ListItemIcon>
            <ListItemText primary="Bridge"  className={classes.linkText}/>
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to="/governance" activeClassName={classes.linkClassActive}>
          <ListItem button key="Governance" className={classes.linkItem} >
            <ListItemIcon className={classes.listItemIcon}>
              <MeetingRoom color="primary"> : </MeetingRoom>
            </ListItemIcon>
            <ListItemText primary="Governance"  className={classes.linkText}/>
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
