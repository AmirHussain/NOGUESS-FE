import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, Slide, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../Components/tiles';
import { ArrowBack, Close, Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const options = {
    title: {
        text: 'My chart'
    },
    series: [{
        data: [1, 2, 3]
    }]
}
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
    appBar: {

        zIndex: theme.drawerIndex + 1,
        background: theme.headerBackground,
        color: theme.headerText,
        fontStyle: 'bold',
    },
    innerCard: {
        display: 'block',
        padding: '14px'
    }


});

export default function Asset(params) {

    const classes = useStyles();

    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

    return (
        <React.Fragment key="RIGHT1">
            <Dialog
                fullScreen={fullScreen}
                fullWidth={fullScreen ? 'lg' : 'lg'}

                fullHeight={fullScreen ? 'lg' : 'lg'}
                maxWidth={'lg'}

                // sx={{ width: fullScreen ? '100%' : '80%', height: fullScreen ? '100%' : '80%' }}
                open={params.open} onClose={params.handleClose}>

                <AppBar
                    position="relative"
                    className={classes.appBar}
                    color="primary"
                >
                    <Toolbar variant="dense" sx={{
                        opacity: 1,
                        filter: 'drop-shadow(2px 4px 6px black)',
                        height: theme.headerHeight, marginbottom: '4px'
                    }}>


                        <IconButton aria-label="open drawer" edge="start" onClick={params.handleClose} >
                            {fullScreen ? <ArrowBack color="primary" /> : <Close color="primary" />}
                        </IconButton>


                        <Avatar key="assetAvatar" aria-label="Recipe"
                            sx={{ marginRight: '10px' }}
                        >
                            <img className="chainIcon" alt=""
                                src={params.icon} />
                        </Avatar>

                        <Typography variant="h6">
                            {params.title}
                        </Typography>

                    </Toolbar>


                </AppBar>
                <DialogContent
                    sx={{
                        height: `calc(100% - ${theme.headerHeight})`,
                        background: theme.contentBackGround,
                        fontSize: '12px'
                    }}
                >


                    <Grid container direction="row" justifyContent="start" alignItems="flex-start"
                        spacing={2} style={{ width: '100%' }}
                    >


                        <Grid item md={6} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Price</div>
                                    <div><b>$ 4.51</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Total Supply</div>
                                    <div><b>2 264 040.15 WAVES</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Total Borrowable Supply</div>
                                    <div><b>1 225 454.51 WAVES</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Total Non-Borrowable Collateral</div>
                                    <div><b>1 038 585.64 WAVES</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Total Locked Supply</div>
                                    <div><b>93 981.26 WAVES</b></div>
                                </div>
                                <Divider sx={{margin:'10px'}}></Divider>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Total Debt</div>
                                    <div><b>19 891.46 WAVES</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Current Utilization</div>
                                    <div><b>1.62%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Supply APR / APY</div>
                                    <div><b>3.6% / 3.66%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Lending APR</div>
                                    <div><b>0.06%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Leasing APR</div>
                                    <div><b>3.6% / 3.66%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Rewards APR
                                    </div>
                                    <div><b>0.06%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Vires Rewards for Locked Supply (1y), APR</div>
                                    <div><b>3.54%</b></div>
                                </div>
                                <Divider sx={{margin:'10px'}}></Divider>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Reserve address</div>
                                    <div><b> {'< 0.01%'}</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Asset ID</div>
                                    <div><b>3P8G747fnB1DTQ4d5uD114vjAaeezCW4FaM</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Borrow</div>
                                    <div><b>WAVES</b></div>
                                </div>

                            </Card>
                        </Grid>
                        {/* <Grid div md={2} xs={0}></Grid> */}
                        <Grid item md={6} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="text">
                                    <div className={classes.textHighlighted}>
                                        Interest Rate Model
                                    </div>
                                    <div className={classes.textMuted}><HighchartsReact
                                        highcharts={Highcharts}
                                        options={options}
                                    /></div></div>
                            </Card>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="text">
                                    <div className={classes.textHighlighted}>
                                        Stats
                                    </div>
                                    <div className={classes.textMuted}><HighchartsReact
                                        highcharts={Highcharts}
                                        options={options}
                                    /></div></div>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="text">
                                    <div className={classes.textHighlighted}>
                                        Borrow
                                    </div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Borrow APR</div>
                                    <div><b>3.94%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Collateral Factor</div>
                                    <div><b>70%
                                    </b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Liquidation Threshold</div>
                                    <div><b>70%
                                    </b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Liquidation Penalty</div>
                                    <div><b>50%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Protocol share</div>
                                    <div><b>10%

                                    </b></div>
                                </div>
                            </Card>
                        </Grid>
                        <Grid item md={6} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="text">
                                    <div className={classes.textHighlighted}>
                                        Adaptive Limits
                                    </div>
                                    <div className={classes.textMuted}>
                                        No Limits
                                    </div></div>
                            </Card>
                        </Grid>
                    </Grid>
                </DialogContent>
            </Dialog>
        </React.Fragment >
    );
}