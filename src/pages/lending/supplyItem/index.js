import React, { useContext, useState } from 'react';
import { Box, Card, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input, Tab, ButtonGroup, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';
import { abis, asyncContractCall, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3Provider, Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { ethers } from 'ethers';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tokens } from '../../../token-icons';
import { bigToDecimal } from '../../../contracts/utils';
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
    textBold: theme.textBold
});

export default function SupplyItem(params) {
    console.log(params)
    const currentRow = params.input.currentRow
    const classes = useStyles();
    const { connectWallet, signer, account } = useContext(Web3ProviderContext);
    const [tranxHash, settranxHash] = useState('');

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
                    startDay: bigToDecimal(details.startDay, 18),
                    endDay: bigToDecimal(details.endDay, 18),
                    tokenAmount: ethers.utils.formatEther(details.tokenAmount),
                    SuppliedAmount: ethers.utils.formatEther(details.SuppliedAmount)
                }
                setSupplyDetails(current => [...current, supply]);
            });
        }


    }
    React.useEffect(() => {
        getSupplyDetailsFromContract()
    }, [])

    const redeemAmount = async (row) => {
        try {
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const fweth = makeContract(Tokens[currentRow.token.pedgeToken].address, currentRow.token.abi, signer);
            const wethResult = await fweth.approve(lendingContract.address, ethers.utils.parseEther(row.tokenAmount));
            const result = await lendingContract.redeem(currentRow.token.symbol, ethers.utils.parseEther(row.tokenAmount), currentRow.token.address, row.id, { gasLimit: 1000000 });
            await result.wait(1)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            alert('error occured' + err.message)
            params?.input?.toggleDrawer(false)
        }

    }

    const startSupply = async () => {
        try {
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const weth = makeContract(currentRow.token.address, currentRow.token.abi, signer);
            const wethResult = await weth.approve(lendingContract.address, ethers.utils.parseEther(amount));
            const result = await lendingContract.lend(currentRow.token.symbol, ethers.utils.parseEther(amount), lockDuration, currentRow.token.address, Tokens[currentRow.token.pedgeToken].address, { gasLimit: 1000000 });
            settranxHash(result.hash);
            await result.wait(1)
            alert('Lended amount 50')
            params?.input?.toggleDrawer(true)
        } catch (err) {
            alert('error occured' + err.message)
            params?.input?.toggleDrawer(false)
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
                    height: theme.midContainerHeight,
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
                    fontSize: '11px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>SUPPLY APY:</span> <span>{currentRow.rate}</span></div>
                    <div className="d-flexSpaceBetween"> <span>WALLET:</span> <span>{currentRow.supplyAmount}</span></div>
                </Card>
                <Card className={classes.innerCard} sx={{
                    display: 'block !important', padding: '10px',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontStretch: 'semi-expanded',
                    background: theme.TabsBackground,
                    color: theme.lightBlueText + ' !important',
                    margin: '10px',
                    width: 'auto'
                }}>

                    <TabContext value={value}>
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
                                    display: 'block !important', padding: '10px', paddingTop: '15px', marginBottom: '10px'
                                }}>
                                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>

                                    {/* Boxes */}
                                    <Grid item xs={12} sm={12} md={12}>

                                        <FormControl variant="standard">
                                            <InputLabel htmlFor="input-with-icon-adornment">
                                                Supply Requested
                                            </InputLabel>
                                            <Input
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
                                                            src={currentRow.token.icon} />
                                                    </Avatar>
                                                }

                                            />
                                        </FormControl>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl>
                                            <div style={{ padding: '4px', fontSize: '13px', color: 'rgba(0, 0, 0, 0.6)', paddingTop: '24px' }}>

                                                Select lock period
                                            </div>
                                            <ButtonGroup variant="outlined" aria-label="text button group">
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(0) }} sx={{ fontSize: '12px', padding: '4px', background: lockDuration === 0 ? 'lightgray' : 'inherit' }} >No lock</Button>
                                                    <div>3.67%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(3) }} sx={{ fontSize: '12px', padding: '4px', background: lockDuration === 3 ? 'lightgray' : 'inherit' }} >
                                                        3 months</Button>
                                                    <div>3.80%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(6) }} sx={{ fontSize: '12px', padding: '4px', background: lockDuration === 6 ? 'lightgray' : 'inherit' }} >6 months</Button>
                                                    <div>3.63%</div>
                                                </div>
                                                <div style={{ display: 'block', fontSize: '12px', padding: '4px', textAlign: 'center' }}>
                                                    <Button onClick={() => { setLockDuration(12) }} sx={{ fontSize: '12px', padding: '4px', background: lockDuration === 12 ? 'lightgray' : 'inherit' }} > 1 year</Button>
                                                    <div>3.86%</div>
                                                </div>
                                            </ButtonGroup>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={12} md={12}>
                                    <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                                </Grid>
                            </Card>

                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button variant="contained" onClick={startSupply}>Supply</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">

                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Amount</TableCell>
                                            <TableCell align="right">Start</TableCell>
                                            <TableCell align="right">End</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {supplyDetails.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    {row.SuppliedAmount}
                                                </TableCell>
                                                <TableCell align="right">{row.startDay}</TableCell>
                                                <TableCell align="right">{row.endDay}</TableCell>
                                                <TableCell align="right">{
                                                    !row.redeem && (
                                                        <Button onClick={() => redeemAmount(row)}>
                                                            Redeem
                                                        </Button>
                                                    )
                                                    
                                                }
                                                {row.redeem &&('Redeemed')}</TableCell>
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
