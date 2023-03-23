import { AddCircleOutline, AddTask, CheckCircle, HowToVote, LibraryAddCheck, Queue } from '@mui/icons-material';
import { AppBar, Avatar, Button, Card, CardContent, CardHeader, Chip, Grid, LinearProgress, Typography } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Icons } from '../../icons';
import { routes } from '../../routes';
import theme from '../../theme';
import CreateProposal from './createProposal';
import { bigToDecimal, bigToDecimalUints, decimalToBigUnits } from "../../utils/utils"
import { ProposalStatus } from '../../utils/common';
import { getUserSuppliedAmount } from '../../utils/userDetails';
import Proposal from './proposal';
import moment from 'moment';

const useStyles = makeStyles({
  listSection: {
    backgroundColor: 'inherit',
  },
  LinearProgress: {
    "& .MuiLinearProgress-root": {
      height: '8px !important',
      borderRadius: '8px  !important',
      background: theme.headerBackground
    },
    "& .MuiLinearProgress-bar": {
      background: theme.greenColor + " !important"
    }
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down'
  },
  chip: theme.chip,
  card: theme.card,
  avatar: {
    height: '20px  !important',
    width: '20px  !important',
  },
  avatar2: {
    height: '24px  !important',
    width: '24px  !important',
  },
  link: {
    cursor: 'pointer !important',
    zIndex: 100,
    textDecoration: 'none  !important', color: 'inherit  !important',
    "&:hover": {
      background: theme.hoverBackground,
      "& $card": {
        background: theme.hoverBackground,
        "& $cardContent": {
          background: theme.hoverBackground
        }
      },

    }
  },

  cardContent: theme.cardContent,
  walletConnect: theme.walletConnect,
  actionButton: theme.actionButton2
});

function Governance() {
  const [open, setOpen] = React.useState(false);
  const [rows, setRows] = React.useState([])

  const [loading, setLoading] = React.useState(false)
  const classes = useStyles();
  const { connectWallet, provider, signer, account } = React.useContext(Web3ProviderContext);

  const [supplyAmount, setSupplyAmount] = React.useState(0);
  const [votingWeightage, setVotingWeightage] = React.useState(0);

  const fetchSupplyAmount = async () => {
    if (signer) {
      const supplied = await getUserSuppliedAmount(signer, 'WETH')
      setSupplyAmount(supplied)
    } else {
      setSupplyAmount(0)
    }
  }
  React.useEffect(() => {
    fetchSupplyAmount();
  }, [signer])
  let interval;
  React.useEffect(() => {

    setRemainingTime()
    return () => {
      // Anything in here is fired on component unmount.
      if (interval) {
        clearInterval(interval)
      }
    };
  }, [rows])


  React.useEffect(() => {
    if (provider && !loading) {
      setLoading(true)
      setTimeout(() => {
        getGovernanceProposals()

      }, 100);
    }
  }, [provider, account])
  function onlyUnique(value, index, self) {
    return self.indexOf(value) === index;
  }

  // const setUserProposals = (governanceContract) => {
  //   return new Promise((resolve, reject) => {

  //     const rows = []
  //     if (Tokens && Tokens.length) {
  //       let rowadded = 0
  //       Tokens.forEach(element => {
  //         if (!element.isPedgeToken) {
  //           getSupplyDetailsFromContract(element).then((resp) => {
  //             const row = createSupplyData(element, 0, 0, 6.0, 'Button')
  //             row.supplyAmount = resp.amount
  //             row.borrowAmount = resp.borrowAmount
  //             row.supplyAPY = resp.supplyAPY
  //             row.borrowAPY = resp.borrowAPY
  //             rows.push(row);
  //             rowadded++;
  //             console.log(SupplyRows)
  //           })
  //         }
  //       });
  //       let interval = setInterval(() => {
  //         if (rowadded === Tokens.length) {
  //           resolve(rows);
  //           clearInterval(interval);
  //         }
  //       })
  //     }

  //   })
  // }
  const getWeightageMap = async (_id) => {
    const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
    let weightageMap = await governanceContract.getWeightageMap(decimalToBigUnits(_id, 0));
    console.log('wieghtageMAp', weightageMap)
    let total = 0
    const voteCountPerCat = {
      userVoted: false,
      for: 0,
      forPercent: 0, against: 0, againstPercent: 0, abstain: 0, abstainPercent: 0,
    }
    weightageMap.forEach(wei => {
      if (account === wei.userAddress) {
        voteCountPerCat.userVoted = true;
      }
      if (wei.statusAction === "for") {
        voteCountPerCat.for += Number(bigToDecimal(wei.weightage));
      } else if (wei.statusAction === "against") {
        voteCountPerCat.against += Number(bigToDecimal(wei.weightage));
      } else if (wei.statusAction === "abstain") {
        voteCountPerCat.abstain += Number(bigToDecimal(wei.weightage));
      }
      total += Number(bigToDecimal(wei.weightage))
    })
    voteCountPerCat.forPercent = voteCountPerCat.for ? (voteCountPerCat.for / total * 100) : 0;
    voteCountPerCat.againstPercent = voteCountPerCat.against ? (voteCountPerCat.against / total * 100) : 0;
    voteCountPerCat.abstainPercent = voteCountPerCat.abstain ? (voteCountPerCat.abstain / total * 100) : 0;
    return voteCountPerCat

  }
  const getGovernanceProposals = async () => {

    let trows = []
    setRows([]);
    console.log("called")
    let useradded = 0;
    const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
    const users = await governanceContract.getAllUserAddresses();
    const minWeight = await governanceContract.minimumVoteWeight();
    setVotingWeightage(bigToDecimal(minWeight))
    const allUsers = users.filter(onlyUnique);
    console.log(allUsers.length, allUsers);
    if (allUsers && allUsers.length) {
      for (var ui = 0; ui < allUsers.length; ui++) {
        const user = allUsers[ui]
        const res = await governanceContract.getProposal(user)
        const Proposals = Object.assign([], res)
        console.log(user, Proposals)
        if (Proposals.length) {
          for (var j = 0; j < Proposals.length; j++) {
            const proposal = Proposals[j]
            const obj = {};
            obj['id'] = Number(proposal.id);
            obj['status'] = proposal.status;
            obj['title'] = proposal.title;
            obj['description'] = proposal.description;
            obj['userAddress'] = proposal.userAddress;
            obj['activeUntil'] = proposal.activeUntil;
            const weightage = await getWeightageMap(obj['id'].toString());
            console.log('weightage', weightage)
            obj['for'] = weightage.for;
            obj['forPercent'] = weightage.forPercent;
            obj['against'] = weightage.against;
            obj['againstPercent'] = weightage.againstPercent;
            obj['abstain'] = weightage.abstain;
            obj['abstainPercent'] = weightage.abstainPercent;
            obj['userVoted'] = weightage.userVoted;
            trows.push(obj)

          }
        }

      }
      setRows(trows)
      setLoading(false)

    }


  }

  const [reminaingTimeObj, setRemainingTimeObject] = React.useState({})
  const setRemainingTime = () => {
    const activeFind = rows.find(row => row.status === ProposalStatus.active)
    if (activeFind) {
      interval = setInterval(() => {
        var obj = {}
        for (let tr = 0; tr < rows.length; tr++) {
          if (!isNaN(new Date(rows[tr].activeUntil))) {
            var now = new Date().getTime();
            var timeleft = new Date(rows[tr].activeUntil) - now;
            var days = Math.floor(timeleft / (1000 * 60 * 60 * 24));
            var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
            obj[rows[tr].id] = days + "d, " + hours + "h : " + minutes + "m : " + seconds + "s"
          }
        }
        setRemainingTimeObject(obj)
      }, 1000)

    }
  }

  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const getVoteDetails = (row) => {

    return <div style={{ width: "100%" }}>
      <div style={{ marginBottom: '20px' }}>

        <div className='d-flexSpaceBetween'>
          <Typography sx={{ fontSize: 11, color: theme.lightText, marginBottom: '10px', marginRight: '2px' }} variant="h2" >
            For
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, marginBottom: '10px' }} variant="h2" >

            {row.for || 0} FF
          </Typography>

        </div>
        <div className={classes.LinearProgress}>
          <LinearProgress variant="determinate" value={row.forPercent} />
        </div>
      </div>
      <div style={{ marginBottom: '20px' }}>
        <div className='d-flexSpaceBetween'>
          <Typography sx={{ fontSize: 11, color: theme.lightText, marginBottom: '10px', marginRight: '2px' }} variant="h2" >
            Against
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, marginBottom: '10px', marginRight: '2px' }} variant="h2" >

            {row.against || 0} FF
          </Typography>

        </div>
        <div className={classes.LinearProgress}>
          <LinearProgress variant="determinate" value={row.againstPercent} />
        </div>

      </div>
      <div style={{ marginBottom: '20px' }}>
        <div className='d-flexSpaceBetween'>
          <Typography sx={{ fontSize: 11, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
            Abstain
          </Typography>
          <Typography sx={{ fontSize: 11, fontWeight: 600, marginBottom: '10px' }} variant="h2" >

            {row.abstain || 0} FF
          </Typography>
        </div>
        <div className={classes.LinearProgress}>
          <LinearProgress variant="determinate" value={row.abstainPercent} />
        </div>
      </div>
    </div>;
  }

  const renderStatus = (row) => {
    switch (row.status) {
      case ProposalStatus.created:
        return <AddCircleOutline htmlColor={'white'} color="white" fontSize='large'></AddCircleOutline>;
      case ProposalStatus.active:
        return getVoteDetails(row);
      case ProposalStatus.success:
        return <AddTask htmlColor={theme.greenColor} color="white" fontSize='large'></AddTask>;
      case ProposalStatus.rejected:
        return <CheckCircle htmlColor={'red'} color="white" fontSize='large'></CheckCircle>;
      case ProposalStatus.queued:
        return <Queue htmlColor={theme.greenColor} color="white" fontSize='large'></Queue>;
      case ProposalStatus.executed:
        return <CheckCircle htmlColor={theme.greenColor} color="white" fontSize='large'></CheckCircle>;
      default:
        return '';
    }
  }

  return (
    < >
      {open && (<CreateProposal open={open} setOpen={setOpen} handleClickOpen={handleClickOpen} handleClose={handleClose}></CreateProposal>)}

      <Grid container direction="row" justifyContent="center" alignItems="flex-center"
        spacing={2} style={{ width: '100%', textAlign: 'left' }}>

        <Grid item xs={8} sm={8} md={8}  >
          <div className='d-flexSpaceBetween'>
            <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p" >
              Proposals
            </Typography>
            <Button sx={{ fontSize: 14, fontWeight: 600, color: theme.lightText, paddingBottom: '10px', cursor: 'pointer' }} onClick={() => handleClickOpen()} disabled={supplyAmount < votingWeightage}>
              + create proposal
            </Button>
          </div>

        </Grid>
        <Grid item xs={4} sm={4} md={4}  >
          <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p" >
            Votting Wallet
          </Typography>
        </Grid>
      </Grid>
      <Grid container direction="row" justifyContent="center" alignItems="flex-center"
        spacing={2} style={{ width: '100%', textAlign: 'left' }}>
        <Grid item xs={8} sm={8} md={8}  >
          {rows.map((r) => (
            <NavLink className={classes.link} to={{ pathname: routes.proposal + '/' + r.id + '/' + r.userAddress }} >
              <Card className={classes.card} >
                <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
                  <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', margin: 0 }}>
                    <Grid item xs={9} sm={9} md={9} style={{ borderRight: '0.5px solid ' + theme.borderColor, padding: 20 }} >
                      <Typography sx={{ fontSize: 12, fontWeight: 500, paddingBottom: '28px' }} variant="h4" >
                        <span className={classes.chip}>
                          # {r.id}
                        </span>
                        <Typography sx={{ fontSize: 11, width: '100%', color: theme.lightText, textAlign: 'left' }} variant="p" >
                          {!r.userVoted ? 'Not voted' : ''}
                        </Typography>
                        {r.status === ProposalStatus.active && (
                          <Chip sx={{ float: "right" }} label={r.status} color="success" variant="outlined" />
                        )}
                      </Typography>
                      <Typography sx={{ fontSize: '18px', width: '100%', color: 'white', textAlign: 'left' }} variant="h3" >
                        {r.title}
                      </Typography>
                      {r.status === ProposalStatus.active && (<Typography sx={{
                        fontSize: '12px', width: '100%', textAlign: 'left', position: "relative",
                        bottom: "-40px"
                      }} variant="h5" >
                        Active Until <strong style={{ textTransform: 'uppercase' }}>: {moment(new Date(r.activeUntil)).format('DD MMM  YYYY, h:mm:ss A')}</strong>
                        <strong style={{ float: "right" }}> {reminaingTimeObj[r.id]}</strong>
                      </Typography>
                      )}
                    </Grid>

                    <Grid item xs={3} sm={3} md={3} sx={{ margin: 'auto', textAlign: 'center' }} >
                      <div className='d-flexSpaceAround'>
                        {renderStatus(r)}
                      </div>
                      <Typography sx={{ fontSize: '14px', width: '100%', color: 'white' }} variant="h3" >
                        {r.status === ProposalStatus.active ? '' : r.status}
                      </Typography>
                    </Grid>

                  </Grid>

                </CardContent>
              </Card>
            </NavLink>

          ))}

        </Grid>
        <Grid item xs={4} sm={4} md={4} >
          <Card className={classes.card} >

            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingBottom: '40px', color: theme.lightText }} variant="p" >
                Voting Weight
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', }}>
                <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                  {votingWeightage || 0.0}
                </span>
              </div>
              <Typography sx={{ fontSize: 14, fontWeight: 600, paddingBottom: '40px', color: theme.lightText }} variant="p" >
                Total Locked
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', paddingBottom: '20px', }}>
                <Avatar sx={{ cursor: 'pointer' }} aria-label="Recipe" className={classes.avatar}>
                  <img className={classes.avatar} alt=""
                    src={Icons.ethereum} />
                </Avatar>  <span style={{ paddingLeft: '4px', fontSize: '20px', fontWeight: '600' }}>
                  {supplyAmount || 0.0}
                </span>
              </div>
              <AppBar key="rightbar"
                position="relative"
                className={classes.rightDrawerHeader}
                sx={{ height: 'auto', boxShadow: 'none !important' }}

                color="transparent"

              >
                {
                  supplyAmount < votingWeightage && (
                    <Button sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', fontWeight: '600' }} variant="contained" >
                      Supply vernofxToken</Button>

                  )
                }
              </AppBar>
            </CardContent>
          </Card>
          <Card className={classes.card} >

            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >
              <Typography sx={{ fontSize: 18, fontWeight: 500 }} variant="h4" >

                To vote you should:</Typography>
              <Typography sx={{}} variant="p" >
                <ol style={{ paddingLeft: 12 }}>
                  <li> Deposit your tokens in the XVS Vault
                  </li>
                  <li>
                    Delegate your voting power to yourself or somebody else
                  </li>
                </ol>
              </Typography>

            </CardContent>
          </Card>


        </Grid>
      </Grid>
    </>
  );
}

export default Governance;