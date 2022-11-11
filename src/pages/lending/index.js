import { Typography, Grid, Box, Divider, Paper, Card, CardContent, CardHeader, Avatar, AppBar } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
//components
import RightDrawer from '../../Components/rightDrawer';
import SupplyTable from './tables';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { TokenContext } from '../../tokenFactory';
import { decimalToBigUints } from '../../utils/utils';
import { AttachMoney } from '@mui/icons-material';

const useStyles = makeStyles({
  root: {},
  boxRoot: theme.boxRoot,
  dividerRoot: {
    background: 'black',
  },
  lowMargin: {
    marginTop: '0px !important',
    marginBottom: '1px !important'
  },
  textMutedBold: theme.textMutedBold,
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down'
  },

  card: theme.card,
  avatar: {
    height: '20px  !important',
    width: '20px  !important',
  },
  avatar2: {
    height: '24px  !important',
    width: '24px  !important',
  },
  cardContent: theme.cardContent,
  walletConnect: theme.walletConnect,
  actionButton: theme.actionButton2
});

function Lending() {
  const classes = useStyles();

  const [currentMethod, setCurrentMethod] = React.useState('sellItem');
  const [currentRow, setCurrentRow] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [reload, setReload] = React.useState(false);
  const [currentMarket, setCurrentMarket] = React.useState([]);
  const { TokenAggregators, Tokens } = React.useContext(TokenContext);

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
    if (Tokens && Tokens.length && TokenAggregators.length) {
      const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
      const aggregators = TokenAggregators.map((aggtoken) => {
        const currentToken = Tokens.find(token => aggtoken.tokenAddress === token.address)
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
  }

  React.useEffect(() => {
    if (!drawerOpen) {
      getAllMarketDetails();

    }
  }, [signer, provider, drawerOpen, Tokens, TokenAggregators])

  return (
    <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={2} >

      <Grid item xs={12} sm={12} md={6} >
        <Card className={classes.card}>
          <CardHeader
            sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}

            title={
              <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" >

                My account</Typography>}

          />
          <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
            <Typography sx={{ fontSize: 14, width: '100%', fontWeight: 500, color: theme.lightText, textAlign: 'left' }} variant="p" >
              Net Apy
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>

              <p style={{ fontSize: '33px', color: theme.greenColor, fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>

                {currentRow?.balanceOf || 0.0} %</p>

            </div>

            <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '40px' }}>

              <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }} >

                <div >
                  <Typography sx={{ color: theme.lightText }} variant="p" >
                    Daily earnings
                  </Typography>
                </div>
                <div>
                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    ${currentRow?.apy || 0.0}
                  </span>
                </div>

              </Grid>

              <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }} >
                <Typography sx={{ color: theme.lightText }} variant="p" >
                  Supply balance
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    ${currentRow?.b || 0.0}
                  </span>
                </div>

              </Grid>

              <Grid item xs={4} sm={4} md={4} >
                <Typography sx={{ color: theme.lightText }} variant="p" >
                  Borrow balance
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    {currentRow?.totalSupply || 0.0}
                  </span>
                </div>

              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Grid>



      <Grid item xs={12} sm={12} md={6} >
        <Card className={classes.card} sx={{ height: '100%' }}>
          <CardHeader
            sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}

            title={
              <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" >
                &nbsp;
              </Typography>}

          />
          <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
            <Typography sx={{ fontSize: 14, width: '100%', fontWeight: 500, color: theme.lightText, textAlign: 'left' }} variant="p" >
              &nbsp;
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>

              <p style={{ fontSize: '33px', color: theme.greenColor, fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>
                &nbsp;

              </p>

            </div>

            <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '40px' }}>

              <Grid item xs={4} sm={4} md={4} style={{}} >

                <div >
                  <Typography sx={{ color: theme.lightText }} variant="p" >
                    {/* Daily earnings */}
                  </Typography>
                </div>
                <div>
                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    {/* ${currentRow?.apy||0.0}  */}
                  </span>
                </div>

              </Grid>

              <Grid item xs={4} sm={4} md={4} style={{}} >
                <Typography sx={{ color: theme.lightText }} variant="p" >
                  {/* Supply balance */}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    {/* ${currentRow?.b || 0.0} */}
                  </span>
                </div>

              </Grid>

              <Grid item xs={4} sm={4} md={4} >
                <Typography sx={{ color: theme.lightText }} variant="p" >
                  {/* Borrow balance */}
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>

                  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                    {/* {currentRow?.totalSupply || 0.0} */}
                  </span>
                </div>

              </Grid>
            </Grid>

          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} sm={12} md={12}>

        <SupplyTable action={OpenDrawer} reload={reload} component="SupplyItem" />
      </Grid>
      {drawerOpen && (
        <RightDrawer Opration={currentMethod === 'SupplyItem' ? 'Supply' : 'Borrow'} component={currentMethod} currentRow={currentRow} icon={currentRow?.icon} title={currentRow?.name} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      )}
    </Grid>

  );
}

export default Lending;
