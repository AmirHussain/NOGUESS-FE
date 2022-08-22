import React from 'react';
import { Grid, Box, Card, Typography, Switch, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Paper, CardHeader, Avatar, IconButton, CardMedia, CardContent, CardActions, SvgIcon, Button } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import { ExpandMore, Favorite, MoreVert, Share } from '@mui/icons-material';
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

    card: theme.cardBackground,
    walletConnect: theme.walletConnect,
    actionButton: {
        color: 'white !important',
        fontSize: '11px !important',
        fontWeight: '800 !important',
        background: '#0B0A0D !important',  /* fallback for old browsers */
        // background: ' -webkit-linear-gradient(to left, #2c3e50, #2980b9)',  /* Chrome 10-25, Safari 5.1-6 */
        // background: 'linear-gradient(to left, #2c3e50, #2980b9)' /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

    }
});

export default function Tiles(props) {
    const classes = useStyles();

    const dt = {
        'name': {
            title: '',
            key: 'name'
        },
        'icon': {
            title: '',
            key: 'icon'
        }, 'fat': {
            title: 'calories',
            key: 'calories'
        }, 'carbs': {
            title: 'calories',
            key: 'calories'
        }, 'protein': {
            title: 'calories',
            key: 'calories'
        },
    }
    function createData(name, apr, sc, st, b,icon) {
        return { name, apr, sc, st, b, icon: icon||'https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3' };
    }

    const rows = [
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZIOU', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('dQUICK', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('CNT', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('dQUICK', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('CNT', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0),
        createData('EZ', '0% in EZ', '90 DAY', '19 Jul 21 02:30 PM UTC', 4.0)   
    ];
    return (

        <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>
            {rows.map((row) => (
                <Grid item xs={6} sm={4} md={3} >
                    <Card className={classes.card} sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardHeader sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '5px' }}
                            avatar={
                                <Avatar aria-label="Recipe" className={classes.avatar}>
                                    <img class="chainIcon"
                                        src="https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3" />

                                </Avatar>
                            }
                            title={row.name}
                        />
                        <CardContent class="content-box">
                            <div class="d-flexSpaceBetween">  <span>APR IN REWARD:</span> <span>{row.apr}</span></div>
                            <div class="d-flexSpaceBetween"> <span>STAKING CYCLE</span> <span>{row.sc}</span></div>
                            <div class="d-flexSpaceBetween"> <span>START TIME:</span><span>{row.st}</span></div>
                            <div class="d-flexSpaceBetween"> <span>YOUR BALANCE</span><span>{row.b}</span></div>
                            <div class="d-flexSpaceBetween">  <b></b> <span><Button variant="text" size="small" className={classes.actionButton} onClick={props.action}>Claim</Button></span></div>
                        </CardContent>


                    </Card>
                </Grid>
            ))}

        </Grid>

    );
}
