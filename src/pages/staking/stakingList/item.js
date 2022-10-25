import React, { useState } from 'react';
import { Card, CardHeader, Avatar, CardContent, Button, Link } from '@mui/material';
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
    avatar: theme.avatar,
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
           const updatedRow=props.row
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
        <Card className={classes.card} sx={{ boxShadow: row.isActive ? '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' : '' }}>
            <CardHeader onClick={() => SetAndOpenAsset(row)}
                sx={{ color: 'white', fontWeight: 600, textAlign: 'left', padding: '5px', backgroundColor: !row.isActive ? 'lightGrey' : 'inherit' }}
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
                <div className="d-flexSpaceBetween"> <span>STAKING CYCLE</span> <span>{row.staking_duration} Month(s)</span></div>
                <div className="d-flexSpaceBetween"> <span>START TIME:</span><span>{row.staking_start_time}</span></div>
                <div className="d-flexSpaceBetween"> <span>YOUR BALANCE</span><span>{row.b || 0.0} {row.staking_token?.token_symbol}</span></div>
                <div className="d-flexSpaceBetween">  <b></b>
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
