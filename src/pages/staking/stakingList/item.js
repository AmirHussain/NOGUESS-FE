import React, { useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Button, Link, Typography, Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { bigToDecimal } from '../../../utils/utils';
import moment from 'moment';


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
    avatar: {
        height: '30px  !important',
        width: '30px  !important',
    },
    cardContent: theme.cardContent,
    walletConnect: theme.walletConnect,
    actionButton: theme.actionButton2
});

export default function StakingItem(props) {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const [row, setRow] = useState({});
    const openDrawer = (row) => {
        row.token = { icon: row.staking_token?.token_image, address: row.staking_token?.token_address, symbol: row.staking_token?.token_symbol }
        props.openDrawer(row);
    }

    const SetAndOpenAsset = (row) => {
        props.SetAndOpenAsset(row)
    };

    async function setStakingOptionDetailsFromStakingContract() {
        if (provider) {
            console.log('row', props.row)
            console.log(signer);
            const stakingOfferingContract = makeContract(props.row?.staking_contract_address, abis.staking, signer);
            console.log(stakingOfferingContract);
            const updatedRow = props.row
            if (signer) {
                const signerAddress = signer.address || await signer.getAddress()
                const duration = await stakingOfferingContract.duration();
                console.log(duration, bigToDecimal(duration))
                updatedRow.staking_duration = Math.round(moment.duration(Number(bigToDecimal(duration)), 'seconds').asMonths());

                const earned = await stakingOfferingContract.earned(signerAddress);
                const rewardRate = await stakingOfferingContract.rewardRate();
                updatedRow.b = bigToDecimal(earned);
                updatedRow.apy = bigToDecimal(rewardRate);


            }
            setRow(updatedRow)

        }
    }
    React.useEffect(() => {

        if (props.row) {

            setStakingOptionDetailsFromStakingContract()
        }
    }, [props.row, provider])
    return (
        <Card className={classes.card} sx={{ backgroundColor: !row.isActive ? theme.contentBackGround : 'inherit', minHeight: '224px' }}>
            <CardHeader 
                sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '5px', backgroundColor: !row.isActive ? theme.contentBackGround : 'inherit' }}
                avatar={
                    <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                        <img className={classes.avatar} alt=""
                            src={row?.staking_token?.token_image} />
                    </Avatar>
                }
                // color: theme.lightText
                title={
                    <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" gutterBottom>

                        {row?.staking_token?.token_name}</Typography>}

            />
            <CardContent className={classes.cardContent} sx={{ backgroundColor: !row.isActive ? theme.contentBackGround : 'inherit' }}>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: theme.lightText, textAlign: 'left' }} variant="h4" gutterBottom>

                    You are staking</Typography>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                        <img className={classes.avatar} alt=""
                            src={row?.staking_token?.token_image} />
                    </Avatar>
                    <Typography sx={{ fontSize: 20, fontWeight: 600, textAlign: 'left', padding: '4px' }} variant="h4" gutterBottom>

                        {row.b || 0.0}</Typography>

                </div>

                <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%' ,textAlign:'left'}}>

                    <Grid item xs={4} sm={4} md={4} style={{ borderRight: '1px solid ' + theme.lightText }} >
                      
                    <div >
                            <span>
                            APR
                            </span>
                        </div>
                        <div>
                            <span>
                                {row.apy} %
                            </span>
                        </div>

                    </Grid>

                    <Grid item xs={4} sm={4} md={4} style={{ borderRight: '1px solid ' + theme.lightText }} >
                        <div >
                            <span>
                                START TIME
                            </span>
                        </div>
                        <div>
                            <span>
                                {row.staking_start_time}
                            </span>
                        </div>

                    </Grid>

                    <Grid item xs={4} sm={4} md={4} >
                    <div >
                            <span>
                            STAKING CYCLE
                            </span>
                        </div>
                        <div>
                            <span>
                            {row.staking_duration} Month(s)
                            </span>
                        </div>

                    </Grid>
                </Grid>
                <div className='d-flexSpaceBetween'>  <b></b>
                    <span>
                        {(Number(row.b) && row.isExpired) > 0 && (
                            <Button variant="text" size="small" className={classes.actionButton} onClick={() => openDrawer(row)}>Claim</Button>
                        )}
                        {(row.isActive && !Number(row.b)) && (
                            <Button variant="text" size="small" className={classes.actionButton} onClick={() => openDrawer(row)}>Stake Now</Button>
                        )}
                    </span>
                </div>
            </CardContent>
        </Card>

    );
}
