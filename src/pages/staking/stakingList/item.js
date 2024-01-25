import React, { useContext, useState } from 'react';
import { Card, CardHeader, CardContent, Button, Typography, Grid, AppBar, Menu, MenuItem } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import { abis, makeContract } from '../../../contracts/useContracts';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { bigToDecimal, decimalToBig, decimalToBigUnits } from '../../../utils/utils';
import moment from 'moment';
import { NUOGUESSAlertContext } from '../../../Components/Alert';
import { ArrowDropDown } from '@mui/icons-material';
import { TokenContext } from '../../../tokenFactory';

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
  actionButton: theme.actionButton2,
});

export default function StakingItem(props) {
  const classes = useStyles();
  const { provider, signer } = React.useContext(Web3ProviderContext);

  const { setAlert } = useContext(NUOGUESSAlertContext);
  const { refreshData } = useContext(TokenContext);
  const [row, setRow] = useState({});
  const openDrawer = (row, stakeFromPool) => {
    row.token = { icon: row.staking_token?.token_image, address: row.staking_token?.token_address, symbol: row.staking_token?.token_symbol };

    props.openDrawer({ ...row, stakeFromPool });
  };
  const openClaimDrawer = (row) => {
    row.token = { icon: row.staking_token?.token_image, address: row.staking_token?.token_address, symbol: row.staking_token?.token_symbol };
    props.openClaimDrawer(row);
  };
  const [inProgress, setInProgress] = useState(false);

  const BrakeEven = async () => {
    let index;
    try {
      setInProgress(true);
      const stakingContract = makeContract(row.staking_contract_address, abis.staking, signer);
      const signerAddress = signer.address || (await signer.getAddress());

      // const weth = makeContract(row.staking_token.token_address, abis.WETH, signer);
      // setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
      // const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
      // setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });
      index = setAlert({ severity: 'info', title: 'Break Even', description: 'Break even in progress' });
      const result = await stakingContract.Deposit(signerAddress, decimalToBig('0'), false, true, decimalToBig(row.balanceOf.toString()), { gasLimit: 1048748 });
      setAlert({ severity: 'info', title: 'Break Even', description: 'Break even in progress', txHash: result.hash }, index);

      await result.wait(1);
      setAlert({ severity: 'success', title: 'Break Even', description: 'Break even successfully' }, index);
      setInProgress(false);
    } catch (err) {
      setAlert({ severity: 'error', title: 'Break Even', error: err }, index);
      setInProgress(false);
    }
  };

  const SetAndOpenAsset = (row) => {
    props.SetAndOpenAsset(row);
  };
  const getRemainingTime = (date) => {
    if (date > new Date()) {
      if (!isNaN(new Date(date))) {
        var now = new Date().getTime();
        var timeleft = new Date(date) - now;
        var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
        var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
        const remainingTime = (days ? days + 'd, ' : '') + hours + 'h : ' + minutes + 'm';
        return remainingTime;
      }
    }
  };
  async function setStakingOptionDetailsFromStakingContract() {
    if (provider) {
      console.log('row', props.row);
      console.log(signer);
      const stakingOfferingContract = makeContract(props.row?.staking_contract_address, abis.staking, signer);
      console.log(stakingOfferingContract);
      const updatedRow = {
        ...props.row,
        staking_duration: 0,
        invested: 0,
        b: 0,
        balanceOf: 0,
      };

      const duration = updatedRow.life_days;

      updatedRow.staking_duration = Math.round(moment.duration(Number(bigToDecimal(duration)), 'seconds').asMonths());
      const details = await stakingOfferingContract.getContractValues();
      updatedRow.invested = Number(bigToDecimal(details[0]));
      updatedRow.reinvested = Number(bigToDecimal(details[1]));
      updatedRow.withdrawn = Number(bigToDecimal(details[2]));
      updatedRow.refunds = Number(bigToDecimal(details[3]));
      updatedRow.supply_pool = Number(bigToDecimal(details[4]));
      updatedRow.available_supply = Number(bigToDecimal(details[5]));
      const rewardRate = updatedRow.percent / updatedRow.life_days;
      updatedRow.apy = rewardRate;

      if (signer) {
        const signerAddress = signer.address || (await signer.getAddress());
        const earned = await stakingOfferingContract.computePayout(signerAddress);
        const userDetails = await stakingOfferingContract.members(signerAddress);
        let userWithdrawnAmount = 0;
        if (userDetails) {
          userWithdrawnAmount = Number(bigToDecimal(userDetails.total_withdrawn) | 0);
        }
        console.log(userWithdrawnAmount);
        updatedRow.b = bigToDecimal(earned.devident);
        const userInfo = await stakingOfferingContract.userInfo(signerAddress);
        console.log(userInfo);
        const noOdDeposit = Number(userInfo.numDeposits || 0);
        let deposit = 0;
        for (var i = 0; i < noOdDeposit; i++) {
          const depositResult = await stakingOfferingContract.memberDeposit(signerAddress, decimalToBigUnits(i.toString(), 0));
          if ((!depositResult.isBreakEven) && userDetails?.lastWithdrawn < depositResult.time) {
            deposit += Number(bigToDecimal(depositResult.amount) | 0);
          }
          console.log(deposit, i);
        }
        console.log(stakingOfferingContract.address)
        console.log('invested', Number(bigToDecimal(userDetails.total_invested)))

        console.log('total_withdrawn', Number(bigToDecimal(userDetails.total_withdrawn)))

        console.log('referel Bonus', Number(bigToDecimal(userDetails.total_ref_bonus)))
        updatedRow.balanceOf = deposit;

        const nextWithdraw = await stakingOfferingContract.nextWithdraw(signerAddress);
        console.log(new Date(Number(nextWithdraw * 1000)));
        updatedRow.nextWithdraw = new Date(Number(nextWithdraw * 1000));
        updatedRow.remainingTime = getRemainingTime(updatedRow.nextWithdraw);
        updatedRow.allowWithdraw = new Date(Number(nextWithdraw * 1000)) <= new Date();
      }
      setRow(updatedRow);
    }
  }

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorBrakeEvenEl, setAnchorBrakeEvenEl] = useState(null);

  const open = Boolean(anchorEl);
  const openBrackeEvent = Boolean(anchorBrakeEvenEl);

  const handleBrackEvenClick = (event) => {
    setAnchorBrakeEvenEl(event.currentTarget);
  };
  const handleBrackEvenClose = () => {
    setAnchorBrakeEvenEl(null);
  };
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  React.useEffect(() => {
    if (props.row) {
      setStakingOptionDetailsFromStakingContract();
    }
  }, [props.row, provider]);
  React.useEffect(() => {
    if (refreshData) {
      setStakingOptionDetailsFromStakingContract();
    }
  }, [refreshData]);
  return (
    <Card className={classes.card} sx={{ opacity: row.isActive ? 1 : 0.5, margin: '8px' }}>
      <CardHeader
        sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}
        // avatar={
        //   <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
        //     <img className={classes.avatar} alt="" src={row?.staking_token?.token_image} />
        //   </Avatar>
        // }
        // color: theme.lightText
        title={
          <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h3">
            {row?.plane_name}
          </Typography>
        }
        subheader={
          <>
            <p style={{ color: theme.lightText, fontSize: '33px', fontWeight: 600, textAlign: 'left', paddingBottom: '5px', margin: '0px', lineHeight: 1 }}>
              {parseFloat(row.num_of_days === '7' ? Number(row.apy || 0) * 7 : Number(row.apy || 0)).toFixed(2)} %
            </p>
            <p style={{ color: theme.darkGoldText, fontSize: '24px', fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>
              {row.num_of_days === '1' ? 'Daily' : row.num_of_days === '7' ? 'Weekly' : `DAILY, WITHDRAWAL IN ${Math.round(Number(row.num_of_days || 0) / 30)} MONTHS`}
            </p>
          </>
        }
      />
      <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }}>
        <Typography sx={{ fontSize: 14, width: '100%', fontWeight: 500, display: 'block', color: theme.lightText, textAlign: 'left' }} variant="p">
          Minimum Deposit: {row.min_deposit}
        </Typography>

        <Typography
          sx={{
            fontSize: 14,
            width: '100%',
            fontWeight: 500,
            paddingBottom: '10px',
            borderBottom: '1px dashed ' + theme.darkGoldText,
            marginBottom: '10px',
            display: 'block',
            color: theme.lightText,
            textAlign: 'left',
          }}
          variant="p"
        >
          Maximum Deposit: {row.max_deposit}
        </Typography>

        <Typography sx={{ fontSize: 14, width: '100%', fontWeight: 500, color: theme.lightText, textAlign: 'left' }} variant="p">
          Your staked amount
        </Typography>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <p style={{ fontSize: '33px', fontWeight: 600, textAlign: 'left', margin: '0px', lineHeight: 1 }}>{parseFloat(Number(row.balanceOf || 0)).toFixed(3) || 0.0}</p>
        </div>

        <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '40px' }}>
          <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }}>
            <Typography sx={{ color: theme.lightText }} variant="p">
              Reward Earned
            </Typography>
            <div className="d-flexSpaceBetween">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>{parseFloat(Number(row.b || 0)).toFixed(3) || 0.0}</span>
              </div>
              {Number(row.b || 0) > Number(row.balanceOf) && (
                <ArrowDropDown
                  sx={{ margin: 'auto', cursor: 'pointer' }}
                  aria-controls={openBrackeEvent ? 'brackeven-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={openBrackeEvent ? 'true' : undefined}
                  onClick={handleBrackEvenClick}
                />
              )}
            </div>
            <Menu
              id="brackeven-menu"
              anchorEl={anchorBrakeEvenEl}
              open={openBrackeEvent}
              onClose={handleBrackEvenClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <div
                  style={{
                    color: theme.lightText,
                    fontSize: '18px',
                    fontWeight: 600,
                    textAlign: 'left',
                    paddingBottom: '10px',
                    margin: '0px',
                    lineHeight: 1,
                  }}
                >
                  Brake even {row.balanceOf}$ from devident amount and <br />
                  earn on profit amount.
                </div>

                <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => BrakeEven(row, true)}>
                  Brake Even
                </Button>
              </MenuItem>
            </Menu>
          </Grid>
          <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }}>
            <Typography sx={{ color: theme.lightText }} variant="p">
              Available Supply
            </Typography>
            <div className="d-flexSpaceBetween">
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>{parseFloat(Number(row.supply_pool || 0)).toFixed(3) || 0.0}</span>
              </div>
              {(!row.balanceOf || Number(row.balanceOf) <= 0) && Number(row.supply_pool || 0) >= Number(row.min_deposit) && (
                <ArrowDropDown
                  sx={{ margin: 'auto', cursor: 'pointer' }}
                  aria-controls={open ? 'basic-menu' : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                />
              )}
            </div>
            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem>
                <div
                  style={{
                    color: theme.lightText,
                    fontSize: '18px',
                    fontWeight: 600,
                    textAlign: 'left',
                    paddingBottom: '10px',
                    margin: '0px',
                    lineHeight: 1,
                  }}
                >
                  Stake {row.min_deposit}$ from supply pool <br />
                  and earn
                </div>
                <div
                  style={{
                    color: theme.lightText,
                    fontSize: '18px',
                    fontWeight: 600,
                    textAlign: 'left',
                    paddingBottom: '10px',
                    margin: '0px',
                    lineHeight: 1,
                  }}
                >
                  {parseFloat((row.num_of_days === '7' ? Number(row.apy) * 7 : Number(row.apy || 0)) / 2).toFixed(2)} %
                </div>
                <div
                  style={{
                    color: theme.darkGoldText,
                    fontSize: '14px',
                    paddingBottom: '10px',
                    fontWeight: 600,
                    textAlign: 'left',
                    margin: '0px',
                    lineHeight: 1,
                  }}
                >
                  {row.num_of_days === '1' ? 'Daily' : row.num_of_days === '7' ? 'Weekly' : `DAILY, WITHDRAWAL IN ${Math.round(Number(row.num_of_days || 0) / 30)} MONTHS`}
                </div>
                <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => openDrawer(row, true)}>
                  Stake
                </Button>
              </MenuItem>
            </Menu>
          </Grid>

          <Grid item xs={4} sm={4} md={4}>
            <Typography sx={{ color: theme.lightText }} variant="p">
              Total Staked
            </Typography>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>{parseFloat(Number(row.invested || 0)).toFixed(3) || 0.0}</span>
            </div>
          </Grid>
        </Grid>
        <AppBar
          key="rightbar"
          position="relative"
          className={classes.rightDrawerHeader}
          sx={{ height: { xs: 'auto', md: '77px', boxShadow: 'none !important' } }}
          color="transparent"
        >
          <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '16px' }}>
            {row.isActive && !inProgress && (
              <Grid item xs={6} sm={6} md={6}>
                <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => openDrawer(row)}>
                  Stake
                </Button>
              </Grid>
            )}

            {/* {row.isExpired && Number(row.b || 0) > 0 && !inProgress && (
              <Grid item xs={6} sm={6} md={6}>
                <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="outlined" onClick={() => BrakeEven()}>
                  Payout
                </Button>
              </Grid>
            )} */}

            {row.isActive && !inProgress && (
              <>
                {row.allowWithdraw ? (
                  <Grid item xs={6} sm={6} md={6}>
                    <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="outlined" onClick={() => openClaimDrawer(row)}>
                      Claim Reward
                    </Button>
                  </Grid>
                ) : (
                  <Grid item xs={6} sm={6} md={6}>
                    <Button sx={{ width: '100%', borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="outlined">
                      Claim After {row.remainingTime}
                    </Button>
                  </Grid>
                )}
              </>
            )}
          </Grid>
        </AppBar>
      </CardContent>
    </Card>
  );
}
