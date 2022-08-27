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
    avatar: {
        position: 'absolute  !important',
        top: '100px  !important',
        height: '52px  !important',
        width: '52px  !important',
        borderRadius: '4px !important',
    },
    rightDrawerHeader: theme.rightDrawerHeader,
    textHighlighted: theme.textHighlighted,
    sectionHeading: theme.sectionHeading,
    textMutedBold: theme.textMutedBold,
    textMuted: theme.textMuted,
    innerCard: theme.innerCard,
    modal: theme.modal,
    drawer: theme.drawer,
    drawerPaper: theme.rightDrawerPaper,
    textBold: theme.textBold,
    toolbarHeaderBackground: {
        position: 'absolute',
        height: '132px',
        width: '100%',
        display: 'block',
        zIndex: '13',
        opacity: 0.2,
        backgroundPosition: 'center',
        backgroundImage: '',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat',
        filter: 'blur(4px)',
        background: 'url(https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3)'

    },
    backgroundImage: {
        backgroundPosition: 'center',
        backgroundSize: '100%',
        backgroundRepeat: 'no-repeat'
    },
    title: {
        position: 'absolute',
        top: '96px',
        left: '80px',
    }
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
                <div className={classes.toolbarHeaderBackground}
                    sx={{}}
                >
                    {/* <img className={classes.backgroundImage} alt=""  src={params.icon} /> */}

                </div>
                <AppBar key="rightbar"
                    position="relative"
                    className={classes.rightDrawerHeader}
                    sx={{}}

                    color="primary"

                >
                    <Toolbar variant="dense" sx={{
                        opacity: 1,
                        filter: 'drop-shadow(2px 4px 6px black)',
                        height: theme.headerHeight, marginbottom: '4px'
                    }}>
                        <IconButton aria-label="open drawer" edge="start" onClick={params.toggleDrawer} >
                            <ArrowBack color="primary" />
                        </IconButton>
                        <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                            sx={{ marginRight: '10px' }}
                        >
                            <img className="chainIcon" alt=""
                                src={params.icon} />
                        </Avatar>
                        <Typography variant="h4" >
                            {params.Opration}
                        </Typography>

                    </Toolbar>
                    <Typography variant="h6" className={classes.title}>
                        {params.title}
                    </Typography>
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
