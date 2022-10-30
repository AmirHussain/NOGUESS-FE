import React from 'react';
import { Grid, Box, Card, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles'
import theme from '../../theme'
import RightDrawer from '../../Components/rightDrawer';
import MarketItem from './marketItem';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { bigToDecimal } from '../../utils/utils';
import { TokenContext } from '../../tokenFactory';
import Asset from '../../Components/asset';
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
    const { Tokens } = React.useContext(TokenContext);
    React.useEffect(() => {
    }, [Tokens]);
    return (
        <Box >

                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%', marginBottom:'10px' }}>


                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div className="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Total Assets</div></div>
                            <div className="image"></div>
                        </Card>
                    </Grid>
                    {/* <Grid div md={2} xs={0}></Grid> */}
                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div className="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Average APR</div></div>
                            <div className="image"></div>
                        </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div className="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Est. Reward Accrued</div></div>
                            <div className="image"></div>
                        </Card>
                    </Grid>
                </Grid>

                <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={2} style={{ width: '100%' }}>
                    {Tokens.map((row, index) => (
                        <Grid item xs={12} sm={12} md={12} key={index + "-card"} sx={{cursor:'pointer'}}>
                            <MarketItem row={row} SetAndOpenAsset={SetAndOpenAsset} ></MarketItem>
                        </Grid>
                    ))}
                    {currentRow && (
                        <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>

                    )}
                </Grid>
        </Box>
    );
}
