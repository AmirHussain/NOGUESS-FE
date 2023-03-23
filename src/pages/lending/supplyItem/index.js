import React, { useContext, useState } from 'react';
import { Box, Card, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input, Tab, ButtonGroup, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid, Backdrop, Alert, AlertTitle, Stack, Snackbar } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, DoneAll, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';
import { abis, asyncContractCall, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3Provider, Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { ethers } from 'ethers';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { TokenContext } from '../../../tokenFactory';
import { bigToDecimal, decimalToBig, decimalToBigUnits } from '../../../utils/utils';
import moment from 'moment/moment';
import { vernofxAlertContext } from '../../../Components/Alert';
import { formatDate } from '../../../utils/common';
require('dotenv').config();

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
    textBold: theme.textBold,
    actionButton: theme.actionButton2
});

export default function SupplyItem(params) {
    console.log(params)
    const currentRow = params.input.currentRow
    const classes = useStyles();
    const { IntrestRateModal, TokenAggregators, TokenBorrowLimitations, Tokens, getToken } = React.useContext(TokenContext);

    const { connectWallet, signer, account } = useContext(Web3ProviderContext);
    const { setAlert } = useContext(vernofxAlertContext);


    const [inProgress, setInProgress] = useState(false);

    const [supplyDetails, setSupplyDetails] = useState([]);

    const getSupplyDetailsFromContract = async () => {
        setSupplyDetails([])
        if (!signer) {
            return

        }
        const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
        const ids = await lendingContract.getLenderId(currentRow?.token.symbol);
        debugger;
        if (ids && ids.length) {
            ids.forEach(async (id) => {
                const details = await lendingContract.getLenderAsset(id);
                const supply = {
                    id,
                    redeem: details.isRedeem,
                    startDay: formatDate(details.startDay),
                    endDay: formatDate(details.endDay),
                    differnce: getDifference(new Date(Number(details.startDay) * 1000), new Date(Number(details.endDay) * 1000)),
                    tokenAmount: ethers.utils.formatEther(details.tokenAmount),
                    SuppliedAmount: ethers.utils.formatEther(details.SuppliedAmount)
                }
                setSupplyDetails(current => [...current, supply]);
            });
        }


    }

    const getDifference = (startDay, endDay) => {
        var a = moment(endDay);
        var b = moment(startDay);
        return a.diff(b) / 3600
    }

    React.useEffect(() => {
        getSupplyDetailsFromContract()
    }, [])

    const redeemAmount = async (row) => {
        let index = -1;
        try {
            setInProgress(true)
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const fweth = makeContract(currentRow.token.pedgeToken, currentRow.token.abi, signer);

            index = setAlert({ severity: 'info', title: 'Aprroval', description: 'Approval of transaction in progress', txHash: '' }
            );

            const wethResult = await fweth.approve(lendingContract.address, decimalToBig(row.tokenAmount));
            setAlert({ severity: 'success', title: 'Aprroval', description: 'Approval of transaction performed successfully', txHash: wethResult.hash }, index);
            index = setAlert({ severity: 'info', title: 'Redeem', description: 'Redeem in progress', txHash: '' });
            const result = await lendingContract.redeem(currentRow.token.symbol, decimalToBig(row.tokenAmount), currentRow.token.address, row.id, IntrestRateModal, { gasLimit: 1000000 });
            setAlert({ severity: 'info', title: 'Redeem', description: 'Redeem in progress', txHash: result.hash }, index);

            await result.wait(1)
            setAlert({ severity: 'success', title: 'Redeem', description: 'Redeem completed successfully', txHash: result.hash }, index);
            setInProgress(false)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            setAlert({ severity: 'error', title: 'Redeem', error: err }, index);
            setInProgress(false)
            params?.input?.toggleDrawer(false)
        }

    }

    const startSupply = async () => {
        let index = -1;
        try {

            setInProgress(true)
            params?.input?.toggleDrawer(false);
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const weth = makeContract(currentRow.token.address, currentRow.token.abi, signer);
            index = setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
            const supplyToken = await getToken(currentRow.token.address);
            const pedgeToken = await getToken(currentRow.token.pedgeToken);
            const wethResult = await weth.approve(lendingContract.address, decimalToBig(amount),
                { gasLimit: 1000000 });
            setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully', txHash: wethResult.hash }, index);


            index = setAlert({ severity: 'info', title: 'Supply', description: 'Supply in progress', txHash: '' });
            console.log(decimalToBig(amount),
                decimalToBigUnits(lockDuration.toString(), 0))
            const result = await lendingContract.lend(
                supplyToken, pedgeToken,
                decimalToBig(amount),
                decimalToBigUnits(lockDuration.toString(), 0),
                { gasLimit: 1000000 });
            setAlert({ severity: 'info', title: 'Supply', description: 'Supply in progress', txHash: result.hash }, index);

            await result.wait(1)
            setAlert({ severity: 'success', title: 'Supply', description: 'Supply completed successfully', txHash: result.hash }, index);
            setInProgress(false)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            setAlert({ severity: 'error', title: 'Supply', error: err }, index);
            setInProgress(false);
            params?.input?.toggleDrawer(false);
        }

    }

    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [amount, setAmount] = useState("0.00");
    const [lockDuration, setLockDuration] = useState(0);

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
                    overflow: 'auto'

                }}
                className={classes.content}
            >
                <div className={classes.sectionHeading}>
                    Summary
                </div>
                <Card className={classes.innerCard} sx={{
                    display: 'block !important', padding: '10px',
                    background: theme.TabsBackground,
                    color: theme.lightText + ' !important',
                    fontSize: '11px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>SUPPLY APY:</span> <span>{currentRow.rate}</span></div>
                    <div className="d-flexSpaceBetween"> <span>WALLET:</span> <span>{currentRow.supplyAmount}</span></div>
                </Card>
                <Card className={classes.innerCard} sx={{
                    display: 'block !important', padding: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    background: 'transparent !important',
                    boxShadow: 'none !important',
                    fontStretch: 'semi-expanded',
                    color: theme.lightText + ' !important',
                    marginTop: '10px',
                    width: 'auto'
                }}>

                    <TabContext variant="fullWidth" value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}
                                indicatorColor="main"
                                textColor="inherit"
                                fontWeight="inherit"
                                aria-label="lab API tabs example" centered
                            >
                                <Tab label="Supply Now" value="1" />
                                <Tab label="Redeem" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Card key="form" className={classes.innerCard}
                                sx={{

                                    background: theme.TabsBackground,
                                    color: theme.lightText,
                                    display: 'block !important',
                                    padding: '10px',
                                    paddingTop: '15px', marginBottom: '10px'
                                }}>
                                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>

                                    {/* Boxes */}
                                    <Grid item xs={12} sm={12} md={12}>

                                        <FormControl variant="standard" sx={{ color: theme.lightText, width: '100%' }}>
                                            <InputLabel htmlFor="input-with-icon-adornment" sx={{ color: theme.lightText, borderColor: theme.lightText + ' !important' }}>
                                                Supply Requested
                                            </InputLabel>
                                            <Input
                                                id="input-with-icon-adornment"
                                                value={amount}
                                                type="number"
                                                sx={{
                                                    color: theme.lightText + ' !important',
                                                    padding: '6px',
                                                    width: '100%'
                                                }}
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
                                                            src={currentRow?.token?.icon} />
                                                    </Avatar>
                                                }

                                            />
                                        </FormControl>
                                    </Grid>

                                    {/* <Grid item xs={12} sm={12} md={12}>
                                        <FormControl>
                                            <div style={{ padding: '4px', fontSize: '13px',  paddingTop: '24px' }}>

                                                Select lock period
                                            </div>
                                            <ButtonGroup variant="outlined" aria-label="text button group">
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(0) }} sx={{ fontSize: '12px', color:theme.lightText+' !important', border:'0px solid transparent !important',padding: '4px', background: lockDuration === 0 ? theme.headerBackground : theme.TabsBackground }} >No lock</Button>
                                                    <div>3.67%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(3) }} sx={{ fontSize: '12px', color:theme.lightText+' !important', border:'0px solid transparent !important',padding: '4px', background: lockDuration === 3 ?  theme.headerBackground : theme.TabsBackground }} >
                                                        3 months</Button>
                                                    <div>3.80%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(6) }} sx={{ fontSize: '12px', color:theme.lightText+' !important', border:'0px solid transparent !important',padding: '4px', background: lockDuration === 6 ?  theme.headerBackground : theme.TabsBackground }} >6 months</Button>
                                                    <div>3.63%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(12) }} sx={{ fontSize: '12px', color:theme.lightText+' !important', border:'0px solid transparent !important',padding: '4px', background: lockDuration === 12 ?  theme.headerBackground : theme.TabsBackground }} > 1 year</Button>
                                                    <div>3.86%</div>
                                                </div>
                                            </ButtonGroup>
                                        </FormControl>
                                    </Grid> */}
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                                </Grid>
                            </Card>

                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button sx={{ width: "100%", borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={startSupply}>Supply</Button>

                            </div>
                        </TabPanel>
                        <TabPanel value="2">

                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Supply Amount</TableCell>
                                            <TableCell align="right">Start</TableCell>
                                            <TableCell align="right">End</TableCell>
                                            <TableCell align="right">Redeem</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {supplyDetails?.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <h4> {row.SuppliedAmount}</h4>
                                                </TableCell>
                                                <TableCell align="right"> <h4> {row.startDay} </h4></TableCell>
                                                <TableCell align="right"> <h4> {row.endDay} </h4></TableCell>
                                                <TableCell align="right">{
                                                    !row.redeem && row.differnce <= 0 && (

                                                        <Button
                                                            variant="contained" size="small"
                                                            className={classes.actionButton} onClick={() => redeemAmount(row)}>
                                                            Redeem
                                                        </Button>


                                                    )

                                                }
                                                    {
                                                        !row.redeem && row.differnce > 0 && (

                                                            <h4>After {row.differnce} days </h4>

                                                        )

                                                    }
                                                    {row.redeem && (<DoneAll></DoneAll>)}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>
                    </TabContext>
                </Card>
            </Box>


        </React.Fragment >
    );
}
