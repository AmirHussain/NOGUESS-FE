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
  FormGroup,
  FormHelperText,
} from '@mui/material';
import { makeStyles } from '@mui/styles';
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { NUOGUESSAlertContext } from '../../../Components/Alert';
import { abis, makeContract } from '../../../contracts/useContracts';
import { decimalToBig } from '../../../utils/utils';
import { debounce } from 'lodash';

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

export default function StakeItem(params) {
  console.log(params);
  const currentStake = params.input.currentStake;
  const classes = useStyles();

  const { connectWallet, signer, account } = useContext(Web3ProviderContext);
  const { setAlert } = useContext(NUOGUESSAlertContext);

  const [inProgress, setInProgress] = useState(false);
  const [amount, setAmount] = useState('0.00');
  const handleAmountChange = (input) => {
    if (input) {
      setAmount(input);
    }
    setAmount(input);
  };
  React.useEffect(() => {
    if (params.input && params.input.currentStake.min_deposit) {
      setAmount(currentStake.min_deposit);
    }
  }, [params]);
  const startStaking = async () => {
    let index;
    try {
      setInProgress(true);
      const stakingContract = makeContract(currentStake.staking_contract_address, abis.staking, signer);
      const signerAddress = signer.address || (await signer.getAddress());

      const weth = makeContract(currentStake.staking_token.token_address, abis.WETH, signer);
      index = setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
      const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
      setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully', txHash: wethResult.hash }, index);
      setAlert({ severity: 'info', title: 'Staking', description: 'Staking in progress' }, index);
      const result = await stakingContract.Deposit(signerAddress, decimalToBig(amount), currentStake.stakeFromPool, false, decimalToBig('0'), { gasLimit: 1048748 });
      setAlert({ severity: 'info', title: 'Staking', description: 'Staking in progress', txHash: result.hash }, index);

      await result.wait(1);
      setAlert({ severity: 'success', title: 'Staking', description: 'Staking completed successfully', txHash: result.hash }, index);
      setInProgress(false);
      params?.input?.toggleDrawer(true);
    } catch (err) {
      setAlert({ severity: 'error', title: 'Staking', error: err }, index);
      setInProgress(false);
      params?.input?.toggleDrawer(false);
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
        <div className={classes.sectionHeading}>Summary</div>
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
            {' '}
            <span>APR IN REWARD:</span> <span>{currentStake.apy} % </span>
          </div>
          <div className="d-flexSpaceBetween">
            {' '}
            <span>STAKING CYCLE</span> <span>{currentStake.staking_duration} Month(s)</span>
          </div>
          <div className="d-flexSpaceBetween">
            {' '}
            <span>START TIME:</span>
            <span>{currentStake.staking_start_time}</span>
          </div>
          <div className="d-flexSpaceBetween">
            {' '}
            <span>YOUR BALANCE</span>
            <span>{currentStake.b}</span>
          </div>
        </Card>
        <div className={classes.sectionHeading}>Summary</div>
        <Card
          key="form"
          className={classes.innerCard}
          sx={{
            background: theme.TabsBackground,
            color: theme.lightText + ' !important',
            marginBottom: '20px',
            display: 'block !important',
            padding: '10px',
            paddingTop: '15px',
          }}
        >
          {' '}
          <FormGroup component="fieldset" variant="standard">
            <Input
              sx={{
                color: theme.lightText + ' !important',
                padding: '6px',
                width: '100%',
              }}
              inputProps={{ min: Number(currentStake.min_deposit), max: Number(currentStake.max_deposit) }}
              id="input-with-icon-adornment"
              value={amount}
              disabled={currentStake.stakeFromPool}
              type="number"
              onChange={(e) => handleAmountChange(e.target.value)}
              startAdornment={
                <Avatar
                  key="rightDrawerAvatar"
                  aria-label="Recipe"
                  className={classes.avatar}
                  sx={{
                    marginRight: '10px',
                    margin: '4px',
                    width: '27px',
                    height: '27px',
                  }}
                >
                  <img className="chainIcon" alt="" src={currentStake?.token?.icon} />
                </Avatar>
              }
            />
          </FormGroup>
        </Card>
        <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
          <Button sx={{ width: '100%', borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={startStaking}>
            Stake Now
          </Button>
        </div>
      </Box>
    </React.Fragment>
  );
}
