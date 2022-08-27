import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme'
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

export default function StakeItem(params) {
    console.log(params)
    const currentStake = params.input.currentStake
    const classes = useStyles();
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
                    overflow:'auto'

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
                    <div className="d-flexSpaceBetween">  <span>APR IN REWARD:</span> <span>{currentStake.apr}</span></div>
                    <div className="d-flexSpaceBetween"> <span>STAKING CYCLE</span> <span>{currentStake.sc}</span></div>
                    <div className="d-flexSpaceBetween"> <span>START TIME:</span><span>{currentStake.st}</span></div>
                    <div className="d-flexSpaceBetween"> <span>YOUR BALANCE</span><span>{currentStake.b}</span></div>
                </Card>
                <div className={classes.sectionHeading}>
                    Summary
                </div>
                <Card key="form" className={classes.innerCard} sx={{ display: 'block !important', padding: '10px', paddingTop: '15px' }}>
                    <TextField
                        required
                        id="outlined-required"
                        label="Lock Amount"
                        defaultValue="0"
                        sx={{ width: '100%' }}
                    />

                    <div><p sx={{ fontSize: '11px'}}>Minimum: <b>10 BNB</b> Maximum: <b>500BNB</b></p></div>
                </Card>
            </Box>

            <Toolbar variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight, background: theme.headerBackground }}>
                <Button variant="contained">Confirm Purchase</Button>
            </Toolbar>

        </React.Fragment>
    );
}
