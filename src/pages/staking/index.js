import React from 'react';
import { Grid, Box, Card, Switch } from '@mui/material';
import { makeStyles } from '@mui/styles'
import theme from '../../theme'
import RightDrawer from '../../Components/rightDrawer';
import StakingList from './stakingList';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { bigToDecimal } from '../../utils/utils';
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
    textBold: theme.textBold
});

export default function Staking() {
    const classes = useStyles();
    const { provider, signer } = React.useContext(Web3ProviderContext);

    const [stakingOptions, setStakingOptions] = React.useState({});
    const [allStakingOptions, setAllStakingOptions] = React.useState({});
    const getStakingOptions = async () => {
        if (!provider) {
            return []
        }
        setLoadingStakingOption(true)
        const stakingOfferingContract = makeContract(contractAddresses.stakingOfferings, abis.stakingOfferings, signer);
        const rows = await stakingOfferingContract.GetAllStakingOptions();
        transformAndSetStakingOptions(rows)
        setLoadingStakingOption(false)
    }
    function setActive(value) {
        console.log(value)
        setStakingOptions(value ? allStakingOptions.filter(option => option.isActive) : allStakingOptions)

    }
    const transformAndSetStakingOptions = (rows) => {
        const tRows = [];
        if (rows && rows) {
            rows.forEach((row) => {
                tRows.push({
                    staking_contract_address: row.staking_contract_address,
                    staking_token: {
                        token_name: row.staking_token.token_symbol,
                        token_address:
                            row.staking_token.token_address,
                        token_image:
                            row.staking_token.token_image,
                        token_symbol:
                            row.staking_token.token_symbol
                    },
                    reward_token: {
                        token_name: row.reward_token.token_symbol,
                        token_address:
                            row.reward_token.token_address,
                        token_image:
                            row.reward_token.token_image,
                        token_symbol:
                            row.reward_token.token_symbol
                    },
                    staking_start_time: new Date().toISOString(),
                    staking_duration: bigToDecimal(row.staking_duration),
                    isActive: row.isActive,
                    isExpired: row.isExpired,
                    apy: bigToDecimal(row.apy),
                })

            })

        }
        setStakingOptions(tRows);
        setAllStakingOptions(tRows);
    }

    const [currentStake, setCurrentStake] = React.useState({});
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const toggleDrawer = () => {
        setDrawerOpen(!drawerOpen);
    };

    const OpenDrawer = (row) => {
        toggleDrawer();
        setCurrentStake(row);
    }
    const [loadingStakingOption, setLoadingStakingOption] = React.useState(true);


    React.useEffect(() => {
        getStakingOptions()
    }, [provider]);
    return (
        <Box >
            <div className="" sx={{
                alignItems: 'baseline', textAlign: 'right', marginTop: '10px',
                float: 'right'
            }} >

                <div className={classes.textBold} style={{ textAlign: 'right', float: 'right' }}>
                    Show all active
                    <Switch onChange={(e) => setActive(e.target.checked)}></Switch>
                </div>

            </div>
            {!loadingStakingOption && (
                <StakingList stakingOptions={stakingOptions} action={OpenDrawer} />
            )

            }
            {loadingStakingOption && (
                <h5>Loading Options</h5>
            )

            }

            {drawerOpen && (
                <RightDrawer Opration="Staking" component="staking" currentStake={currentStake} icon={currentStake.icon} title={currentStake.name} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
            )}
        </Box>
    );
}
