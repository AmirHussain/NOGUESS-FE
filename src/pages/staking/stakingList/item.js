import React, { useContext, useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Button, Link, Typography, Grid, AppBar } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../utils/utils';
import moment from 'moment';
import { getAPY } from '../../../utils/common';
import { vernofxAlertContext } from '../../../Components/Alert';


const useStyles = makeStyles({
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

export default function StakingItem(props) {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const { setAlert} = useContext(vernofxAlertContext);
    const [row, setRow] = useState({});
    const openDrawer = (row) => {
        row.token = { icon: row.staking_token?.token_image, address: row.staking_token?.token_address, symbol: row.staking_token?.token_symbol }
        props.openDrawer(row);
    }
    const [inProgress, setInProgress] = useState(false);
    const claimReward = async () => {
        try {
            setInProgress(true)
            const stakingContract = makeContract(row.staking_contract_address, abis.staking, signer);
            // const weth = makeContract(row.staking_token.token_address, abis.WETH, signer);
            // setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
            // const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
            // setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });
            setAlert({ severity: 'info', title: 'Claim', description: 'Claim in progress' });
            const result = await stakingContract.getReward({ gasLimit: 1000000 });
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Claim reward', description: 'Reward added successfully' });
            setInProgress(false);

        } catch (err) {
            setAlert({ severity: 'error', title: 'Claim', error: err });
            setInProgress(false);
        }

    }

    const withdrawSupply = async () => {
        try {
            setInProgress(true)
            const stakingContract = makeContract(row.staking_contract_address, abis.staking, signer);
            // const weth = makeContract(row.staking_token.token_address, abis.WETH, signer);
            // setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
            // const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
            // setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });
            setAlert({ severity: 'info', title: 'Withdraw', description: 'Withdraw in progress' });
            const result = await stakingContract.withdraw({ gasLimit: 1000000 });
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Withdraw', description: 'Withdraw amount successfully' });
            setInProgress(false);

        } catch (err) {
            setAlert({ severity: 'error', title: 'Withdraw', error: err });
            setInProgress(false);
        }

    }

    const SetAndOpenAsset = (row) => {
        props.SetAndOpenAsset(row)
    };

    async function setStakingOptionDetailsFromStakingContract() {
        if (provider) {
            console.log('row', props.row)
            console.log(signer);
            const stakingOfferingContract = makeContract(props.row?.staking_contract_address, abis.staking, signer);
            console.log(stakingOfferingContract);
            const updatedRow = props.row
            if (signer) {
                const signerAddress = signer.address || await signer.getAddress()
                const duration = await stakingOfferingContract.duration();
                console.log(duration, bigToDecimal(duration))
                updatedRow.staking_duration = Math.round(moment.duration(Number(bigToDecimal(duration)), 'seconds').asMonths());

                const earned = await stakingOfferingContract.earned(signerAddress);
                const rewardRate = await stakingOfferingContract.rewardRate();
                const totalSupply = await stakingOfferingContract.totalSupply();
                
                const balanceOf = await stakingOfferingContract.balanceOf(signerAddress);
                
                updatedRow.b = bigToDecimal(earned);
                updatedRow.apy = getAPY(Number(rewardRate));
                
                updatedRow.balanceOf= bigToDecimal(balanceOf);
                updatedRow.totalSupply= bigToDecimal(totalSupply);

            }
            setRow(updatedRow)

        }
    }
    React.useEffect(() => {

        if (props.row) {

            setStakingOptionDetailsFromStakingContract()
        }
    }, [props.row, provider])
    return (
        <Card className={classes.card} sx={{ opacity: row.isActive ? 1 : 0.5, margin: '8px' }}>
            <CardHeader
                sx={{ color: 'white', fontWeight: 600, textAlign: 'left' }}
                avatar={
                    <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                        <img className={classes.avatar} alt=""
                            src={row?.staking_token?.token_image} />
                    </Avatar>
                }
                // color: theme.lightText
                title={
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" >

                        {row?.staking_token?.token_name}</Typography>}

            />
            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
                <Typography sx={{ fontSize: 14, width: '100%', fontWeight: 500, color: theme.lightText, textAlign: 'left' }} variant="p" >
                    You are staking
                </Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar2}>
                        <img className={classes.avatar2} alt=""
                            src={row?.staking_token?.token_image} />
                    </Avatar>
                    <p style={{ fontSize: '33px', fontWeight: 600, textAlign: 'left', paddingLeft: '10px', margin: '0px', lineHeight: 1 }}>

                        {row.balanceOf || 0.0}</p>

                </div>

                <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '40px' }}>

                    <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }} >

                        <div >
                            <Typography sx={{ color: theme.lightText }} variant="p" >
                                APY
                            </Typography>
                        </div>
                        <div>
                        <span style={{paddingLeft:'4px',fontSize:'20px',fontWeight:'600'}}>
                                {parseFloat(Number(row.apy)).toFixed(2)} %
                            </span>
                        </div>

                    </Grid>

                    <Grid item xs={4} sm={4} md={4} style={{ borderRight: '0.5px solid ' + theme.borderColor }} >
                        <Typography sx={{ color: theme.lightText }} variant="p" >
                            Reward Earned
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                                <img className={classes.avatar} alt=""
                                    src={row?.reward_token?.token_image} />
                            </Avatar>
                            <span style={{paddingLeft:'4px',fontSize:'20px',fontWeight:'600'}}>
                                {row.b||0.0}
                            </span>
                        </div>

                    </Grid>

                    <Grid item xs={4} sm={4} md={4} >
                        <Typography sx={{ color: theme.lightText }} variant="p" >
                            Total Stacked
                        </Typography>
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                                <img className={classes.avatar} alt=""
                                    src={row?.staking_token?.token_image} />
                            </Avatar>
                            <span style={{paddingLeft:'4px',fontSize:'20px',fontWeight:'600'}}>
                                {row.totalSupply||0.0} 
                            </span>
                        </div>

                    </Grid>
                </Grid>
                <AppBar key="rightbar"
                    position="relative"
                    className={classes.rightDrawerHeader}
                    sx={{ height: { xs: 'auto', md: '77px', boxShadow: 'none !important' } }}

                    color="transparent"

                >

                    <Grid container direction="row" justifyContent="center" alignItems="flex-center"
                        spacing={1} style={{ width: '100%', textAlign: 'left', paddingTop: '16px' }}>

                        {row.isActive && !inProgress && (
                            <Grid item xs={6} sm={6} md={6}  >
                                <Button sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={() => openDrawer(row)}>Stake</Button>
                            </Grid>
                        )}

                        {row.isExpired && (Number(row.b) > 0) && !inProgress && (
                            <Grid item xs={6} sm={6} md={6} >

                                <Button sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="outlined" onClick={() => withdrawSupply()}>Withdraw</Button>
                            </Grid>
                        )}


                        {row.isActive && !inProgress && (
                            <Grid item xs={6} sm={6} md={6}  >

                                <Button sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="outlined" onClick={() => claimReward()}>Claim Reward</Button>
                            </Grid>

                        )}



                    </Grid>
                </AppBar>
            </CardContent>
        </Card>

    );
}
