// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, Box, Toolbar, List, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';

import { NavLink } from 'react-router-dom';
import { KingBed, MeetingRoom, StarBorderOutlined, ViewList, AccountCircle, AccessibleForwardIcon } from '@mui/icons-material';




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
    background: '#0b0a0d !important',
    color: '#56525d !important',
  },
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

export default function Home() {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const open = Boolean(anchorEl);

  const drawer = (
    <div>
      <Toolbar variant="dense" sx={{ height: theme.headerHeight }} className={classes.sideToolbar}>
        <Typography variant="h5">D Finance</Typography>
      </Toolbar>
      <Divider />
      <List>
        <NavLink className={classes.linkClass} to="/market" activeClassName={classes.linkClassActive}>
          <ListItem button key="Home">
            <ListItemIcon>
              <StarBorderOutlined color="primary"> : </StarBorderOutlined>
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to={routes.lending} activeClassName={classes.linkClassActive}>
          <ListItem button key={routes.lending}>
            <ListItemIcon>
              <StarBorderOutlined color="primary" />
            </ListItemIcon>
            <ListItemText primary="Lending" />
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to="/bridge" activeClassName={classes.linkClassActive}>
          <ListItem button key="BlockchainBridge">
            <ListItemIcon>
              <KingBed color="primary"> : </KingBed>
            </ListItemIcon>
            <ListItemText primary="Bridge" />
          </ListItem>
        </NavLink>
        <NavLink className={classes.linkClass} to="/governance" activeClassName={classes.linkClassActive}>
          <ListItem button key="Governance">
            <ListItemIcon>
              <MeetingRoom color="primary"> : </MeetingRoom>
            </ListItemIcon>
            <ListItemText primary="Governance" />
          </ListItem>
        </NavLink>
      </List>

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
            open={mobileOpen}
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
