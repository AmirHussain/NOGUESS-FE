import React from 'react';
import { Grid, Box, Card, Switch, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles'
import theme from '../../theme'
import RightDrawer from '../../Components/rightDrawer';
import MarketItem from './marketItem';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { bigToDecimal, decimalToBigUints } from '../../utils/utils';
import { TokenContext } from '../../tokenFactory';
import Asset from '../../Components/asset';
import { AttachMoney } from '@mui/icons-material';
const useStyles = makeStyles({
    boxRoot: theme.boxRoot,
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
    root: {},
    boxRoot: theme.boxRoot,
    dividerRoot: {
        background: 'black',
    },
    lowMargin: {
        marginTop: '0px !important',
        marginBottom: '1px !important'
    },
    textMutedBold: theme.textMutedBold,
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
    textBold: theme.textBold
});

export default function Market() {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const [openAsset, setOpenAsset] = React.useState(false);

    const [currentRow, setCurrentRow] = React.useState(false);
    const SetAndOpenAsset = (row) => {
        setCurrentRow(row)
        setOpenAsset(true);
    };

    const handleCloseAsset = () => {
        setOpenAsset(false);
    };
    const { Tokens, TokenAggregators } = React.useContext(TokenContext);
    React.useEffect(() => {
        if (Tokens && Tokens.length && TokenAggregators && TokenAggregators.length) {
            getAllMarketDetails();
        }
    }, [Tokens, TokenAggregators]);

    const [currentMarket, setCurrentMarket] = React.useState([]);
    const getAllMarketDetails = async () => {
        if (Tokens && Tokens.length && TokenAggregators && TokenAggregators.length) {
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
            const aggregators = TokenAggregators?.map((aggtoken) => {
                const currentToken = Tokens.find(token => aggtoken.tokenAddress === token.address)
                if (currentToken) {
                    return {
                        aggregator: aggtoken.aggregator, tokenAddress: currentToken.address, decimal: decimalToBigUints(aggtoken.decimals.toString(), aggtoken.decimals > 9 ? 0 : 0)
                    }
                }
            });
            const data = await lendingContract.getCurrentLiquidity(
                aggregators
            );
            setCurrentMarket({
                totalSupply: Number(data[0]),
                totalDebt: Number(data[1]),
                totalVariableDebt: Number(data[3]),
                totalStableDebt: Number(data[2])
            })
        }
    }
    return (
        <Box >

            <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%', marginBottom: '10px' }}>

                <Grid item xs={12} sm={12} md={12} style={{ marginBottom: '10px' }}>

                    <Box elevation={3} className={classes.boxRoot} p={5} >
                        <Grid container spacing={1} style={{ width: '100%', }}>
                            <Grid item xs={12} sm={6} md={6} sx={{
                                textAlign: 'left',
                                borderRight: {
                                    xs: '0px solid '+theme.borderColor,
                                    sm: '0.5px solid '+theme.borderColor,

                                },
                                borderBottom: {
                                    xs: '0.5px solid '+theme.borderColor,
                                    sm: '0px solid '+theme.borderColor,

                                },
                            }}>
                                <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                                    Supply
                                </h4>
                                <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                                    <AttachMoney></AttachMoney>  {currentMarket?.totalSupply || 0}
                                </h3>
                            </Grid>
                            <Grid item xs={12} sm={6} md={6} style={{ textAlign: 'right' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <div>
                                        <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                                            Borrowed
                                        </h4>
                                        <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                                            <AttachMoney></AttachMoney>  {currentMarket?.totalDebt || 0}
                                        </h3>
                                    </div>
                                    <div>
                                        <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                                            On Variable Rate
                                        </h4>
                                        <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                                            <AttachMoney></AttachMoney>  {currentMarket?.totalVariableDebt || 0}
                                        </h3>
                                        <h4 className={classes.textMutedBold + ' ' + classes.lowMargin}>
                                            On Stable Rate
                                        </h4>
                                        <h3 style={{ display: 'inline-flex' }} className={classes.lowMargin}>
                                            <AttachMoney></AttachMoney>  {currentMarket?.totalStableDebt || 0}
                                        </h3>
                                    </div>
                                </div>

                            </Grid>
                        </Grid>
                    </Box>
                </Grid>

            </Grid>

            <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={2} style={{ width: '100%' }}>
                {Tokens?.map((row, index) => (
                    <Grid item xs={12} sm={12} md={12} key={index + "-card"} sx={{ cursor: 'pointer' }}>
                        <MarketItem row={row} SetAndOpenAsset={SetAndOpenAsset} ></MarketItem>
                    </Grid>
                ))}

            </Grid>
        </Box>
    );
}
