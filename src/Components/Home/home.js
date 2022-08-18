// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Drawer, AppBar, CssBaseline, Box, Toolbar, List, IconButton, Menu, MenuItem, Button, Typography, Divider, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';

import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';
import { KingBed, MeetingRoom, RoomSharp, StarBorderOutlined, ViewList, AccountCircle, AccessibleForwardIcon } from '@mui/icons-material';

import { ThemeProvider } from '@mui/styles';
//components
import Market from './Market/market';
import Bridge from './Bridge/Bridge';
import Governance from './Governance/Governance';
import Categories from '../Categories/categories';

//constants
import { routes } from '../../routes';
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

export default function Home() {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const classes = useStyles();
  let auth = true;

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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

      {/* <Divider />
            <List>
                <ListItem button key="Managoms">
                    <ListItemIcon>
                        <RoomSharp> : </RoomSharp>
                    </ListItemIcon>
                    <ListItemText primary="Manage Rooms" />
                </ListItem>
                <ListItem button key="AllDevices">
                    <ListItemIcon><ViewList> : </ViewList>
                    </ListItemIcon>
                    <ListItemText primary="All Devices" />
                </ListItem>
            </List> */}
    </div>
  );
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Box sx={{ display: 'flex' }}>
          <CssBaseline />
          <AppBar
            position="fixed"
            className={classes.appBar}
            color="primary"
            sx={{
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { sm: `${drawerWidth}px` },
            }}
          >
            <Toolbar variant="dense" sx={{ height: theme.headerHeight }}>
              <IconButton aria-label="open drawer" edge="start" onClick={handleDrawerToggle} sx={{ mr: 2, display: { md: 'none' } }}>
                <MenuRoundedIcon />
              </IconButton>

              <Typography variant="h6" className={classes.title}>
                D Finance
              </Typography>
              {auth && (
                <div>
                  <Button id="basic-button" aria-controls="basic-menu" aria-haspopup="true" aria-expanded={open ? 'true' : undefined} onClick={handleClick}>
                    <AccountCircle></AccountCircle>
                  </Button>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={handleClose}>Profile</MenuItem>
                    <MenuItem onClick={handleClose}>My account</MenuItem>
                  </Menu>
                </div>
              )}
            </Toolbar>
          </AppBar>
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
          <Box
            component="main"
            sx={{
              flexGrow: 1,
              p: 3,
              width: { sm: `calc(100% - ${drawerWidth}px)` },
            }}
            className={classes.content}
          >
            <Switch>
              <Route path="/bridge" exact component={Bridge}></Route>
              <Route path="/market" exact component={Market}></Route>
              <Route path="/governance" exact component={Governance}></Route>
              <Route path="/" exact component={Market}></Route>
              <Route path="/category/:id" component={Categories}></Route>
            </Switch>
          </Box>
        </Box>
      </Router>
    </ThemeProvider>
  );
}
