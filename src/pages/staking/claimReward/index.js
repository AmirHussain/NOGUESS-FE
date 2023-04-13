import React, { useContext, useState } from 'react';
import {
  Grid,
  Box,
  Card,
  Typography,
  Switch,
  TableContainer,
  Table,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  IconButton,
  Toolbar,
  Modal,
  Fade,
  DialogActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  TextField,
  SwipeableDrawer,
  Skeleton,
  AppBar,
  Avatar,
  Input,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { vernofxAlertContext } from '../../../Components/Alert';
import { abis, makeContract } from '../../../contracts/useContracts';
import { decimalToBig } from '../../../utils/utils';
const useStyles = makeStyles({
  rightBar: {
    zIndex: theme.drawerIndex + 1,
    background: theme.headerBackground,
    color: theme.headerText,
    fontStyle: 'bold',
  },

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
  drawer: theme.drawer,
  drawerPaper: theme.rightDrawerPaper,
  textBold: theme.textBold,
});

export default function ClaimItem(params) {
  console.log(params);
  const currentStake = params.input.currentStake;
  const classes = useStyles();

  const { connectWallet, signer, account } = useContext(Web3ProviderContext);
  const { setAlert } = useContext(vernofxAlertContext);

  const [inProgress, setInProgress] = useState(false);
  const [amount, setAmount] = useState('0.00');

  const claimReward = async (addToPool = false) => {
    let index;
    try {
      setInProgress(true);
      const stakingContract = makeContract(currentStake.staking_contract_address, abis.staking, signer);
      // const weth = makeContract(currentStake.staking_token.token_address, abis.WETH, signer);
      // setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
      // const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
      // setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });
      index = setAlert({ severity: 'info', title: 'Payout', description: 'Payout in progress' });
      const result = await stakingContract.Payout(addToPool, { gasLimit: 1000000 });
      setAlert({ severity: 'info', title: 'Payout', description: 'Payout in progress', txHash: result.hash }, index);

      await result.wait(1);
      setAlert({ severity: 'success', title: 'Payout', description: 'Payout amount successfully' }, index);
      setInProgress(false);
    } catch (err) {
      setAlert({ severity: 'error', title: 'Claim', error: err }, index);
      setInProgress(false);
    }
  };

  return (
    <React.Fragment key="RIGHTContent">
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          height: { xs: theme.modalXsMidContainerHeight, md: 'auto' },
          maxHeight: { xs: theme.modalXsMidContainerMaxHeight, md: theme.modalMdMidContainerMaxHeight },
          minWidth: { xs: '100%', md: '30vw' },
          display: 'block',
          right: '0px',
          overflow: 'auto',
        }}
        className={classes.content}
      >
        <Card
          className={classes.innerCard}
          sx={{
            background: theme.TabsBackground,
            color: theme.lightText + ' !important',
            display: 'block !important',
            padding: '10px',
            fontSize: '11px',
            fontStretch: 'semi-expanded',
          }}
        >
          <div className="d-flexSpaceBetween">
            <div style={{ fontSize: '18px' }}>Supply to pool and earn</div>

            <span>
              <span style={{ color: theme.lightText, fontSize: '25px', fontWeight: 600, textAlign: 'left', paddingBottom: '5px', margin: '0px', lineHeight: 1 }}>
                {parseFloat(currentStake.num_of_days === '7' ? (Number(currentStake.apy || 0) * 7) / 2 : Number(currentStake.apy || 0) / 2).toFixed(2)} %
              </span>
              <span style={{ color: theme.darkGoldText, fontSize: '25px', fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>
                {' '}
                {currentStake.num_of_days === '1'
                  ? ' Daily'
                  : currentStake.num_of_days === '7'
                  ? ' Weekly'
                  : ` DAILY, WITHDRAWAL IN ${Math.round(Number(currentStake.num_of_days || 0) / 30)} MONTHS`}
              </span>
            </span>
          </div>
        </Card>
        <div className={classes.sectionHeading}>Claim Now:</div>
        <Card
          className={classes.innerCard}
          sx={{
            background: theme.TabsBackground,
            color: theme.lightText + ' !important',
            display: 'block !important',
            padding: '10px',
            fontSize: '11px',
            fontStretch: 'semi-expanded',
          }}
        >
          <div className="d-flexSpaceBetween">
            <span>REWARD EARNED:</span>{' '}
            <span>
              <span style={{ color: theme.lightText, fontSize: '18px', fontWeight: 600, textAlign: 'left', paddingBottom: '5px', margin: '0px', lineHeight: 1 }}>
                {parseFloat(currentStake.num_of_days === '7' ? Number(currentStake.apy || 0) * 7 : Number(currentStake.apy || 0)).toFixed(2)} %
              </span>
              <span style={{ color: theme.darkGoldText, fontSize: '18px', fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>
                {currentStake.num_of_days === '1'
                  ? ' Daily'
                  : currentStake.num_of_days === '7'
                  ? ' Weekly'
                  : ` DAILY, WITHDRAWAL IN ${Math.round(Number(currentStake.num_of_days || 0) / 30)} MONTHS`}
              </span>
            </span>
          </div>
          <div className="d-flexSpaceBetween">
            <span>REWARD</span>
            <span style={{ color: theme.darkGoldText, fontSize: '18px', fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>
              {parseFloat(Number(currentStake.b || 0)).toFixed(3)}
            </span>
          </div>
        </Card>

        <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
          <Grid container spacing={1} style={{ width: '100%', paddingTop: '20px' }}>
            <Grid item xs={6} sm={6} md={6}>
              <Button sx={{ width: '100%', borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => claimReward(true)}>
                Supply to pool
              </Button>
            </Grid>
            <Grid item xs={6} sm={6} md={6}>
              <Button sx={{ width: '100%', borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => claimReward()}>
                Claim Now
              </Button>
            </Grid>
          </Grid>
        </div>
      </Box>
    </React.Fragment>
  );
}
