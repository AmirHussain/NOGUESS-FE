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
import { vernofxAlertContext } from '../../Components/Alert';
import { ProposalStatus } from '../../utils/common';
import { bigToDecimal, decimalToBig, decimalToBigUnits } from '../../utils/utils';
const useStyles = makeStyles({
  tabs: {
    '& .MuiButtonBase-root': {
      alignItems: 'start !important',
      maxWidth: '166px !important',
      borderRadius: '8px 0px 0px 8px',
      marginBottom: '12px',
      background: theme.SideHeaderBackground,
      '&.Mui-selected': {
        borderTop: '1px solid blue',
        borderLeft: '1px solid blue',
        borderBottom: '1px solid blue',
        left: '2px',
      },
    },
  },
  tabPanel: {
    height: 'calc(100vh - 90px)',
    borderLeft: '1px solid blue',
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
  card: theme.card,
});
export default function AdminGovernance() {
  const { Tokens, TokenAggregators } = React.useContext(TokenContext);
  const { setAlert } = React.useContext(vernofxAlertContext);
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
    setNewRow(true);
    setCurrentRow({});
    setOpen(true);
  };

  const getVoteStatus = async (_id) => {
    const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
    let weightageMap = await governanceContract.getWeightageMap(decimalToBigUnits(_id, 0));

    const voteCountPerCat = { for: 0, against: 0 };
    weightageMap.forEach((wei) => {
      if (wei.statusAction === 'for') {
        voteCountPerCat.for += Number(bigToDecimal(wei.weightage));
      } else if (wei.statusAction === 'against') {
        voteCountPerCat.against += Number(bigToDecimal(wei.weightage));
      }
    });
    return voteCountPerCat.for > voteCountPerCat.against ? ProposalStatus.success : ProposalStatus.rejected;
  };

  const updateProposalStatus = async (row) => {
    const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);

    if (!provider || !signer) {
      return;
    }
    const index = setAlert({ severity: 'info', title: 'Create Proposal', description: 'Proposal addition in progress' });
    try {
      let newStatus = getRowNextStatus(row.status);
      if (row.status === ProposalStatus.active || row.status === '') {
        newStatus = await getVoteStatus(row.id);
      }
      const response = await governanceContract.updateProposalStatus(newStatus, row.userAddress, decimalToBigUnits(row.id.toString(), 0), { gasLimit: 1000000 });
      setAlert({ severity: 'info', title: 'Create Proposal', description: 'Proposal addition in progress', txhash: response.hash }, index);
      await response.wait(1);
      if (response) {
        window.location.reload();
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Proposal', error: err }, index);
    } finally {
    }
  };

  const [loading, setLoading] = React.useState(false);
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  const getRowNextStatus = (status) => {
    return status === ProposalStatus.created
      ? ProposalStatus.active
      : status === ProposalStatus.active
      ? ProposalStatus.complete
      : status === ProposalStatus.success
      ? ProposalStatus.queued
      : status === ProposalStatus.queued
      ? ProposalStatus.executed
      : '';
  };
  const getGovernanceProposals = async () => {
    let trows = [];
    const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
    const users = await governanceContract.getAllUserAddresses();

    let useradded = 0;
    const allUsers = users.filter(onlyUnique);
    console.log(allUsers.length, allUsers);
    if (allUsers && allUsers.length) {
      allUsers.forEach(async (adl) => {
        const Proposals = await governanceContract.getProposal(adl);
        console.log(Proposals.length, Proposals);
        if (Proposals.length) {
          for (let i = 0; i < Proposals.length; i++) {
            let obj = {};
            obj['id'] = Number(Proposals[i].id);
            obj['status'] = Proposals[i].status;
            obj['title'] = Proposals[i].title;
            obj['description'] = Proposals[i].description;
            obj['userAddress'] = Proposals[i].userAddress;

            trows.push(obj);
            console.log(obj);
          }
        }
        useradded++;
      });
      let interval = setInterval(() => {
        if (useradded === allUsers.length) {
          setRows(trows);
          setLoading(false);
          clearInterval(interval);
        }
      });
    }
  };

  React.useEffect(() => {
    if (provider && !loading) {
      setLoading(true);
      setTimeout(() => {
        getGovernanceProposals();
      }, 100);
    }
  }, [provider]);

  return (
    <>
      <List sx={{ width: '100%' }}>
        {rows?.map((row) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                className={classes.card}
                secondaryAction={
                  <>
                    <Button variant="contained" disabled sx={{ color: 'lightgrey !important' }}>
                      {' '}
                      {row.status}
                    </Button>
                    {row.status !== ProposalStatus.executed && row.status !== ProposalStatus.rejected && (
                      <Button variant="contained" onClick={() => updateProposalStatus(row)} sx={{ color: 'lightgrey !important' }}>
                        {' '}
                        Mark as {getRowNextStatus(row.status)}
                      </Button>
                    )}
                  </>
                }
              >
                <ListItemAvatar>{row.id}</ListItemAvatar>
                <ListItemText
                  primary={row.title}
                  // secondary={
                  //     <React.Fragment>

                  //     </React.Fragment>
                  // }
                />
              </ListItem>
            </>
          );
        })}
      </List>
    </>
  );
}
