import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Edit, MoreVertRounded, Token } from '@mui/icons-material';
import { TokenContext } from '../../tokenFactory';

import theme from './../../theme';
import { makeStyles } from '@mui/styles';
import AddUpdateAggregator from './addUpdateAggregator';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Button } from '@mui/material';
const useStyles = makeStyles({
    tabs: {
        "& .MuiButtonBase-root": {
            alignItems: 'start !important',
            maxWidth: '166px !important',
            borderRadius: '8px 0px 0px 8px',
            marginBottom: '12px',
            background: theme.SideHeaderBackground,
            "&.Mui-selected": {
                borderTop: '1px solid blue',
                borderLeft: '1px solid blue',
                borderBottom: '1px solid blue',
                left: '2px'
            }
        },


    },
    tabPanel: {
        height: 'calc(100vh - 90px)',
        borderLeft: '1px solid blue'
    },

    content: {
        color: theme.darkText,
        background: theme.contentBackGround,
        padding: '1%',
        position: 'relative',
        top: theme.headerHeight,
        overflow: 'auto',
        // height:'calc(100% - '+theme.headerHeight+') !important'
    },
    card: theme.card
});
export default function AdminGovernance() {
    const { Tokens, TokenAggregators } = React.useContext(TokenContext);
    const [rows, setRows] = React.useState([]);
    const [newRow, setNewRow] = React.useState(true);
    const [currentRow, setCurrentRow] = React.useState([]);
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const newToken = () => {
        setNewRow(true)
        setCurrentRow({})
        setOpen(true);
    }

    const editToken = (row) => {
       
    }

    const [loading, setLoading] = React.useState(false)
    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    const getGovernanceProposals = async () => {

        let trows = []
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
        const users = await governanceContract.getAllUserAddresses();

        let useradded = 0
        const allUsers = users.filter(onlyUnique);
        console.log(allUsers.length, allUsers);
        if (allUsers && allUsers.length) {
            allUsers.forEach(async (adl) => {
                const Proposals = await governanceContract.getProposal(adl);
                console.log(Proposals.length, Proposals);
                if (Proposals.length) {
                    let obj = {}
                    for (let i = 0; i < Proposals.length; i++) {
                        obj['id'] = Number(Proposals[i].id)
                        obj['status'] = Proposals[i].status
                        obj['title'] = Proposals[i].title
                        obj['description'] = Proposals[i].description
                        obj['userAddress'] = Proposals[i].userAddress

                        trows.push(obj);
                        console.log(obj)
                    }
                }
                useradded++
            });
            let interval = setInterval(() => {
                if (useradded === allUsers.length) {
                    setRows(trows)
                    setLoading(false)
                    clearInterval(interval);
                }
            })
        }


    }

    React.useEffect(() => {
        if (provider && !loading) {
            setLoading(true)
            setTimeout(() => {
                getGovernanceProposals()

            }, 100);

        }
    }, [provider])


    return (
        <>
            <List sx={{ width: '100%' }}>

                {rows.map(row => {
                    return (
                        <>

                            <ListItem alignItems="flex-start" className={classes.card}
                                secondaryAction={
                                    <>
                                        <Button variant="contained"
                                            disabled
                                            sx={{ color: 'lightgrey !important' }}
                                        > {row.status}</Button>
                                        {(row.status == "created" || row.status == "active" || row.status == "queued" || row.status == "executed") && (
                                            <Button variant="contained"
                                                onClick={() => editToken(row)}

                                                sx={{ color: 'lightgrey !important' }}
                                            > Mark as {row.status == "created" ? 'Active' : (row.status == "active" ? 'complete' : (row.status == "queued" ? 'Executed' : ''))}

                                            </Button>

                                        )}
                                    </>
                                }>
                                <ListItemAvatar>
                                    {row.id}
                                </ListItemAvatar>
                                <ListItemText
                                    primary={row.title}
                                // secondary={
                                //     <React.Fragment>

                                //     </React.Fragment>
                                // }
                                />
                            </ListItem>

                        </>
                    )
                })}


            </List>
        </>
    );
}