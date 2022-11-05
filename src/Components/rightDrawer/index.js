import React from 'react';
import { Typography, Button, IconButton, Toolbar, Modal, AppBar, Avatar, Backdrop, Fade, Box } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../pages/staking/stakingList';
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
import StakeItem from '../../pages/staking/stakeItem';
import SupplyItem from '../../pages/lending/supplyItem';
import BorrowItem from '../../pages/lending/borrowItem';
const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    minWidth: 400,
    bgcolor: theme.contentBackGround,
    borderRadius: theme.cardBorderRadius,
    border: '0px solid transparent !important',
    boxShadow: 24,
};
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
        height: '35px  !important',
        width: '35px  !important',
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
        opacity: 0.5,
        filter: 'blur(4px)',

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
    console.log('rightdrawer params', params)

    const currentRow = params.currentRow || params.currentStake;
    const classes = useStyles();

    return (
        <React.Fragment key="RIGHT1">

            <Modal
                aria-labelledby="transition-modal-title"
                aria-describedby="transition-modal-description"
                open={params.drawerOpen}
                onClose={params.toggleDrawer}
                closeAfterTransition
                BackdropComponent={Backdrop}
                BackdropProps={{
                    timeout: 500,
                }}
            >
                <Fade in={params.drawerOpen}>
                    <Box sx={{
                        minWidth: { xs: '100%', md: theme.rightDrawerWidth },
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        // minWidth: 400,
                        height: { xs: 'auto'},

                        maxHeight: { xs: '100vh', md: 'auto' },
                        bgcolor: theme.headerBackground,
                        borderRadius: { xs: '0px', md: '15px' },
                        border: '0px solid transparent !important',
                        boxShadow: { xs: 0, md: 24 },
                       
                    }}
                    >


                        <AppBar key="rightbar"
                            position="relative"
                            className={classes.rightDrawerHeader}
                            sx={{height:{xs:'auto',md:'77px'}}}

                            color="primary"

                        >
                            <Toolbar variant="dense" sx={{
                                height:'100%',
                                opacity: 1,

                            }}>
                                <IconButton aria-label="open drawer" sx={{ display: { xs: 'block', md: 'none' } }} edge="start" onClick={params.toggleDrawer} >
                                    <ArrowBack color="primary" />
                                </IconButton>
                                <div style={{ display: 'flex', justifyContent: 'center',width:'100%' }}>
                                    <Avatar key="rightDrawerAvatar" aria-label="Recipe" className={classes.avatar}
                                        sx={{ marginRight: '10px' }}
                                    >
                                        <img className={classes.avatar} alt=""
                                            src={currentRow?.token?.icon} />
                                    </Avatar>
                                    <Typography variant="h5" >
                                        {params.Opration}
                                    </Typography>

                                </div>

                            </Toolbar>
                            <Typography variant="h6" className={classes.title}>
                                {params.title}
                            </Typography>
                        </AppBar>
                        {params.component === "staking" && (
                            <StakeItem input={params}></StakeItem>
                        )}

                        {params.component === "SupplyItem" && (
                            <SupplyItem input={params}></SupplyItem>
                        )}

                        {params.component === "borrowItem" && (
                            <BorrowItem input={params}></BorrowItem>
                        )}
                        {/* </Drawer> */}
                    </Box>
                </Fade>
            </Modal>
        </React.Fragment>
    );
}
