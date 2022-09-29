import React, { useContext, useState } from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input, Select, MenuItem, OutlinedInput, TableHead, Backdrop, Stack, Alert, AlertTitle } from '@mui/material';
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
import { TokenAggregators, Tokens } from '../../../token-icons';
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../utils/utils';
import { FluteAlertContext } from '../../../Components/Alert';
require('dotenv').config();
const MenuProps = {
    PaperProps: {
        style: {
            width: 250,
        },
    },
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
    textBold: theme.textBold
});

export default function BorrowItem(params) {
    console.log(params)
    const currentRow = params.input.currentRow
    const classes = useStyles();
    const [value, setValue] = React.useState('1');
    const [amount, setAmount] = useState("0.00");
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
        const ids = await lendingContract.getBorrowerId(currentRow?.token.symbol);
        debugger;
        if (ids && ids.length) {
            ids.forEach(async (id) => {
                const details = await lendingContract.getBorrowerDetails(id);
                const Borrow = {
                    ...details,
                    id,
                    repaid: details.hasRepaid,
                    startDay: bigToDecimal(details.borrowDay),
                    endDay: bigToDecimal(details.endDay),
                    loanAmount: bigToDecimal(details.loanAmount)
                }
                setBorrowDetails(current => [...current, Borrow]);
            });
        }


    }

    React.useEffect(() => {
        getBorrowDetailsFromContract()
    }, [])

    const startBorrow = async () => {
        try {

            setInProgress(true)
            const collateralToken = Tokens[collateral];
            const loanToken = currentRow.token;
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
            const result = await lendingContract.borrow(
                loanToken.symbol, decimalToBig(amount.toString()), loanToken.address,
                collateralToken.symbol, collateralToken.address, decimalToBig(colleteralAmount.toString()), { gasLimit: 1000000 }
            );

            settranxHash(result.hash);
            await result.wait(1)
            setAlert({ severity: 'success', title: 'Supply', description: 'Supply completed successfully' });


            setInProgress(false)
            params?.input?.toggleDrawer(true)
        } catch (err) {
            setAlert({ severity: 'error', title: 'Borrow', description: err.message });
            setInProgress(false)
            params?.input?.toggleDrawer(false)
        }

    }
    const repayAmount = async (row) => {
        try {
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

            const loanTokenContract = makeContract(currentRow.token.address, collateralToken.abi, signer);
            await loanTokenContract.approve(lendingContract.address, decimalToBig(row["loanAmount"]));
            setAlert({ severity: 'success', title: 'Aprroval', description: 'Approval of transaction performed successfully' });
            setAlert({ severity: 'info', title: 'Repay', description: 'Repay in progress' });
            const result = await lendingContract.repay(
                row['loanToken'], decimalToBig(row["loanAmount"]), currentRow.token.address,
                collateralToken.address, row.id, { gasLimit: 1000000 });
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
                const loanToken = currentRow.token;
                const collateralAggregators = TokenAggregators.find((aggregator) => aggregator.tokenSymbol === collateralToken.symbol);
                const loanAggregators = TokenAggregators.find((aggregator) => aggregator.tokenSymbol === loanToken.symbol);
                if (collateralAggregators && loanAggregators) {
                    setDecimals(collateralAggregators.decimals)
                    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
                    const loanBigUnitPriceInUSD = await lendingContract.getAggregatorPrice(loanAggregators.aggregator);
                    console.log('loanBigUnitPriceInUSD', loanBigUnitPriceInUSD);
                    const loanUnitPriceInUSD = ethers.utils.formatUnits(loanBigUnitPriceInUSD, loanAggregators.decimals);
                    console.log('loanUnitPriceInUSD', loanUnitPriceInUSD);
                    const totalLoanInUSD = Number(loanUnitPriceInUSD) * Number(amount);
                    console.log('totalLoanInUSD', totalLoanInUSD);
                    const collateralBigUnitPriceInUSD = await lendingContract.getAggregatorPrice(collateralAggregators.aggregator);
                    console.log('collateralBigUnitPriceInUSD', collateralBigUnitPriceInUSD);
                    const collateralUnitPriceInUSD = ethers.utils.formatUnits(collateralBigUnitPriceInUSD, loanAggregators.decimals);
                    console.log('collateralUnitPriceInUSD', collateralUnitPriceInUSD);
                    const totalCollateralInUSD = Number(loanUnitPriceInUSD) * Number(100) / 70;
                    console.log('totalCollateralInUSD', totalCollateralInUSD);
                    // let collateralValue = await lendingContract.getColateralAmount(loanAggregators.aggregator, collateralAggregators.aggregator, decimalToBig(amount));
                    console.log(totalCollateralInUSD, totalCollateralInUSD)
                    setColleteralAmount(totalCollateralInUSD)
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
                    fontSize: '11px',
                    fontStretch: 'semi-expanded'
                }}>
                    <div className="d-flexSpaceBetween">  <span>Borrow APY:</span> <span>{currentRow.calories}</span></div>
                    <div className="d-flexSpaceBetween"> <span>WALLET</span> <span>{currentRow.fat}</span></div>
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

                                    {/* Boxes */}
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl sx={{ m: 1, width: 300 }}>
                                            <InputLabel id="demo-multiple-checkbox-label">Collateral</InputLabel>
                                            <Select
                                                labelId="demo-multiple-checkbox-label"
                                                id="demo-multiple-checkbox"
                                                value={collateral}
                                                onChange={handleCollateralChange}
                                                input={<OutlinedInput label="Collateral" />}
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
                                                    !token.isPedgeToken && (
                                                        <MenuItem key={token} value={token}>
                                                            <img className="chainIcon" alt=""
                                                                src={Tokens[token].icon} />
                                                            <ListItemText primary={Tokens[token].name} />
                                                        </MenuItem>
                                                    )
                                                ))}
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <FormControl variant="outlined" sx={{ m: 1, width: 300 }}>
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
                                                            src={currentRow.token.icon} />
                                                    </Avatar>
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} sm={12} md={12}>
                                        <h4>  Amount to be collateralized {colleteralAmount}  / {availableAmount} {collateral}</h4>
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
                                            <TableCell>Amount</TableCell>
                                            <TableCell align="right">Start</TableCell>
                                            <TableCell align="right">End</TableCell>
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
                                                    {row.loanAmount}
                                                </TableCell>
                                                <TableCell align="right">{row.startDay}</TableCell>
                                                <TableCell align="right">{row.endDay}</TableCell>
                                                <TableCell align="right">{
                                                    !row.hasRepaid && (
                                                        <Button onClick={() => repayAmount(row)}>
                                                            Repay
                                                        </Button>
                                                    )
                                                }
                                                    {
                                                        row.hasRepaid && (
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


        </React.Fragment>
    );
}
