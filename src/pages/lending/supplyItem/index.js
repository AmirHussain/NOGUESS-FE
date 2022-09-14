import React, { useContext, useState } from 'react';
import { Box, Card, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';
import { abis, asyncContractCall, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3Provider, Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';

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
    const { connect } = useContext(Web3ProviderContext);
    const [tranxHash, settranxHash] = useState('');

    const startSupply = async () => {
        const { provider, signer } = await connect();
        const multiSaleContract = makeContract('0x9fe46736679d2d9a65f0992f2272de9f3c7fa6e0', abis.lending, signer);
        const result = await multiSaleContract.withdraw();
        settranxHash(result.hash);
        const waitResult = await result.wait(12);

    }
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
                    <div className="d-flexSpaceBetween">  <span>SUPPLY APY:</span> <span>{currentRow.calories}</span></div>
                    <div className="d-flexSpaceBetween"> <span>WALLET</span> <span>{currentRow.fat}</span></div>
                </Card>
                <div className={classes.sectionHeading}>
                    Supply Now
                </div>
                <Card key="form" className={classes.innerCard} sx={{ display: 'block !important', padding: '10px', paddingTop: '15px' }}>
                    <FormControl variant="standard">
                        <InputLabel htmlFor="input-with-icon-adornment">
                            Supply Requested
                        </InputLabel>
                        <Input
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
                                        src={currentRow.icon} />
                                </Avatar>
                            }
                        />
                    </FormControl>

                    <div><p sx={{ fontSize: '11px' }}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                </Card>
            </Box>

            <Toolbar variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight, background: theme.headerBackground }}>
                <Button variant="contained" onClick={startSupply}>Supply</Button>
            </Toolbar>

        </React.Fragment>
    );
}
