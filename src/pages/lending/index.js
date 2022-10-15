import { Typography, Stack, Grid, Box, Divider, Paper } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
//components
import RightDrawer from '../../Components/rightDrawer';
import SupplyTable from './table/lendingTable';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { TokenAggregators, Tokens } from '../../token-icons';
import { bigToDecimal, bigToDecimalUints, decimalToBigUints } from '../../utils/utils';
import { AttachMoney } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {},
  boxRoot: {

    // background: '#0b0a0d',
    color: '#56525d !important',
    borderRadius: 8,
    border: "2px solid #0B0A0D"
  },
  dividerRoot: {
    background: '#808080',
  },
  lowMargin: {
    marginTop: '0px !important',
    marginBottom: '1px !important'
  },
  textMutedBold: theme.textMutedBold
});

function Lending() {
  const classes = useStyles();

  const [currentMethod, setCurrentMethod] = React.useState('sellItem');
  const [currentRow, setCurrentRow] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [currentMarket, setCurrentMarket] = React.useState([]);
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const toggleDrawer = (reload = false) => {
    setDrawerOpen(!drawerOpen);
    setReload(reload);
  };
  const OpenDrawer = (row, method) => {
    toggleDrawer();
    setCurrentRow(row);

    setCurrentMethod(method);
  }

  const getAllMarketDetails = async () => {
   
    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer||provider);
    const TokenKeysAndAddresses = Object.keys(Tokens).map(key => {
      return { symbol: Tokens[key].symbol, address: Tokens[key].address }
    })
    const aggregators = TokenAggregators.map((aggtoken) => {
      const currentToken = TokenKeysAndAddresses.find(token => aggtoken.tokenSymbol === token.symbol)
      if (currentToken) {
        return {
          aggregator: aggtoken.aggregator, tokenAddress: currentToken.address, decimal: decimalToBigUints(aggtoken.decimals.toString(), aggtoken.decimals > 9 ? 0 : 0)
        }

      }
    });
    const data = await lendingContract.getCurrentLiquidity(
      aggregators
    );
    setCurrentMarket({
      totalSupply: Number(data[0]),
      totalDebt: Number(data[1]),
      totalVariableDebt: Number(data[3]),
      totalStableDebt: Number(data[2])
    })
  }

  React.useEffect(() => {
    if (!drawerOpen) {
      getAllMarketDetails();

    }
  }, [signer,provider, drawerOpen])

  return (
    <>
      <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={0} style={{ width: '100%' }}>

        <Grid item xs={12} sm={12} md={12} style={{ marginBottom: '10px' }}>

          <Box elevation={3} className={classes.boxRoot} p={5} style={{ background: "#ffffff" }}>
            <Typography varient="h3" sx={{ textAlign: 'start', marginBottom: '5px !important', fontWeight: 600 }}>
              Liquidity Overview
            </Typography>
            <Grid container spacing={1} style={{ width: '100%', }}>
              <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'left', borderRight: '1px solid grey', }}>
                <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                  Supply
                </h4>
                <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                  <AttachMoney></AttachMoney>  {currentMarket.totalSupply || 0}
                </h3>
              </Grid>
              <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <div>
                    <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                      Borrowed
                    </h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      <AttachMoney></AttachMoney>  {currentMarket.totalDebt || 0}
                    </h3>
                  </div>
                  <div>
                    <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                      On Variable Rate
                    </h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      <AttachMoney></AttachMoney>  {currentMarket.totalVariableDebt || 0}
                    </h3>
                    <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                      On Stable Rate
                    </h4>
                    <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                      <AttachMoney></AttachMoney>  {currentMarket.totalStableDebt || 0}
                    </h3>
                  </div>
                </div>

              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={12}>
          <div>
            <SupplyTable action={OpenDrawer} reload={reload} component="SupplyItem" />
          </div>
        </Grid>

      </Grid>
      {drawerOpen && (
        <RightDrawer Opration={currentMethod === 'SupplyItem' ? 'Supply' : 'Borrow'} component={currentMethod} currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      )}
    </>
  );
}

export default Lending;
