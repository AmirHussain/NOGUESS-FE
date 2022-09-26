import React, { useContext, useState } from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input, Select, MenuItem, OutlinedInput, TableHead } from '@mui/material';
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
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../contracts/utils';
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
            const collateralToken = Tokens[collateral];
            const loanToken = currentRow.token;
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const collateralContract = makeContract(collateralToken.address, collateralToken.abi, signer);
            const collateralAggregators = TokenAggregators.find((aggregator) => aggregator.collatralToken === collateralToken.symbol);
            const loanAggregators = TokenAggregators.find((aggregator) => aggregator.collatralToken === loanToken.symbol);
            let collateralValue = await lendingContract.getColateralAmount(loanAggregators.collateralAggregator, collateralAggregators.collateralAggregator, decimalToBig(amount ));
            console.log("colletaralAmount =>",collateralValue)
            await collateralContract.approve(lendingContract.address, collateralValue)
            const result = await lendingContract.borrow(
                loanToken.symbol, ethers.utils.parseEther(amount), loanToken.address,
                collateralToken.symbol, collateralToken.address, collateralValue, { gasLimit: 1000000 }
            );

            settranxHash(result.hash);
            await result.wait(1)
            alert('borrow amount')
            params?.input?.toggleDrawer(true)
        } catch (err) {
            alert('error occured' + err.message)
            params?.input?.toggleDrawer(false)
        }

    }
    const repayAmount = async (row) => {
        try {
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const tokenKeys=Object.keys(Tokens);
            let collateralToken;
            tokenKeys.forEach((key)=>{
               if( Tokens[key].symbol===row.collateralToken){
                collateralToken=Tokens[key];
               }
            });           
         
            const collateralContract = makeContract(collateralToken.address, collateralToken.abi, signer);
            await collateralContract.approve(lendingContract.address, decimalToBig(row["loanAmount"]));
            const result = await lendingContract.repay(
                row['loanToken'],decimalToBig(row["loanAmount"]), currentRow.token.address,
                collateralToken.address, row.id, { gasLimit: 1000000 });
            await result.wait(1)
            params?.input?.toggleDrawer(true)

        } catch (err) {
            alert('error occured' + err.message)
            params?.input?.toggleDrawer(true)
        }

    }

    const setCollateralAmountOfToken = async () => {
        try {
            if (amount && collateral) {
                const collateralToken = Tokens[collateral];
                const loanToken = currentRow.token;
                const collateralAggregators = TokenAggregators.find((aggregator) => aggregator.collatralToken === collateralToken.symbol);
                const loanAggregators = TokenAggregators.find((aggregator) => aggregator.collatralToken === loanToken.symbol);
                if (collateralAggregators && loanAggregators) {
                    setDecimals(collateralAggregators.decimals)
                    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
                    let collateralValue = await lendingContract.getColateralAmount(loanAggregators.collateralAggregator, collateralAggregators.collateralAggregator, decimalToBig(amount ));
                    console.log(collateralValue,bigToDecimal(collateralValue))
                    setColleteralAmount(bigToDecimal(collateralValue).toString())
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
                    display: 'block !important', padding: '10px',
                    fontSize: '11px',
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
                                                    <MenuItem key={token} value={token}>
                                                        <img className="chainIcon" alt=""
                                                            src={Tokens[token].icon} />
                                                        <ListItemText primary={Tokens[token].name} />
                                                    </MenuItem>
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
                                        Amount to be collateralized {colleteralAmount/Math.pow(10, 18)}  / {availableAmount} {collateral}
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
