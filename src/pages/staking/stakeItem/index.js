import React, { useContext, useState } from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, Input } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme'
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { FluteAlertContext } from '../../../Components/Alert';
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
        objectFit: 'scale-down'
    },

    sideBar: {
        background: '#050506',
        color: 'white'
    },
    textHighlighted: theme.textHighlighted,
    sectionHeading: theme.sectionHeading,
    textMutedBold: theme.textMutedBold,
    textMuted: theme.textMuted,
    innerCard: theme.innerCard,
    modal: theme.modal,
    drawer: theme.drawer,
    drawerPaper: theme.rightDrawerPaper,
    textBold: theme.textBold
});

export default function StakeItem(params) {
    console.log(params)
    const currentStake = params.input.currentStake
    const classes = useStyles();

    const { connectWallet, signer, account } = useContext(Web3ProviderContext);
    const { setAlert, setAlertToggle } = useContext(FluteAlertContext);

    const [inProgress, setInProgress] = useState(false);
    const [amount, setAmount] = useState("0.00");

    const startStaking = async () => {
        try {
            setInProgress(true)
            const stakingContract = makeContract(currentStake.staking_contract_address, abis.staking, signer);
            const weth = makeContract(currentStake.staking_token.token_address, abis.WETH, signer);
            setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
            const wethResult = await weth.approve(stakingContract.address, decimalToBig(amount));
            setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });
            setAlert({ severity: 'info', title: 'Staking', description: 'Staking in progress' });
            const result = await stakingContract.stake(decimalToBig(amount), { gasLimit: 1000000 });
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Staking', description: 'Staking completed successfully' });
            setInProgress(false)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            setAlert({ severity: 'error', title: 'Staking', description: err.message });
            setInProgress(false);
            params?.input?.toggleDrawer(false);
        }

    }


    return (
        <React.Fragment key="RIGHTContent">


            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: { xs: theme.modalXsMidContainerHeight, md: 'auto' },
                    maxHeight:{ xs: theme.modalXsMidContainerMaxHeight, md: theme.modalMdMidContainerMaxHeight },
                    minWidth:{ xs: '100%', md: '30vw' },
                    display: 'block',
                    right: '0px',
                    overflow: 'auto'

                }}
                className={classes.content}
            >
                <div className={classes.sectionHeading}>
                    Summary
                </div>
                <Card className={classes.innerCard} sx={{
                      background: theme.TabsBackground,
                      color: theme.lightText + ' !important',
                    display: 'block !important', padding: '10px',
                    fontSize: '11px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>APR IN REWARD:</span> <span>{currentStake.apy} % </span></div>
                    <div className="d-flexSpaceBetween"> <span>STAKING CYCLE</span> <span>{currentStake.staking_duration} Month(s)</span></div>
                    <div className="d-flexSpaceBetween"> <span>START TIME:</span><span>{currentStake.staking_start_time}</span></div>
                    <div className="d-flexSpaceBetween"> <span>YOUR BALANCE</span><span>{currentStake.b}</span></div>
                </Card>
                <div className={classes.sectionHeading}>
                    Summary
                </div>
                <Card key="form" className={classes.innerCard} sx={{
                      background: theme.TabsBackground,
                      color: theme.lightText + ' !important',
                      marginBottom:'20px',
                       display: 'block !important', padding: '10px', paddingTop: '15px' }}>
                    <Input
                      sx={{
                        color: theme.lightText + ' !important',
                        padding: '6px',
                        width:'100%'
                    }}
                        id="input-with-icon-adornment"
                        value={amount}
                        type="number"
                        onChange={(e) => setAmount(e.target.value)}
                        startAdornment={
                            <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                                sx={{
                                    marginRight: '10px', margin: '4px',
                                    width: '27px',
                                    height: '27px'
                                }}
                            >
                                <img className="chainIcon" alt=""
                                    src={currentStake?.token?.icon} />
                            </Avatar>
                        }

                    />

                    <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                </Card>
                <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
            <Button sx={{ width: "100%", borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={startStaking} >Stake Now</Button>
            </div>

            </Box>

 
        </React.Fragment>
    );
}
