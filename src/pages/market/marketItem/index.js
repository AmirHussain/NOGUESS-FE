import React, { useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Button, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { bigToDecimal, bigToDecimalUints, decimalToBig } from '../../../utils/utils';
import moment from 'moment';
import { TokenContext } from '../../../tokenFactory';
import { getAPY } from '../../../utils/common';
import { NavLink } from 'react-router-dom';
import { routes } from '../../../routes';


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
        height: '30px  !important',
        width: '30px  !important',
    },
    link: {
        cursor: 'pointer !important',
        zIndex: 100,
        textDecoration: 'none  !important', color: 'inherit  !important',
        "&:hover": {
            background: theme.hoverBackground,
            "& $card": {
                background: theme.hoverBackground,
                "& $cardContent": {
                    background: theme.hoverBackground
                }
            },

        }
    },
    textMuted: theme.textMuted,
    cardContent: theme.cardContent,
    walletConnect: theme.walletConnect,
    actionButton: theme.actionButton2
});

export default function Marketitem(props) {
    const classes = useStyles();
    const details = {}
    const [tokenSummary, setTokenSummary] = React.useState({});
    const [tokendetails, setTokendetails] = React.useState({});
    const [row, setRow] = useState({});
    const { provider, signer,connectWallet,connect } = React.useContext(Web3ProviderContext);
    const { getTokenProperties, IntrestRateModal, TokenBorrowLimitations } = React.useContext(TokenContext);


    React.useEffect(() => {
        if(props.row){
            getData(props);
        }

    }, [row])

    React.useEffect(() => {
    }, [tokenSummary]); // Empty array means to only run once on mount.

    const openDrawer = (row) => {
        row.token = { icon: row.token?.icon, address: row.token?.token_address, symbol: row.token?.token_symbol }
        props.openDrawer(row);
    }

    const SetAndOpenAsset = (row) => {
        props.SetAndOpenAsset(row)
    };


    const getData = async (p)=>{
        await connect();
       setRow(p.row)
       getTokenDetails(p.row.address)

    }

    const getTokenDetails = async (address) => {
        if (address) {
            const details = getTokenProperties(address);
            setTokendetails(details);
            await getAndSetTokenMarketDetails(details)
        }




    }


    const getPrice = async (tokendetails, lendingContract) => {
        if (tokendetails.aggregator) {
            const result = await lendingContract.getAggregatorPrice(tokendetails?.aggregator?.aggregator);
            const priceInUSD = Number(result) / Math.pow(10, tokendetails?.aggregator?.decimals);

            details['priceInUSD'] = priceInUSD
            setTokenSummary({ ...tokenSummary, ...details })
            return priceInUSD
        }

    }

    const setUratio = async (tokendetails, lendingContract) => {
        if (tokendetails.aggregator) {
            const uratio = await lendingContract._utilizationRatio(tokendetails.token.address);

            details['uratio'] = bigToDecimalUints(uratio, 2) * 100
            setTokenSummary({ ...tokenSummary, ...details })

            return uratio
        }
    }
    const setTokenMarketDetails = async (tokendetails, lendingContract, priceInUSD) => {

        const result = await lendingContract.getTokenMarketDetails(tokendetails?.token?.address);


        details['lendings'] = bigToDecimal(result[0])
        details['reserve'] = bigToDecimal(result[1])
        details['totalDebt'] = bigToDecimal(result[2])
        details['totalVariableDebt'] = bigToDecimal(result[3])
        details['totalStableDebt'] = bigToDecimal(result[4])

        details['lendingsInUSD'] = priceInUSD > 0 ? bigToDecimal(result[0]) * priceInUSD : 0;
        details['reserveInUSD'] = priceInUSD > 0 ? bigToDecimal(result[1]) * priceInUSD : 0;
        details['totalDebtInUSD'] = priceInUSD > 0 ? bigToDecimal(result[2]) * priceInUSD : 0;
        details['totalVariableDebtInUSD'] = priceInUSD > 0 ? bigToDecimal(result[3]) * priceInUSD : 0;
        details['totalStableDebtInUSD'] = priceInUSD > 0 ? bigToDecimal(result[4]) * priceInUSD : 0;

        setTokenSummary({ ...tokenSummary, ...details })


    }
    const setSupplyAPR = async (tokendetails, lendingContract) => {
        if (tokendetails.aggregator) {
            const supplyAPR = await lendingContract.calculateCurrentLendingProfitRate(
                tokendetails.token.address,
                IntrestRateModal
            );

            details['supplyAPR'] = bigToDecimalUints(supplyAPR, 2) * 100
            details['supplyAPY'] = getAPY(bigToDecimalUints(supplyAPR, 2)) * 100

            setTokenSummary({ ...tokenSummary, ...details })

        }
    }
    const setBorrowRates = async (tokendetails, lendingContract, uratioInBig) => {
        if (tokendetails?.token) {
            const borrowRatesResult = await lendingContract.getCurrentStableAndVariableBorrowRate(uratioInBig, IntrestRateModal);
            const borrowAPR = await lendingContract.getOverallBorrowRate(
                tokendetails.token.address, borrowRatesResult[0], borrowRatesResult[1]
            );

            details['borrowAPR'] = bigToDecimalUints(borrowAPR, 2) * 100
            details['borrowAPY'] = getAPY(bigToDecimalUints(borrowAPR, 2)) * 100
            setTokenSummary({ ...tokenSummary, ...details })

        }
    }
    const getAndSetTokenMarketDetails = async (tokendetails) => {
        const {signer} = await connectWallet();
        const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);

        const priceInUSD = await getPrice(tokendetails, lendingContract)
        setTokenMarketDetails(tokendetails, lendingContract, priceInUSD)
        setSupplyAPR(tokendetails, lendingContract)
        const uratioInBig = await setUratio(tokendetails, lendingContract)
        setBorrowRates(tokendetails, lendingContract, uratioInBig)
    }


    return (
        <NavLink className={classes.link} to={{ pathname: routes.asset + '/' + row.address }} >

            <Card className={classes.card} sx={{ padding: '24px' }}>
                <CardHeader onClick={() => SetAndOpenAsset(row)}
                    sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '0px', paddingBottom: '10px', borderBottom: '0.5px solid ' + theme.borderColor }}
                    avatar={
                        <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                            <img className={classes.avatar} alt=""
                                src={row?.icon} />
                        </Avatar>
                    }
                    // color: theme.lightText
                    title={
                        <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" gutterBottom>

                            {row?.name}</Typography>}

                />
                <CardContent className={classes.cardContent} sx={{ paddingLeft: '0px', paddingRight: '0px' }}>
                    <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left' }}>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Total Supply
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $  {tokenSummary?.lendingsInUSD ? parseFloat(tokenSummary?.lendingsInUSD || 0).toFixed(5) : 0}
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $0.12M FToken
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Suppy APY
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                {tokenSummary?.supplyAPY ? parseFloat(tokenSummary?.supplyAPY || 0).toFixed(5) : 0}%
                            </div>
                        </Grid>

                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Liquidity
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $123M
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Total Borrow
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $ {tokenSummary?.totalDebtInUSD ? parseFloat(tokenSummary?.totalDebtInUSD || 0).toFixed(5) : 0}
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $ {tokenSummary?.totalDebtInUSD ? parseFloat(tokenSummary?.totalDebtInUSD || 0).toFixed(5) : 0}
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Borrow APY
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                {tokenSummary?.borrowAPY ? parseFloat(tokenSummary?.borrowAPY || 0).toFixed(5) : 0}%
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                {tokenSummary?.borrowAPY ? parseFloat(tokenSummary?.borrowAPY || 0).toFixed(5) : 0}%
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                collateral Factor
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                {tokendetails?.borrowLimitation?.CollateralFator}%
                            </div>
                        </Grid>
                        <Grid item xs={3} sm={3} md={3}  >
                            <div className={classes.textMuted}>
                                Price
                            </div>
                            <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                                $ {tokenSummary?.priceInUSD ? parseFloat(tokenSummary?.priceInUSD || 0).toFixed(5) : 0}
                            </div>
                        </Grid>

                    </Grid>
                </CardContent>
            </Card>
        </NavLink>


    );
}
