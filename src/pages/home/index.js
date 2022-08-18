// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box,} from '@mui/material';

import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';

//components
import Governance from '../governance';
import Bridge from '../bridge';
import Market from '../market';

import Header from "../../Components/header"
import Sidebar from "../../Components/sidebar"



//constants
import { routes } from '../../routes';
import theme from './../../theme';

const drawerWidth = 240;
const useStyles = makeStyles({
  content: {
    background: '#3a383f',
    color: 'white',
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
});

export default function Home() {
  const classes = useStyles();
  
  return (
      <Router>
        <Box sx={{ display: 'flex' }}>
          <Header/>
          <Sidebar/>
          

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
            </Switch>
          </Box>
        </Box>
      </Router>
  );
}