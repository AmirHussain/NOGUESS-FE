// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Tab, Tabs } from '@mui/material';

//components
import theme from './../../theme';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AdminTokens from './tokens';
import AdminAggregators from './aggregators';
import AdminBorrowLimitations from './borrowLimitations';
import AdaptiveLimitations from './adptiveLimitations';
import AdminGovernance from './governance';
import AdminStakingOfferings from './stakingOfferings';
import { TokenContext } from '../../tokenFactory';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';

const useStyles = makeStyles({
  tabs: {
    '& .MuiButtonBase-root': {
      alignItems: 'start !important',
      maxWidth: '166px !important',
      borderRadius: '8px 0px 0px 8px',
      marginBottom: '12px',
      background: theme.SideHeaderBackground,
      '&.Mui-selected': {
        background: '#383944  !important',
      },
    },
  },
  tabPanel: {
    height: 'calc(100vh - 90px)',
    overflow: 'auto',
    background: '#383944  !important',
    padding: '20px !important',
    borderRadius: '0px 8px 8px 8px',
  },

  content: {
    color: theme.darkText,
    background: theme.contentBackGround,
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
});

export default function Admin() {
  const [value, setValue] = React.useState('1');
  const classes = useStyles();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const { owner } = React.useContext(TokenContext);
  const { account } = React.useContext(Web3ProviderContext);

  return owner === account ? (
    <Box sx={{ display: 'flex' }}>
      <AdminStakingOfferings />

      {/* <TabContext value={value} orientation="vertical">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={classes.tabs}>
          <TabList onChange={handleChange} orientation="vertical" indicatorColor="main" textColor="inherit" aria-label="lab API tabs example" centered>
            <Tab label="Tokens" value="1" />
            <Tab label="Aggregators" value="2" />
            <Tab label="Plans" value="3" />
            <Tab label="Adaptive Limitations" value="4" />
                        <Tab label="Governance" value="5" />
          </TabList>
        </Box>
        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="1">
          <AdminTokens />
        </TabPanel>

        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="3">
        </TabPanel>
        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="2">
          <AdminAggregators />
        </TabPanel>
        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="3">
          <AdminBorrowLimitations />
        </TabPanel>
        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="4">
          <AdaptiveLimitations />
        </TabPanel>
        <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100% - 166px)', xs: 'calc(100% - 166px)' } }} value="5">
          <AdminGovernance />
        </TabPanel>
      </TabContext> */}
    </Box>
  ) : (
    <div>You are not authorized for admin operations.</div>
  );
}
