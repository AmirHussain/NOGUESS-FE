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
import { TokenContext } from '../../../tokenFactory';
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../utils/utils';
import { FluteAlertContext } from '../../../Components/Alert';
import moment from 'moment';
import { getAPY } from '../../../utils/common';
import { TransformIntrestRateModel } from '../../../utils/userDetails';
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
    const { IntrestRateModal, TokenAggregators, TokenBorrowLimitations, Tokens, getToken } = React.useContext(TokenContext);

    const { signer, account } = useContext(Web3ProviderContext);
    const [txHash, settxHash] = useState('');
    const [collateral, setCollateral] = useState('');

    const [collateralToken, setCollateralToken] = useState({});
    const [decimals, setDecimals] = useState(0);
    const { setAlert } = useContext(FluteAlertContext);
    const [inProgress, setInProgress] = useState(false);

    const [colleteralAmount, setCollateralAmount] = useState();
    const [availableAmount, setAvailableAmount] = useState(0);



    const handleCollateralChange = (event) => {
        const {
            target: { value },
        } = event;
        setCollateral(
            value
        );
        setCollateralToken(Tokens.find(token => token.address === value))
    };

    const [borrowDetails, setBorrowDetails] = useState([]);


    const getBorrowDetailsFromContract = async () => {
        setBorrowDetails([])
        if (!signer) {
            return

        }
        const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
        const ids = await lendingContract.getBorrowerId(currentToken.symbol);
        console.log('ids', ids)
        if (ids && ids.length) {
            ids.forEach(async (id) => {
                const details = await lendingContract.getBorrowerDetails(id);
                const Borrow = {
                    ...details,
                    id,
                    repaid: details.hasRepaid,
                    startDay: formatDate(Number(details.borrowDay)),
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
        let index = -1;
        try {

            setInProgress(true)
            const loanToken = currentToken;
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const collateralContract = makeContract(collateralToken.address, collateralToken.abi, signer);
            await setCollateralAmountOfToken()

            index = setAlert({ severity: 'info', title: 'Approval', description: 'Approval of transaction in progress' });
            const loanTokenTuple = await getToken(loanToken.address);
            const collateralTokenTuple = await getToken(collateralToken.address);
            const approvalResponse = await collateralContract.approve(lendingContract.address, decimalToBig(colleteralAmount.toString()))
            setAlert({ severity: 'success', title: 'Approval', description: 'Approval of transaction completed successfully', txhash: approvalResponse.hash }, index);

            index = setAlert({ severity: 'info', title: 'Borrow', description: 'Borrow in progress' });
            console.log('Borrow Params', loanToken.symbol, decimalToBig(amount.toString()), loanToken.address,
                collateralToken.symbol, collateralToken.address, decimalToBig(colleteralAmount.toString()), { gasLimit: 1000000 }
            )
            console.log(currentRow.borrowAPY || '0')
            const result = await lendingContract.borrow(
                loanTokenTuple,
                collateralTokenTuple,
                decimalToBig(amount.toString()),
                decimalToBig(colleteralAmount.toString()),
                decimalToBig(currentRow.borrowAPY.toString() || '0'), stableRate, { gasLimit: 1000000 }
            );
            setAlert({ severity: 'info', title: 'Borrow', description: 'Borrow in progress', txhash: result.hash }, index);

            await result.wait(1)
            setAlert({ severity: 'success', title: 'Borrow', description: 'Borrow completed successfully', txhash: result.hash }, index);

            setInProgress(false)
            params?.input?.toggleDrawer(true)
        } catch (err) {
            setAlert({ severity: 'error', title: 'Borrow', error: err }, index);
            setInProgress(false)
            params?.input?.toggleDrawer(false)
        }

    }

    const [redeemRow, setRedeemRow] = React.useState({});
    const [open, setOpen] = React.useState(false);
    const handleOpen = (event) => {
        setRedeemRow(event)
        console.log('redeemRow', event)
        setOpen(true);
        setRepayAmountValue(event.loanAmount + (event.loanAmount * event.borrowAPY))
    };
    const handleClose = () => {
        setOpen(false);
    };

    const repayAmount = async (row) => {
        let index = -1;
        try {
            handleClose()
            setInProgress(true)
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            let currentCollateralToken;
            Tokens.forEach((token) => {
                if (token.symbol === row.collateralToken) {
                    currentCollateralToken = token;
                }
            });
            index = setAlert({ severity: 'info', title: 'Aprroval', description: 'Approval of transaction in progress' });

            const loanTokenContract = makeContract(currentToken.address, currentCollateralToken.abi, signer);
            const approvalResponse = await loanTokenContract.approve(lendingContract.address, decimalToBig(repayAmountValue.toString()));
            setAlert({ severity: 'success', title: 'Aprroval', description: 'Approval of transaction performed successfully', txhash: approvalResponse.hash }, index);
            index = setAlert({ severity: 'info', title: 'Repay', description: 'Repay in progress' });
            const result = await lendingContract.repay(
                row['loanToken'], decimalToBig(repayAmountValue.toString()), currentToken.address,
                currentCollateralToken.address, row.id, IntrestRateModal, { gasLimit: 1000000 });
            setAlert({ severity: 'info', title: 'Repay', description: 'Repay in progress', txhash: result.hash }, index);
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Repay', description: 'Repay completed successfully', txhash: result.hash }, index);

            setInProgress(false)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            setInProgress(false)
            setAlert({ severity: 'error', title: 'Repay', error: err }, index);
            params?.input?.toggleDrawer(true)
        }

    }

    const setCollateralAmountOfToken = async () => {
        try {
            if (amount && collateral) {
                const loanToken = currentToken;
                const collateralAggregators = TokenAggregators.find((aggregator) => aggregator.tokenAddress === collateralToken.address);
                const loanAggregators = TokenAggregators.find((aggregator) => aggregator.tokenAddress === loanToken.address);
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

                    setCollateralAmount(collateralUnits)
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
                    height: { xs: theme.modalXsMidContainerHeight, md: 'auto' },
                    maxHeight: { xs: theme.modalXsMidContainerMaxHeight, md: theme.modalMdMidContainerMaxHeight },
                    minWidth: { xs: '100%', md: '30vw' },
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
                    background: theme.TabsBackground,
                    color: theme.lightText + ' !important',
                    fontSize: '11px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>Borrow APY:</span> <span>{parseFloat(getAPY(currentRow?.borrowAPY) * 100).toFixed(3)} %</span></div>
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

                                    background: theme.TabsBackground,
                                    color: theme.lightText,
                                    display: 'block !important', padding: '10px', paddingTop: '15px', marginBottom: '10px'
                                }}>

                                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>

                                    <Grid item xs={12} sm={6} md={12} style={{ color: theme.lightText + ' !important' }}>
                                        <FormControl variant="outlined" style={{ m: 1, width: '100%', color: theme.lightText + ' !important' }}>
                                            <InputLabel htmlFor="input-with-icon-adornment" sx={{ color: theme.lightText + ' !important' }}>
                                                Borrow Requested
                                            </InputLabel>

                                            <OutlinedInput
                                                label="Borrow Requested"
                                                value={amount}
                                                type="number"
                                                sx={{
                                                    color: theme.lightText + ' !important',
                                                    padding: '6px'
                                                }}
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

                                        <Typography sx={{ fontSize: 12, color: theme.lightText }} variant="h4" gutterBottom>

                                            <FormControl sx={{ width: '100%', color: theme.lightText + ' !important' }}>
                                                <InputLabel sx={{ color: theme.lightText + ' !important' }} id="demo-multiple-checkbox-label">Select Collateral</InputLabel>
                                                <Select
                                                    labelId="demo-multiple-checkbox-label"
                                                    id="demo-multiple-checkbox"
                                                    value={collateralToken?.name}
                                                    onChange={handleCollateralChange}
                                                    input={<OutlinedInput label="Select Collateral" />}
                                                    renderValue={(selected) => collateralToken?.name}
                                                    MenuProps={MenuProps}
                                                    sx={{
                                                        color: theme.lightText + ' !important',
                                                        padding: '6px'
                                                    }}
                                                    startAdornment={
                                                        <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                                                            sx={{
                                                                marginRight: '10px', margin: '4px',
                                                                width: '27px',
                                                                height: '27px'
                                                            }}
                                                        >
                                                            <img className="chainIcon" alt=""
                                                                src={collateralToken?.icon} />
                                                        </Avatar>} >
                                                    {Tokens?.map((token) => (
                                                        !token.isPedgeToken &&
                                                        token.address !== currentToken.address && (
                                                            <MenuItem key={token.name} value={token.address}>
                                                                <img className="chainIcon" alt=""
                                                                    src={token.icon} />
                                                                <ListItemText primary={token.name} />
                                                            </MenuItem>
                                                        )
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Typography>
                                        <Typography variant="p" sx={{ display: 'flex', justifyContent: 'space-between' }} gutterBottom>
                                            <div> Amount to be collateralized </div>
                                            <div>{parseFloat(colleteralAmount || 0).toFixed(5)} {collateralToken?.symbol}</div>
                                        </Typography>
                                        <Typography variant="p" sx={{ display: 'flex', justifyContent: 'space-between' }} gutterBottom>
                                            <div> Available amount </div>
                                            <div>{parseFloat(availableAmount || 0).toFixed(5)} {collateralToken?.symbol}</div>
                                        </Typography>

                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                                    </Grid>
                                </Grid>

                            </Card>


                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button sx={{ width: "100%", borderRadius: theme.cardBorderRadius, minHeight: '45px', fontWeight: '600' }} variant="contained" onClick={startBorrow} >Borrow</Button>
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
                                        {borrowDetails?.map((row) => (
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
                    <Typography id="transition-modal-title" variant="p" >
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
