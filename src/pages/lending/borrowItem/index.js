import React, { useContext, useState } from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input, Select, MenuItem, OutlinedInput, TableHead, Backdrop, Stack, Alert, AlertTitle, Popover, FormControlLabel, CardContent } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { ethers } from 'ethers';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { IntrestRateModal, TokenAggregators, TokenBorrowLimitations, Tokens } from '../../../token-icons';
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../utils/utils';
import { FluteAlertContext } from '../../../Components/Alert';
import moment from 'moment';
import { getAPY } from '../../../utils/common';
require('dotenv').config();
const MenuProps = {
    PaperProps: {
        style: {
            width: 250,
        },
    },
};
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '100%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};
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

export default function BorrowItem(params) {
    console.log(params)
    const currentRow = params.input?.currentRow || {}
    const currentToken = params.input?.currentRow?.token || {}
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const [amount, setAmount] = useState("0.00");
    const [stableRate, setStableRate] = React.useState(false);

    const [repayAmountValue, setRepayAmountValue] = useState("0.00");

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const { connect, signer, account } = useContext(Web3ProviderContext);

    const [tranxHash, settranxHash] = useState('');
    const [collateral, setColleteral] = useState('');
    const [decimals, setDecimals] = useState(0);
    const { setAlert, setAlertToggle } = useContext(FluteAlertContext);
    const [inProgress, setInProgress] = useState(false);

    const [colleteralAmount, setColleteralAmount] = useState();
    const [availableAmount, setAvailableAmount] = useState(0);

    const tokens = Object.keys(Tokens)


    const handleCollateralChange = (event) => {
        const {
            target: { value },
        } = event;
        setColleteral(
            value
        );
    };

    const [borrowDetails, setBorrowDetails] = useState([]);


    const getBorrowDetailsFromContract = async () => {
        setBorrowDetails([])
        if (!signer) {
            return

        }
        const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
        const ids = await lendingContract.getBorrowerId(currentToken.symbol);
        if (ids && ids.length) {
            ids.forEach(async (id) => {
                const details = await lendingContract.getBorrowerDetails(id);
                const Borrow = {
                    ...details,
                    id,
                    repaid: details.hasRepaid,
                    startDay: formatDate(bigToDecimal(details.borrowDay)),
                    borrowAmount: Number(bigToDecimal(details.borrowAmount)),
                    // endDay: bigToDecimal(details.endDay),
                    loanAmount: Number(bigToDecimal(details.loanAmount))
                }
                console.log(Borrow);
                setBorrowDetails(current => [...current, Borrow]);
            });
        }


    }

    const formatDate = (date) => {
        return moment(new Date(Number(date) * 1000)).format('MMMM Do YYYY, h:mm:ss a')
    }

    React.useEffect(() => {
        getBorrowDetailsFromContract()
    }, [])

    const startBorrow = async () => {
        try {

            setInProgress(true)
            const collateralToken = Tokens[collateral];
            const loanToken = currentToken;
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const collateralContract = makeContract(collateralToken.address, collateralToken.abi, signer);
            await setCollateralAmountOfToken()

            setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });

            await collateralContract.approve(lendingContract.address, decimalToBig(colleteralAmount.toString()))
            setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully' });

            setAlert({ severity: 'info', title: 'Borrow', description: 'Borrow in progress' });
            console.log('Borrow Params', loanToken.symbol, decimalToBig(amount.toString()), loanToken.address,
                collateralToken.symbol, collateralToken.address, decimalToBig(colleteralAmount.toString()), { gasLimit: 1000000 }
            )
            console.log(currentRow.borrowAPY || '0')
            const result = await lendingContract.borrow(
                loanToken.symbol, decimalToBig(amount.toString()), loanToken.address,
                collateralToken.symbol, collateralToken.address, decimalToBig(colleteralAmount.toString()), decimalToBig(currentRow.borrowAPY.toString() || '0'), stableRate, { gasLimit: 1000000 }
            );

            settranxHash(result.hash);
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Borrow', description: 'Borrow completed successfully' });


            setInProgress(false)
            params?.input?.toggleDrawer(true)
        } catch (err) {
            setAlert({ severity: 'error', title: 'Borrow', description: err.message });
            setInProgress(false)
            params?.input?.toggleDrawer(false)
        }

    }

    const [redeemRow, setRedeemRow] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const handleOpen = (event) => {
        setRedeemRow(event)
        setOpen(true);
        setRepayAmountValue(event.loanAmount + (event.loanAmount * event.borrowAPY))
    };
    const handleClose = () => {
        setOpen(false);
    };

    const repayAmount = async (row) => {
        try {
            handleClose()
            setInProgress(true)
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const tokenKeys = Object.keys(Tokens);
            let collateralToken;
            tokenKeys.forEach((key) => {
                if (Tokens[key].symbol === row.collateralToken) {
                    collateralToken = Tokens[key];
                }
            });
            setAlert({ severity: 'info', title: 'Aprroval', description: 'Approval of transaction in progress' });

            const loanTokenContract = makeContract(currentToken.address, collateralToken.abi, signer);
            await loanTokenContract.approve(lendingContract.address, decimalToBig(repayAmountValue.toString()));
            setAlert({ severity: 'success', title: 'Aprroval', description: 'Approval of transaction performed successfully' });
            setAlert({ severity: 'info', title: 'Repay', description: 'Repay in progress' });
            const result = await lendingContract.repay(
                row['loanToken'], decimalToBig(repayAmountValue.toString()), currentToken.address,
                collateralToken.address, row.id, IntrestRateModal, { gasLimit: 1000000 });
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Repay', description: 'Repay completed successfully' });

            setInProgress(false)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            setInProgress(false)
            setAlert({ severity: 'error', title: 'Repay', description: err.message });
            params?.input?.toggleDrawer(true)
        }

    }

    const setCollateralAmountOfToken = async () => {
        try {
            if (amount && collateral) {
                const collateralToken = Tokens[collateral];
                const loanToken = currentToken;
                const collateralAggregators = TokenAggregators.find((aggregator) => aggregator.tokenSymbol === collateralToken.symbol);
                const loanAggregators = TokenAggregators.find((aggregator) => aggregator.tokenSymbol === loanToken.symbol);
                if (collateralAggregators && loanAggregators) {
                    setDecimals(collateralAggregators.decimals)
                    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
                    const loanBigUnitPriceInUSD = await lendingContract.getAggregatorPrice(loanAggregators.aggregator);
                    console.log('loanBigUnitPriceInUSD', loanBigUnitPriceInUSD);
                    const loanUnitPriceInUSD = Number(loanBigUnitPriceInUSD) / Math.pow(10, loanAggregators.decimals);
                    console.log('loanUnitPriceInUSD', loanUnitPriceInUSD);
                    const totalLoanInUSD = Number(loanUnitPriceInUSD) * Number(amount);
                    console.log('totalLoanInUSD', totalLoanInUSD);
                    const collateralBigUnitPriceInUSD = await lendingContract.getAggregatorPrice(collateralAggregators.aggregator);
                    console.log('collateralBigUnitPriceInUSD', collateralBigUnitPriceInUSD);
                    const collateralUnitPriceInUSD = Number(collateralBigUnitPriceInUSD) / Math.pow(10, loanAggregators.decimals);
                    console.log('collateralUnitPriceInUSD', collateralUnitPriceInUSD);
                    const totalCollateralInUSD = Number(totalLoanInUSD) * Number(100) / (Number(bigToDecimalUints(TokenBorrowLimitations.CollateralFator, 2)) * 100);
                    console.log('totalCollateralInUSD', totalCollateralInUSD);
                    const collateralUnits = totalCollateralInUSD / collateralUnitPriceInUSD
                    console.log('totalCollateralInUSD', collateralUnits);

                    setColleteralAmount(collateralUnits)
                } else {
                    alert('No aggregator found for token ' + collateral)
                }
            }

        } catch (err) {
            alert('error occured' + err.message)
        }
    }
    React.useEffect(() => {
        setCollateralAmountOfToken()
    }, [amount, collateral]);

    const setCurrentUserCollateralTokenBalance = async () => {
        if (collateral) {
            const collateralToken = Tokens[collateral];
            const tokenContract = makeContract(collateralToken.address, collateralToken.abi, signer);
            const availableTokenAmount = await tokenContract.balanceOf(account)
            setAvailableAmount(bigToDecimal(availableTokenAmount))
        }
    }

    React.useEffect(() => {
        setCurrentUserCollateralTokenBalance()
    }, [collateral])



    return (
        <React.Fragment key="RIGHTContent">
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: `calc(100% - ${theme.headerHeight})`,
                    display: 'block',
                    right: '0px',
                    overflow: 'auto',

                }}
                className={classes.content}
            >
                <div className={classes.sectionHeading}>
                    Summary
                </div>
                <Card className={classes.innerCard} sx={{
                    display: 'block !important', padding: '10px',
                    fontSize: '12px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>Borrow APY:</span> <span>{parseFloat(getAPY(currentRow?.borrowAPY) * 100).toFixed(3)} %</span></div>
                </Card>

                <Card className={classes.innerCard} sx={{
                    display: 'block !important',
                    padding: '4px',
                    fontSize: '12px',
                    fontWeight: '600',
                    fontStretch: 'semi-expanded',
                    background: theme.TabsBackground,
                    color: theme.lightBlueText + ' !important',
                    marginTop: '10px',
                    width: 'auto'
                }}>

                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}
                                indicatorColor="main"
                                textColor="inherit"
                                aria-label="lab API tabs example" centered>
                                <Tab label="Borrow" value="1" />
                                <Tab label="Repay" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Card key="form" className={classes.innerCard}
                                sx={{
                                    display: 'block !important', padding: '10px', paddingTop: '15px', marginBottom: '10px'
                                }}>

                                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>

                                    <Grid item xs={12} sm={6} md={12}>
                                        <FormControl variant="outlined" sx={{ m: 1, width: '100%' }}>
                                            <InputLabel htmlFor="input-with-icon-adornment">
                                                Borrow Requested
                                            </InputLabel>

                                            <OutlinedInput
                                                label="Borrow Requested"
                                                value={amount}
                                                type="number"
                                                onChange={(e) => setAmount(e.target.value)}
                                                id="input-with-icon-adornment"
                                                startAdornment={
                                                    <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                                                        sx={{
                                                            marginRight: '10px', margin: '4px',
                                                            width: '27px',
                                                            height: '27px'
                                                        }}
                                                    >
                                                        <img className="chainIcon" alt=""
                                                            src={currentToken.icon} />
                                                    </Avatar>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={6} md={12}>

                                        <FormControlLabel
                                            value={stableRate}
                                            sx={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                fontWeight: 600
                                            }}
                                            onChange={(e) => setStableRate(e.target.value)}
                                            control={<Switch color="primary" sx={{ float: 'right' }} />}
                                            label="On stable rate"
                                            labelPlacement="start"
                                        />
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={12}>
                                        <Card sx={{ minWidth: 275 ,background:'#F5F5F5'}}>
                                            <CardContent>
                                                <Typography sx={{ fontSize: 14, fontWeight: 600 }} variant="h4" gutterBottom>

                                                    <FormControl sx={{ width: '100%' }}>
                                                    <InputLabel id="demo-multiple-checkbox-label">Select Collateral</InputLabel>
                                                        <Select
                                                            labelId="demo-multiple-checkbox-label"
                                                            id="demo-multiple-checkbox"
                                                            value={collateral}
                                                            onChange={handleCollateralChange}
                                                            input={<OutlinedInput label="Select Collateral" />}
                                                            renderValue={(selected) => selected}
                                                            MenuProps={MenuProps}
                                                            startAdornment={
                                                                <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                                                                    sx={{
                                                                        marginRight: '10px', margin: '4px',
                                                                        width: '27px',
                                                                        height: '27px'
                                                                    }}
                                                                >
                                                                    <img className="chainIcon" alt=""
                                                                        src={Tokens[collateral]?.icon} />
                                                                </Avatar>} >
                                                            {tokens.map((token) => (
                                                                !Tokens[token].isPedgeToken &&
                                                                Tokens[token].address !== currentToken.address && (
                                                                    <MenuItem key={token} value={token}>
                                                                        <img className="chainIcon" alt=""
                                                                            src={Tokens[token].icon} />
                                                                        <ListItemText primary={Tokens[token].name} />
                                                                    </MenuItem>
                                                                )
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </Typography>
                                                <Typography sx={{ display: 'flex', justifyContent: 'space-between' }} color="text.secondary" gutterBottom>
                                                    <div> Amount to be collateralized </div>
                                                    <div>{parseFloat(colleteralAmount || 0).toFixed(5)} {collateral}</div>
                                                </Typography>
                                                <Typography sx={{ display: 'flex', justifyContent: 'space-between' }} color="text.secondary" gutterBottom>
                                                    <div> Available amount </div>
                                                    <div>{parseFloat(availableAmount || 0).toFixed(5)} {collateral}</div>
                                                </Typography>
                                            </CardContent>

                                        </Card>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                                    </Grid>
                                </Grid>

                            </Card>


                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button variant="contained" onClick={startBorrow} >Borrow</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <TableContainer component={Paper}>
                                <Table aria-label="simple table">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Borrowed</TableCell>
                                            <TableCell>Remaining</TableCell>
                                            <TableCell align="right">Borrowed On</TableCell>
                                            <TableCell align="right">Action</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {borrowDetails.map((row) => (
                                            <TableRow
                                                key={row.id}
                                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                            >
                                                <TableCell component="th" scope="row">
                                                    <h4>{row.borrowAmount} {currentRow.symbol}</h4>
                                                </TableCell>
                                                <TableCell component="th" scope="row">
                                                    <h4>{row.loanAmount}  {currentRow.symbol}</h4>
                                                </TableCell>
                                                <TableCell align="right"><h4>{row.startDay}</h4></TableCell>
                                                <TableCell align="right">{
                                                    row.loanAmount > 0 && (
                                                        <div> <Button
                                                            variant="contained" size="small"
                                                            className={classes.actionButton}
                                                            onClick={() => handleOpen(row)}>
                                                            Repay
                                                        </Button>

                                                        </div>

                                                    )
                                                }
                                                    {
                                                        row.loanAmount <= 0 && (
                                                            <div>Repaid</div>
                                                        )
                                                    }</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                            </TableContainer>
                        </TabPanel>
                    </TabContext>
                </Card>
            </Box>
            <Modal

                open={open}
                onClose={handleClose}
                aria-labelledby="child-modal-title"
                aria-describedby="child-modal-description"
            >
                <Box sx={{ ...style, width: 'auto' }}>
                    <Typography id="transition-modal-title" variant="h6" component="h2">
                        Redeem Token
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Amount Borrowed: {redeemRow.borrowAmount}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Remaining: {redeemRow.loanAmount}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        Amount To Pay: {redeemRow.loanAmount + (redeemRow.loanAmount * currentRow.borrowAPY)}
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
                            <InputLabel htmlFor="RepayID">
                                Repay Amount
                            </InputLabel>
                            <OutlinedInput
                                label="Repay Amount"
                                value={repayAmountValue}
                                type="number"
                                max={redeemRow.loanAmount + (redeemRow.loanAmount * currentRow.borrowAPY)}
                                onChange={(e) => setRepayAmountValue(e.target.value)}
                                id="RepayID"

                            />
                        </FormControl>
                    </Typography>
                    <Button onClick={handleClose}>Close</Button>
                    <Button onClick={() => repayAmount(redeemRow)}>Repay</Button>

                </Box>
            </Modal>
        </React.Fragment>
    );
}
