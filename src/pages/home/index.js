// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Container } from '@mui/material';

import { BrowserRouter as Router, Switch, Route, Link, NavLink } from 'react-router-dom';

//components
import Governance from '../governance';
import Bridge from '../bridge';
import Market from '../market';
import Staking from '../staking';
import Lending from '../../pages/lending';

import Header from '../../Components/header';
import Sidebar from '../../Components/sidebar';

//constants
import { routes } from '../../routes';
import theme from './../../theme';
import Asset from '../../Components/asset';
import Proposal from '../governance/proposal';
import Admin from '../Admin';
import ComingSoon from '../commingSoon';

const drawerWidth = theme.drawerWidth;
const useStyles = makeStyles({
  content: {
    color: theme.darkText,
    background: theme.backgroundImage,
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
});

export default function Home() {
  const classes = useStyles();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Router>
      <Box sx={{ display: 'flex' }}>
        <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleDrawerToggle={handleDrawerToggle} />
        <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} handleDrawerToggle={handleDrawerToggle} />

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            width: { xs: '100%', md: `calc(100% - ${drawerWidth}px)` },
            height: `calc(100% - ${theme.headerHeight})`,
            display: 'block',
            position: 'absolute',
            right: '0px',
          }}
          className={classes.content + ' scrollbar-hover'}
        >
          <Container sx={{ paddingRight: { xs: '0px !important', md: '16px !important' }, paddingLeft: { xs: '0px !important', md: '16px !important' } }}>
            <Switch>
              <Route path="/bridge" exact component={ComingSoon}></Route>
              <Route path="/staking" exact component={ComingSoon}></Route>
              <Route path="/market" exact component={Market}></Route>
              <Route path="/governance" exact component={Governance}></Route>
              <Route path="/lending" exact component={Lending}></Route>
              <Route path="/admin" exact component={Admin}></Route>
              <Route path="/asset/:address" component={Asset} />
              <Route path="/proposal/:id/:address" component={Proposal} />
              <Route path="**" exact component={Lending}></Route>
            </Switch>
          </Container>
        </Box>
      </Box>
    </Router>
  );
}
