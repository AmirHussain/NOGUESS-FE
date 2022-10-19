import React, { useEffect, useRef } from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, Slide, useMediaQuery } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../Components/tiles';
import { ArrowBack, Close, Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Web3ProviderContext } from '../walletConnect/walletConnect';
import { TokenContext } from '../../tokenFactory';
import { bigToDecimal, bigToDecimalUints,  decimalToBigUints } from '../../utils/utils';
import { getAPY } from '../../utils/common';
let currentUtilization=0
let currentSupplyAPR=0

let currentBorrowAPR=0
const options = {

    title: {
        text: 'Intrest Rate Modal'
    },
    tooltip: {
        split: false,
              backgroundColor: 'black',
              borderColor: 'green',
              borderWidth:3,
              borderRadius: 3,
              style: {
                  color: 'white'
              },
        formatter: function() {
          if(this.series
            &&this.series.chart
            &&this.series.chart.options
            &&this.series.chart.options.series&&
            this.series.chart.options.series.length){
                return `
                Utilization: ${this.point.x  } % <br>
                Supply APR: ${this.series.chart.options.series[0].data[this.point.x ]} % <br>
                Borrow APR: ${this.series.chart.options.series[1].data[this.point.x ]} % <br><hr>
                Current Utilization / Supply / Borrow <br>
                 ${parseFloat(currentUtilization||0).toFixed(2)} % /${parseFloat(currentSupplyAPR||0).toFixed(2)} % /${parseFloat(currentBorrowAPR||0).toFixed(2)}
                `
    
            }
        }
      },
    subtitle: {
        text: ''
    },

    yAxis: {
        title: {
            text: 'Rate'
        }
    },

    xAxis: {
        title: {
            text: 'Utilization'
        },
        
        accessibility: {
            rangeDescription: 'Utilization'
        }
    },
    credits: {
        enabled: false
    },
    legend: {
        layout: 'vertical',
        align: 'right',
        verticalAlign: 'middle'
    },

    plotOptions: {
        series: {
            label: {
                connectorAllowed: true
            },
            pointStart: 0.0
        }
    },

    series: [{
        name: 'Supply APR',
        data: []

    }, {
        name: 'Borrow APR',
        data: []
    }],

    responsive: {
        rules: [{
            condition: {
                maxWidth: 500
            },
            chartOptions: {
                legend: {
                    layout: 'horizontal',
                    align: 'center',
                    verticalAlign: 'bottom'
                }
            }
        }]
    }

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
    const currentToken = params.currentRow?.token;
    const [callInProgress, setCallInProgress] = React.useState(true);
    const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
    
  const { getTokenProperties, IntrestRateModal, TokenBorrowLimitations } = React.useContext(TokenContext);

    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);
    const [tokendetails, setTokendetails] = React.useState({});
    const [tokenSummary, setTokenSummary] = React.useState({});


    const supplySeries = [];
    const borrowSeries = [];
    const setApyGraph = async (lendingContract) => {
        if (!currentToken) {
            return
        }
        try {
            console.log(            
            currentToken.address,
                IntrestRateModal,
                    decimalToBigUints(bigToDecimalUints(TokenBorrowLimitations.MAX_UTILIZATION_RATE, 2), 2))
                console.log(lendingContract)
            const chartData = await lendingContract.getChartData(
                currentToken.address,
                IntrestRateModal,
                    decimalToBigUints(bigToDecimalUints(TokenBorrowLimitations.MAX_UTILIZATION_RATE, 2), 2)
            );
            console.log(chartData)
            options.series[0].data = chartData[0].map(item => Number(parseFloat(Number(bigToDecimal(item)) * 100).toFixed(2)))
            options.series[1].data = chartData[1].map(item => Number(parseFloat(Number(bigToDecimal(item)) * 100).toFixed(2)))


        } catch (err) {
            console.log(err);
        } finally {
            setCallInProgress(false);
        }

    }


    const getTokenDetails = async () => {
        const details = getTokenProperties(currentToken.address)
        setTokendetails(details);
        setTimeout(() => {
            getTokenMarketDetails(details)
        })

    }

    const getTokenMarketDetails = async (tokendetails) => {

        const details = {
        }
        const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);

        if (tokendetails.aggregator) {
            const result = await lendingContract.getAggregatorPrice(tokendetails.aggregator.aggregator);
            const priceInUSD = Number(result) / Math.pow(10, tokendetails.aggregator.decimals);

            details['priceInUSD'] = priceInUSD

        }
        const result = await lendingContract.getTokenMarketDetails(tokendetails.token.address);
        details['lendings'] = bigToDecimal(result[0])
        details['reserve'] = bigToDecimal(result[1])
        details['totalDebt'] = bigToDecimal(result[2])
        details['totalVariableDebt'] = bigToDecimal(result[3])
        details['totalStableDebt'] = bigToDecimal(result[4])

        const supplyAPR = await lendingContract.calculateCurrentLendingProfitRate(
            tokendetails.token.address,
            IntrestRateModal
        );
        const uratio = await lendingContract._utilizationRatio(tokendetails.token.address);
        const borrowRatesResult = await lendingContract.getCurrentStableAndVariableBorrowRate(uratio, IntrestRateModal);
        const borrowAPR = await lendingContract.getOverallBorrowRate(
            tokendetails.token.address, borrowRatesResult[0], borrowRatesResult[1]
        );
        details['uratio'] = bigToDecimalUints(uratio, 2) * 100
        currentUtilization=details['uratio'] 
        details['supplyAPR'] = bigToDecimalUints(supplyAPR, 2) * 100
        details['borrowAPR'] = bigToDecimalUints(borrowAPR, 2) * 100
        currentSupplyAPR=details['supplyAPR'] 
        currentBorrowAPR=details['borrowAPR'] 
        details['supplyAPY'] = getAPY(bigToDecimalUints(supplyAPR, 2)) * 100
        details['borrowAPY'] = getAPY(bigToDecimalUints(borrowAPR, 2)) * 100

        setTokenSummary(details)


    }

    React.useEffect(() => {
        if (callInProgress) {
            const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);

            setApyGraph(lendingContract)
            getTokenDetails(lendingContract)

        }

    }, [callInProgress, tokenSummary]); // Empty array means to only run once on mount.
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
                                src={currentToken?.icon} />

                        </Avatar>

                        <Typography variant="h6">
                            {currentToken?.name}
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
                                    <div><b>$ {tokenSummary?.priceInUSD}</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Total Supply</div>
                                    <div><b>{tokenSummary?.lendings} {currentToken?.symbol}</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Total Borrowed</div>
                                    <div><b>{tokenSummary?.totalDebt} {currentToken?.symbol}</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Borrowed On Variable Rate</div>
                                    <div><b>{tokenSummary?.totalVariableDebt} {currentToken?.symbol}</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>• Borrowed On Stable Rate</div>
                                    <div><b>{tokenSummary?.totalStableDebt} {currentToken?.symbol}</b></div>
                                </div>
                                <Divider sx={{ margin: '10px' }}></Divider>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Current Utilization</div>
                                    <div><b>{parseFloat(tokenSummary?.uratio || 0).toFixed(3)}%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Supply APR / APY</div>
                                    <div><b>{parseFloat(tokenSummary?.supplyAPR || 0).toFixed(3)}% / {parseFloat(tokenSummary?.supplyAPY || 0).toFixed(3)}%</b></div>
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
                                <Divider sx={{ margin: '10px' }}></Divider>

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
                                    <div><b>{currentToken?.symbol}</b></div>
                                </div>

                            </Card>
                        </Grid>
                        {/* <Grid div md={2} xs={0}></Grid> */}
                        <Grid item md={6} xs={12}>
                            <Card className={classes.innerCard}>
                               
                                    {!callInProgress && (
                                        <div className={classes.textMuted}>
                                            <HighchartsReact
                                                highcharts={Highcharts}
                                                options={options}
                                            />
                                        </div>)
                                    }
                                    {callInProgress && (
                                        <h4>Please wait intrest rate model is calculating</h4>
                                    )}
                            </Card>
                        </Grid>
                        <Grid item md={12} xs={12}>
                            <Card className={classes.innerCard}>
                                <div className="text">
                                    <div className={classes.textHighlighted}>
                                        Stats
                                    </div>
                                    {/* <div className={classes.textMuted}><HighchartsReact
                                        highcharts={Highcharts}
                                        options={options} />
                                    </div> */}
                                </div>
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
                                    <div><b>{tokendetails?.borrowLimitation?.CollateralFator}%
                                    </b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Liquidation Threshold</div>
                                    <div><b>{tokendetails?.borrowLimitation?.LiquidationThreshold}%
                                    </b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Liquidation Penalty</div>
                                    <div><b>{tokendetails?.borrowLimitation?.LiquidationPenalty}%</b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Initial Borrow Rate share</div>
                                    <div><b>{tokendetails?.borrowLimitation?.InitialBorrowRate}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>MAX_UTILIZATION_RATE</div>
                                    <div><b>{tokendetails?.borrowLimitation?.MAX_UTILIZATION_RATE}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>OPTIMAL_UTILIZATION_RATE</div>
                                    <div><b>{tokendetails?.borrowLimitation?.OPTIMAL_UTILIZATION_RATE}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>StableRateSlope1</div>
                                    <div><b>{tokendetails?.borrowLimitation?.StableRateSlope1}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>VariableRateSlope1</div>
                                    <div><b>{tokendetails?.borrowLimitation?.VariableRateSlope1}%

                                    </b></div>
                                </div>
                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>VariableRateSlope2</div>
                                    <div><b>{tokendetails?.borrowLimitation?.VariableRateSlope2}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>Base Intrest Rate</div>
                                    <div><b>{tokendetails?.borrowLimitation?.baseRate}%

                                    </b></div>
                                </div>

                                <div className="d-flexSpaceBetween">
                                    <div className={classes.textMuted}>AllowStableJob</div>
                                    <div><b>{tokendetails?.borrowLimitation?.AllowStableJob?.toString()}

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
