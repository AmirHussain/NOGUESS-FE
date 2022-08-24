import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableRow, TableCell, TableBody, Paper, Button, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider, IconButton, Toolbar, Modal, Fade, DialogActions, Dialog, DialogTitle, DialogContent, DialogContentText, TextField } from '@mui/material';
import { makeStyles } from '@mui/styles'
import Tiles from '../../Components/tiles';
import { Inbox, Mail } from '@mui/icons-material';
import theme from '../../theme'
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
    
sideBar:{
    background:'#050506',
    color:'white'
},
textHighlighted:theme.textHighlighted,
sectionHeading:theme.sectionHeading,
textMutedBold:theme.textMutedBold,
textMuted:theme.textMuted,
innerCard:theme.innerCard,
modal:theme.modal,
textBold:theme.textBold
});

export default function Staking() {
    const classes = useStyles();

    function createData(name, calories, fat, carbs, protein) {
        return { name, calories, fat, carbs, protein };
    }
    const [drawerOpen, setDrawerOpen] = React.useState(false);

    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const rows = [
        createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
        createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
        createData('Eclair', 262, 16.0, 24, 6.0),
        createData('Cupcake', 305, 3.7, 67, 4.3),
        createData('Gingerbread', 356, 16.0, 49, 3.9),
    ];
    return (
        <box >

            <div >
                <div className={classes.sectionHeading}>
                    Overview
                </div>
                <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>


                    <Grid item column md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div class="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Your Total Assets Staked</div></div>
                            <div class="image"></div>
                        </Card>
                    </Grid>
                    {/* <Grid div md={2} xs={0}></Grid> */}
                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div class="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Average APR</div></div>
                            <div class="image"></div>
                        </Card>
                    </Grid>
                    <Grid item md={4} xs={12}>
                        <Card className={classes.innerCard}>
                            <div class="text">
                                <div className={classes.textHighlighted}>$ 0</div>
                                <div className={classes.textMuted}>Est. Reward Accrued</div></div>
                            <div class="image"></div>
                        </Card>
                    </Grid>
                </Grid>
                <div className="d-flex-evenly marginTop" sx={{ alignItems: 'baseline', textAlign: 'left', marginTop: '10px' }} >
                    <div div className={classes.sectionHeading} md={4}>
                        Staking Programs
                    </div>

                    <div div className={classes.textMutedBold} md={6}>
                        Choose from the programs below to deposit your assets and receive corresponding rewards to the staking program
                    </div>

                    <div div className={classes.textBold} md={2} sx={{ textAlign: 'right' }}>
                        Show all active
                        <Switch></Switch>
                    </div>

                </div>
                <Tiles action={toggleDrawer} />
            </div>
            <div>

            </div>
            <Dialog open={drawerOpen} onClose={toggleDrawer}>
        <DialogTitle>Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            To subscribe to this website, please enter your email address here. We
            will send updates occasionally.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Email Address"
            type="email"
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={toggleDrawer}>Cancel</Button>
          <Button onClick={toggleDrawer}>Subscribe</Button>
        </DialogActions>
      </Dialog>        </box>
    );
}
