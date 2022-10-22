import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../Components/stakingOptions';
import { Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
import RightDrawer from '../../Components/rightDrawer';
import StakingOptions from '../../Components/stakingOptions';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { bigToDecimal } from '../../utils/utils';
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

export default function Staking() {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const [stakingOptions, setStakingOptions] = React.useState({});
    const getStakingOptions = async () => {
        if (!provider) {
            return []
        }
        setLoadingStakingOption(true)
        const stakingOfferingContract = makeContract(contractAddresses.stakingOfferings, abis.stakingOfferings, signer);
        const rows = await stakingOfferingContract.GetAllStakingOptions();
        transformAndSetStakingOptions(rows)
        setLoadingStakingOption(false)
    }

    const transformAndSetStakingOptions = (rows) => {
        const tRows = [];
        if (rows && rows) {
            rows.forEach((row) => {
                // address token_address;
                // string token_image;
                // string token_symbol;
                // string token_name;
                tRows.push({
                    staking_contract_address: row.staking_contract_address,
                    staking_token: {
                        token_name: row.staking_token.token_symbol,
                        token_address:
                            row.staking_token.token_address,
                        token_image:
                            row.staking_token.token_image,
                        token_symbol:
                            row.staking_token.token_symbol
                    },
                    reward_token: {
                        token_name: row.reward_token.token_symbol,
                        token_address:
                            row.reward_token.token_address,
                        token_image:
                            row.reward_token.token_image,
                        token_symbol:
                            row.reward_token.token_symbol
                    },
                    staking_start_time: new Date().toISOString(),
                    staking_duration: bigToDecimal(row.staking_duration),
                    isActive: row.isActive,
                    isExpired: row.isExpired,
                    apy: bigToDecimal(row.apy),
                })

            })

        }
        setStakingOptions(tRows)
    }

    const [currentStake, setCurrentStake] = React.useState({});
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const OpenDrawer = (row) => {
        toggleDrawer();
        setCurrentStake(row);
    }
    const [loadingStakingOption, setLoadingStakingOption] = React.useState(true);


    React.useEffect(() => {
        getStakingOptions()
    }, [provider]);
    return (
        <Box >

            <div >
                <div className={classes.sectionHeading}>
                    Overview
                </div>
                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>


                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div className="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Your Total Assets Staked</div></div>
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
                <div className="d-flex-evenly marginTop" sx={{ alignItems: 'baseline', textAlign: 'left', marginTop: '10px' }} >
                    <div className={classes.sectionHeading} md={4}>
                        Staking Programs
                    </div>

                    <div className={classes.textMutedBold} md={6}>
                        Choose from the programs below to deposit your assets and receive corresponding rewards to the staking program
                    </div>

                    <div className={classes.textBold} md={2} sx={{ textAlign: 'right' }}>
                        Show all active
                        <Switch></Switch>
                    </div>

                </div>
                {!loadingStakingOption && (
                    <StakingOptions stakingOptions={stakingOptions} action={OpenDrawer} />
                )

                }
                {loadingStakingOption && (
                    <h5>Loading Options</h5>
                )

                }
            </div>
            <div>

            </div>
            {drawerOpen && (
                <RightDrawer Opration="Staking" component="staking" currentStake={currentStake} icon={currentStake.icon} title={currentStake.name} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
            )}
        </Box>
    );
}
