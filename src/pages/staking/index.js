import React from 'react';
import { Grid, Box, Card, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import RightDrawer from '../../Components/rightDrawer';
import StakingList from './stakingList';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { bigToDecimal } from '../../utils/utils';
import { TokenContext, TokenFactory } from '../../tokenFactory';
import { AttachMoney } from '@mui/icons-material';
const useStyles = makeStyles({
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down',
  },

  sideBar: {
    background: '#050506',
    color: 'white',
  },
  textHighlighted: theme.textHighlighted,
  sectionHeading: theme.sectionHeading,
  textBoldWhite: theme.textBoldWhite,
  textMuted: theme.textMuted,
  innerCard: theme.innerCard,
  modal: theme.modal,
  textBold: theme.textBold,
  boxRoot: theme.boxRoot,

  root: {},

  dividerRoot: {
    background: 'black',
  },
  lowMargin: {
    marginTop: '0px !important',
    marginBottom: '1px !important',
  },
});

export default function Staking() {
  const classes = useStyles();
  const { provider, signer } = React.useContext(Web3ProviderContext);
  const { StakingOptions, refreshData, setRefreshData } = React.useContext(TokenContext);
  const [stakingOptions, setStakingOptions] = React.useState([]);
  function setActive(value) {
    console.log(value);
    setStakingOptions(value ? StakingOptions : StakingOptions.filter((option) => option.isActive));
  }

  const [currentStake, setCurrentStake] = React.useState({});
  const [currentMarket, setCurrentMarket] = React.useState({});
  const [operation, setOperation] = React.useState('');

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
    if (drawerOpen) {
      setRefreshData(true);
      setTimeout(() => {
        setRefreshData(false);
      });
    }
  };

  const OpenDrawer = (row) => {
    toggleDrawer();
    setOperation('Staking');
    setCurrentStake(row);
  };
  const OpenClaimDrawer = (row) => {
    toggleDrawer();
    setOperation('Claim');
    setCurrentStake(row);
  };

  const setCurrentMarketDetails = async () => {
    const marketDetails = { invested: 0, reinvested: 0, withdrawn: 0, refunds: 0, supply_pool: 0, available_supply: 0 };

    for (var i = 0; i < stakingOptions.length; i++) {
      const opt = stakingOptions[i];
      const stakingContract = makeContract(opt.staking_contract_address, abis.staking, signer);
      const details = await stakingContract.getContractValues();
      marketDetails.invested += Number(bigToDecimal(details[0]));
      marketDetails.reinvested += Number(bigToDecimal(details[1]));
      marketDetails.withdrawn += Number(bigToDecimal(details[2]));
      marketDetails.refunds += Number(bigToDecimal(details[3]));
      marketDetails.supply_pool += Number(bigToDecimal(details[4]));
      marketDetails.available_supply += Number(bigToDecimal(details[5]));
    }
    console.log(marketDetails);
    setCurrentMarket(marketDetails);
  };
  React.useEffect(() => {
    setStakingOptions(StakingOptions.filter((opt) => opt.isActive === true));
  }, [StakingOptions]);

  React.useEffect(() => {
    setCurrentMarketDetails();
  }, [stakingOptions]);

  React.useEffect(() => {
    if (refreshData && stakingOptions && stakingOptions.length) {
      setCurrentMarketDetails();
    }
  }, [refreshData]);
  return (
    <Box>
      <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%', marginBottom: '10px' }}>
        <Grid item xs={12} sm={12} md={12} style={{ marginBottom: '10px' }}>
          <Box elevation={3} className={classes.boxRoot} p={5}>
            <Grid container spacing={1} style={{ width: '100%' }}>
              <Grid
                item
                xs={12}
                sm={6}
                md={6}
                sx={{
                  textAlign: 'left',
                  borderRight: {
                    xs: '0px solid ' + theme.borderColor,
                    sm: '0.5px solid ' + theme.borderColor,
                  },
                  borderBottom: {
                    xs: '0.5px solid ' + theme.borderColor,
                    sm: '0px solid ' + theme.borderColor,
                  },
                }}
              >
                <h4 className={classes.textBoldWhite + ' ' + classes.lowMargin}>BALANCE</h4>
                <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                  {parseFloat(Number(currentMarket?.invested || 0)).toFixed(3) || 0.0}
                </h3>
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h4 className={classes.textBoldWhite + ' ' + classes.lowMargin}>Reinvested</h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      {parseFloat(Number(currentMarket?.reinvested || 0)).toFixed(3) || 0}
                    </h3>
                  </div>
                  <div>
                    <h4 className={classes.textBoldWhite + ' ' + classes.lowMargin}>Withdrawn</h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      {parseFloat(Number(currentMarket?.withdrawn || 0)).toFixed(3) || 0}
                    </h3>
                    <h4 className={classes.textBoldWhite + ' ' + classes.lowMargin}>Available Supply</h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      {parseFloat(Number(currentMarket?.available_supply || 0)).toFixed(3) || 0}
                    </h3>
                  </div>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
      <div
        className=""
        sx={{
          alignItems: 'baseline',
          textAlign: 'right',
          marginTop: '10px',
          float: 'right',
        }}
      >
        <div className={classes.textBold} style={{ textAlign: 'right', float: 'right' }}>
          Show all Active + Inactive
          <Switch onChange={(e) => setActive(e.target.checked)}></Switch>
        </div>
      </div>
      <StakingList stakingOptions={stakingOptions} action={OpenDrawer} claimAction={OpenClaimDrawer} />
      {drawerOpen && (
        <RightDrawer
          Opration={operation}
          component="staking"
          currentStake={currentStake}
          icon={currentStake.icon}
          title={currentStake.name}
          toggleDrawer={toggleDrawer}
          drawerOpen={drawerOpen}
        />
      )}
    </Box>
  );
}
