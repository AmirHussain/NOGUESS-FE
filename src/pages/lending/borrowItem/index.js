import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, SwipeableDrawer, Skeleton, AppBar, Avatar, FormControl, InputLabel, Input } from '@mui/material';
import { makeStyles } from '@mui/styles'
import { ArrowBack, Inbox, Mail } from '@mui/icons-material';
import theme from '../../../theme';

import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
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

export default function BorrowItem(params) {
    console.log(params)
    const currentRow = params.input.currentRow
    const classes = useStyles();
    const [value, setValue] = React.useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    return (
        <React.Fragment key="RIGHTContent">


            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    height: `calc(100% - ${theme.headerHeight})`,
                    display: 'block',
                    right: '0px'

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

                <Card className={classes.innerCard} sx={{
                    display: 'block !important', padding: '10px',
                    fontSize: '11px',
                    fontStretch: 'semi-expanded',
                    background: theme.DrawerBackground,
                    color: theme.lightBlueText + ' !important',
                    margin: '10px',
                    width: 'auto'
                }}>

                    <TabContext value={value}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleChange}
                             indicatorColor="main"
                             textColor="inherit"
                              aria-label="lab API tabs example" centered>
                                <Tab label="Borrow" value="1" />
                                <Tab label="Repay" value="2" />
                            </TabList>
                        </Box>
                        <TabPanel value="1">
                            <Card key="form" className={classes.innerCard}
                                sx={{
                                    display: 'block !important', padding: '10px', paddingTop: '15px', marginBottom: '10px'
                                }}>
                                <FormControl variant="standard">
                                    <InputLabel htmlFor="input-with-icon-adornment">
                                        Borrow Requested
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


                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button variant="contained">Borrow</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="2">
                            <Card key="form" className={classes.innerCard}
                                sx={{
                                    display: 'block !important', padding: '10px', paddingTop: '15px', marginBottom: '10px'
                                }}>
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


                            <div variant="dense" className="d-flexCenter" sx={{ height: theme.headerHeight }}>
                                <Button variant="contained">Supply</Button>
                            </div>
                        </TabPanel>
                        <TabPanel value="3">Item Three</TabPanel>
                    </TabContext>
                </Card>
            </Box>


        </React.Fragment>
    );
}
