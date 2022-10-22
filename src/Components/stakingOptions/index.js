import React from 'react';
import { Grid, Box, Card, CardHeader, Avatar, CardContent, Button, Link } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import Asset from '../asset';


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

    card: theme.card,
    avatar: theme.avatar,
    cardContent: theme.cardContent,
    walletConnect: theme.walletConnect,
    actionButton: theme.actionButton2
});

export default function StakingOptions(props) {
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
    function createData(name, apr, sc, st, b, icon) {
        return { name, apr, sc, st, b, icon: icon || 'https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3' };
    }

    const rows = props?.stakingOptions || [];

    const openDrawer = (row) => {
        props.action(row);
    }

    const [openAsset, setOpenAsset] = React.useState(false);

    const [currentRow, setCurrentRow] = React.useState(false);

    const SetAndOpenAsset = (row) => {
        setCurrentRow(row)
        setOpenAsset(true);
    };

    const handleCloseAsset = () => {
        setOpenAsset(false);
    };

    return (

        <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>
            {rows.map((row, index) => (
                <Grid item xs={6} sm={4} md={3} key={index + "-card"}>
                    <Card className={classes.card} sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>
                        <CardHeader onClick={() => SetAndOpenAsset(row)} sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '5px' }}
                            avatar={
                                <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                                    <img className="chainIcon" alt=""
                                        src={row?.staking_token?.token_image} />
                                </Avatar>
                            }
                            title={<Link sx={{ cursor: 'pointer', textDecoration: 'none' }} >{row?.staking_token?.token_name}</Link>}

                        />
                        <CardContent className={classes.cardContent}>
                            <div className="d-flexSpaceBetween">  <span>APR IN REWARD:</span> <span>{row.apy}</span></div>
                            <div className="d-flexSpaceBetween"> <span>STAKING CYCLE</span> <span>{row.staking_duration}</span></div>
                            <div className="d-flexSpaceBetween"> <span>START TIME:</span><span>{row.staking_start_time}</span></div>
                            <div className="d-flexSpaceBetween"> <span>YOUR BALANCE</span><span>{row.b || 0.0 } {row.staking_token?.token_symbol}</span></div>
                            <div className="d-flexSpaceBetween">  <b></b> <span><Button variant="text" size="small" className={classes.actionButton} onClick={() => openDrawer(row)}>Stake Now</Button></span></div>
                        </CardContent>
                    </Card>
                </Grid>
            ))}
            {currentRow && (
                <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>

            )}
        </Grid>

    );
}
