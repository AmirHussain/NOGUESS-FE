import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../Components/tiles';
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
import StakeItem from '../../pages/staking/stakeItem';
import SellItem from '../../pages/lending/sellItem';
import BorrowItem from '../../pages/lending/borrowItem';
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

export default function RightDrawer(params) {
    console.log(params)
    const classes = useStyles();
    return (
        <React.Fragment key="RIGHT1">
            <Button onClick={params.toggleDrawer}>RIGHT</Button>
            <Drawer key="right 2"
                className={classes.drawer}
                sx={{
                    width: { xs: '100%', md: theme.rightDrawerWidth },
                    '& .MuiDrawer-paper': {
                        boxSizing: 'border-box',
                        width: { xs: '100%', md: theme.rightDrawerWidth },
                    },
                }}
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='right'
                open={params.drawerOpen}
                onClose={params.toggleDrawer}>

                <AppBar key="rightbar"
                    position="relative"
                    className={classes.rightBar}
                    color="primary"

                >
                    <Toolbar variant="dense" sx={{ height: theme.headerHeight }}>
                        <IconButton aria-label="open drawer" edge="start" onClick={params.toggleDrawer} >
                            <ArrowBack color="primary" />
                        </IconButton>
                        <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                            sx={{ marginRight: '10px' }}
                        >
                            <img className="chainIcon" alt=""
                                src={params.icon} />
                        </Avatar>
                        <Typography variant="h6" className={classes.title}>
                            {params.title}
                        </Typography>
                    </Toolbar>
                </AppBar>
                {params.component === "staking" && (
                    <StakeItem input={params}></StakeItem>
                )}

                {params.component === "sellItem" && (
                    <SellItem input={params}></SellItem>
                )}

                {params.component === "borrowItem" && (
                    <BorrowItem input={params}></BorrowItem>
                )}
            </Drawer>
        </React.Fragment>
    );
}
