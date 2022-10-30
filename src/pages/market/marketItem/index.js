import React, { useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Button, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { bigToDecimal } from '../../../utils/utils';
import moment from 'moment';


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
    textMuted: theme.textMuted,
    cardContent: theme.cardContent,
    walletConnect: theme.walletConnect,
    actionButton: theme.actionButton2
});

export default function Marketitem(props) {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const [row, setRow] = useState({});
    const openDrawer = (row) => {
        row.token = { icon: row.token?.icon, address: row.token?.token_address, symbol: row.token?.token_symbol }
        props.openDrawer(row);
    }

    const SetAndOpenAsset = (row) => {
        props.SetAndOpenAsset(row)
    };


    React.useEffect(() => {
        setRow(props.row)
        console.log('row', props.row)

    }, [props.row, provider])
    return (
        <Card className={classes.card} onClick={() => SetAndOpenAsset(row)}>
            <CardHeader onClick={() => SetAndOpenAsset(row)}
                sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '0px', paddingBottom: '10px', borderBottom: '1px solid #9597A1' }}
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
            <CardContent className={classes.cardContent} >
                <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left' }}>
                    <Grid item xs={3} sm={3} md={3}  >
                        <div className={classes.textMuted}>
                            Total Supply
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                            $12,1231M
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
                            {row.apy}%
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
                            $12,1231M
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                            $0.12M FToken
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}  >
                        <div className={classes.textMuted}>
                            Borrow APY
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                            0.0%
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                        0.0% FToken
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}  >
                        <div className={classes.textMuted}>
                            collateral Factor
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                            0.0%
                        </div>
                    </Grid>
                    <Grid item xs={3} sm={3} md={3}  >
                        <div className={classes.textMuted}>
                            Price
                        </div>
                        <div sx={{ color: theme.lightText, fontWeight: 600 }}>
                            0.0%
                        </div>
                    </Grid>

                </Grid>
            </CardContent>
        </Card>

    );
}
