import React, { useEffect, useRef } from 'react';
import { Grid, Box, Card, CardContent, Typography, Stepper, Step, StepLabel, StepContent, Button, AppBar, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles'
import theme from '../../theme';
import { CheckCircle } from '@mui/icons-material';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { bigToDecimalUints, decimalToBig, decimalToBigUints } from '../../utils/utils';
import { formatDate } from '../../utils/common';
import { FluteAlertContext } from '../../Components/Alert';







const useStyles = makeStyles({
    LinearProgress: {
        paddingBottom: '50px',
        "& .MuiLinearProgress-root": {
            height: '8px !important',
            borderRadius: '8px  !important',
            background: theme.headerBackground
        },
        "& .MuiLinearProgress-bar": {
            background: theme.greenColor + " !important"
        }
    },
    root: {
        "& .MuiStepLabel-root": {
            alignItems: "flex-start"
        },
        "& .MuiStepConnector-line": {
            minHeight: '12px !important'
        },
        "& .MuiStepConnector-root ":
        {
            marginLeft: '10px',
        },
        "& .MuiStepLabel-root ": { padding: '0px 0 !important' },
        "& .Mui-completed .MuiStepIcon-root": { color: theme.greenColor, width: '20px' },
        "& .Mui-active .MuiStepIcon-root": { color: theme.greenColor, width: '20px' },
        "& .Mui-disabled .MuiStepIcon-root": { color: "#666666", width: '20px' }
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

export default function Proposal(params) {

    const proposal = {
        description: ``,
        votingOptions: `<ul class="css-uf52su"><li>For - I agree that Venus Protocol should upgrade the Comptroller contract and set the supply caps</li><li>Against - I do not think that Venus Protocol should upgrade the Comptroller contract and set the supply caps</li><li>Abstain - I am indifferent to whether Venus Protocol upgrades the Comptroller contract and sets the supply caps</li></ul>`,
        operations: `<p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xfD36E2c2a6789Db23113685031d7F16329158384" target="_blank" rel="noreferrer">Comptroller</a>._setPendingImplementation("0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6")</p>
        <p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6" target="_blank" rel="noreferrer">0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6</a>._become("0xfD36E2c2a6789Db23113685031d7F16329158384")</p><p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xfD36E2c2a6789Db23113685031d7F16329158384" target="_blank" rel="noreferrer">Comptroller</a>._setAccessControl("0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555")</p>
        `
    }
    const [ProposalAddress, setProposalAddress] = React.useState(params?.match?.params.address || '');
    const [data, setData] = React.useState({ id: '', title: '', address: '', status: '', description: '' });
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(0);
    const { provider, signer } = React.useContext(Web3ProviderContext);
    const { setAlert, setAlertToggle } = React.useContext(FluteAlertContext);


    const forVotes = [
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
        { address: '0xc4...2391', vote: '938.29K' },
    ]
    const againstVotes = []
    const abstainVotes = []
    const [history, setHistory] = React.useState([]);
    React.useEffect(() => {

        getData(params?.match?.params?.address, params?.match?.params?.id);
        if (params?.match?.params.address) {
            setProposalAddress(params?.match?.params.address)
            // setData({...data, id:params?.match?.params?.id})
        }
        getProposalHistory(decimalToBigUints(params?.match?.params?.id, 0))
    }, [params?.match?.params.address]);

    const getData = async (_address, _id) => {
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
        let proposals = await governanceContract.getProposal(_address);
        proposals = proposals?.map((p) => { return { ...p } })
        proposals = proposals?.filter((p) => parseInt(p.id) === parseInt(_id));
        if (proposals) {
            setData({
                ...data,
                description: proposals[0].description,
                title: proposals[0].title,
                address: proposals[0].userAddress,
                status: proposals[0].status,
                id: _id,
            })
        }
    }

    const getProposalHistory = async (_id) => {
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);

        let proposalHistory = await governanceContract.getProposalHistory(decimalToBigUints(params?.match?.params?.id, 0));
        const phistory = [

            {
                label: 'Created',
                date: formatDate(proposalHistory.createdAt),
            },
            {
                label: 'Active',
                date: formatDate(proposalHistory.activeAt),
            },
            {
                label: 'Succeed',
                date: formatDate(proposalHistory.succeededAt),
            },
            {
                label: 'Queue',
                date: formatDate(proposalHistory.queueAt),
            },
            {
                label: 'Execute',
                date: formatDate(proposalHistory.executeAt),
            },
        ];

        if (Number(proposalHistory.rejectedAt) > 0) {
            phistory[2].label = "Rejected"
            phistory[2].date = formatDate(proposalHistory.rejectedAt)
        };

        console.log(phistory)
        phistory.forEach((his, index) => {
            if (his.date && index > activeStep) {
                setActiveStep(index)
            }
        })
        setHistory(phistory)
    }

    const voteNow = async (item) => {
        try {
            setAlert({ severity: 'info', title: 'Vote ' + item, description: 'Voting in progress' }
            );
            const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
            let result;
            if (item === "For") {
                result = await governanceContract.voteFor(decimalToBigUints(params?.match?.params?.id, 0), decimalToBig("100"));
            } else if (item === "Against") {
                result = await governanceContract.voteAgainst(decimalToBigUints(params?.match?.params?.id, 0), decimalToBig("100"));
            } else if (item === "Abstain") {
                result = await governanceContract.voteAgainst(decimalToBigUints(params?.match?.params?.id, 0), decimalToBig("100"));
            }
            await result.wait(1);
            window.location.reload();
        } catch (err) {
            setAlert({ severity: 'error', title: 'Vote', description: err.message });
        }
    }

    return (
        <React.Fragment key="RIGHT1">

            <Box
                sx={{
                    height: `calc(100% - ${theme.headerHeight})`,
                    background: theme.contentBackGround,
                    fontSize: '12px'
                }}
            >


                <Grid container direction="row" justifyContent="start" alignItems="flex-start"
                    spacing={2} style={{ width: '100%' }}
                >


                    <Grid item md={12} xs={12} >

                        <Card className={classes.card} >
                            <CardContent className={classes.cardContent} sx={{ paddingTop: '0px !important', paddingBottom: '0px !important', textAlign: 'left' }} >

                                <Grid container direction="row" justifyContent="start" alignItems="flex-left" spacing={1} style={{ width: '100%', textAlign: 'left', margin: 0 }}>

                                    <Grid item xs={12} sm={12} md={8} sx={{
                                        borderRight: {
                                            md: '0.5px solid ' + theme.borderColor,
                                            sm: '0px solid ' + theme.borderColor
                                        },
                                        borderBottom: {
                                            md: '0px solid ' + theme.borderColor,
                                            sm: '0.5px solid ' + theme.borderColor,
                                            xs: '0.5px solid ' + theme.borderColor
                                        },
                                        paddingBottom: '20px'
                                    }} >

                                        <Typography sx={{ fontSize: 12, fontWeight: 500, paddingBottom: '28px' }} variant="h4" >
                                            <span className={classes.chip}>
                                                {data?.id}
                                            </span>
                                            <Typography sx={{ fontSize: 11, width: '100%', color: theme.lightText, textAlign: 'left' }} variant="p" >
                                                Not voted
                                            </Typography>
                                        </Typography>
                                        <Typography sx={{ fontSize: '20px', width: '100%', color: 'white', fontWeight: 600, textAlign: 'left' }} variant="h3" >
                                            {data?.title}
                                        </Typography>
                                    </Grid>

                                    <Grid item xs={12} sm={12} md={4} sx={{}} >
                                        <div style={{ padding: '30px' }}>
                                            <Typography sx={{ fontSize: 15, width: '100%', color: theme.lightText, textAlign: 'left', marginBottom: '20px' }} variant="h2" >
                                                Proposal History
                                            </Typography>
                                            <Stepper activeStep={activeStep} orientation="vertical"
                                                className={classes.root}
                                            >
                                                {history.map((step, index) => (
                                                    <Step key={step.label}  >
                                                        <StepLabel
                                                        >

                                                            <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', width: '100%', justifyContent: 'space-between' }}><span> {step.label}</span> <Typography sx={{ color: theme.lightText, fontWeight: 500, fontSize: '11px', marginLeft: '5px', textAlign: 'right' }} > {step.date}</Typography></Typography>

                                                        </StepLabel>

                                                    </Step>
                                                ))}
                                            </Stepper>
                                        </div>
                                    </Grid>

                                </Grid>

                            </CardContent>
                        </Card>
                    </Grid>
                    {data.status === 'active' && <Grid item md={12} xs={12} container direction="row" justifyContent="start" alignItems="flex-start"
                        spacing={2} style={{ width: '100%' }}
                    >

                        <Grid item xs={12} sm={12} md={4} >

                            <Card className={classes.card} >

                                <CardContent className={classes.cardContent} sx={{ padding: '20px', textAlign: 'left' }} >
                                    <div className='d-flexSpaceBetween'>
                                        <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                            For
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                            50%
                                        </Typography>

                                    </div>
                                    <div className={classes.LinearProgress}>
                                        <LinearProgress variant="determinate" value={50} />
                                    </div>

                                    <AppBar key="rightbar"
                                        position="relative"
                                        className={classes.rightDrawerHeader}
                                        sx={{ height: 'auto', boxShadow: 'none !important' }}

                                        color="transparent"

                                    >
                                        <Button onClick={() => voteNow("For")} disabled={data?.status == "active" ? null : ''} sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: data?.status == "active" ? 'white' : theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
                                            For</Button>
                                    </AppBar>

                                    <div>
                                        <div className='d-flexSpaceBetween' style={{ paddingTop: '50px' }}>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                                {forVotes.length}   addresses
                                            </Typography>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, fontWeight: 500, marginBottom: '10px' }} variant="h2" >
                                                Votes
                                            </Typography>

                                        </div>
                                        <div
                                            style={{
                                                height: '100px',
                                                overflow: 'auto',
                                                padding: '0px 4px 4px 0px'
                                            }}>

                                            {
                                                forVotes.map(vote => {
                                                    return (
                                                        <div className='d-flexSpaceBetween'>
                                                            <Typography sx={{ fontSize: 15, color: 'blue', marginBottom: '10px' }} variant="h2" >
                                                                {vote.address}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                                                {vote.vote}
                                                            </Typography>

                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                        </Grid>
                        <Grid item xs={12} sm={12} md={4} >
                            <Card className={classes.card} >

                                <CardContent className={classes.cardContent} sx={{ padding: '20px', textAlign: 'left' }} >
                                    <div className='d-flexSpaceBetween'>
                                        <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                            Against
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                            0%
                                        </Typography>

                                    </div>
                                    <div className={classes.LinearProgress}>
                                        <LinearProgress variant="determinate" value={0} />
                                    </div>

                                    <AppBar key="rightbar"
                                        position="relative"
                                        className={classes.rightDrawerHeader}
                                        sx={{ height: 'auto', boxShadow: 'none !important' }}

                                        color="transparent"

                                    >
                                        <Button onClick={() => voteNow("Against")} disabled={data?.status == "active" ? null : ''} sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: data?.status == "active" ? 'white' : theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
                                            Against</Button>
                                    </AppBar>

                                    <div>
                                        <div className='d-flexSpaceBetween' style={{ paddingTop: '50px' }}>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                                {againstVotes.length}   addresses
                                            </Typography>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, fontWeight: 500, marginBottom: '10px' }} variant="h2" >
                                                Votes
                                            </Typography>

                                        </div>
                                        <div
                                            style={{
                                                height: '100px',
                                                overflow: 'auto',
                                                padding: '0px 4px 4px 0px'
                                            }}>

                                            {
                                                againstVotes.map(vote => {
                                                    return (
                                                        <div className='d-flexSpaceBetween'>
                                                            <Typography sx={{ fontSize: 15, color: 'blue', marginBottom: '10px' }} variant="h2" >
                                                                {vote.address}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                                                {vote.vote}
                                                            </Typography>

                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={12} md={4} >
                            <Card className={classes.card} >

                                <CardContent className={classes.cardContent} sx={{ padding: '20px', textAlign: 'left' }} >
                                    <div className='d-flexSpaceBetween'>
                                        <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                            Abstain
                                        </Typography>
                                        <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                            0%
                                        </Typography>

                                    </div>
                                    <div className={classes.LinearProgress}>
                                        <LinearProgress variant="determinate" value={0} />
                                    </div>

                                    <AppBar key="rightbar"
                                        position="relative"
                                        className={classes.rightDrawerHeader}
                                        sx={{ height: 'auto', boxShadow: 'none !important' }}

                                        color="transparent"

                                    >
                                        <Button onClick={() => voteNow("Abstain")} disabled={data?.status == "active" ? null : ''} sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: data?.status == "active" ? 'white' : theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
                                            Abstain</Button>
                                    </AppBar>

                                    <div>
                                        <div className='d-flexSpaceBetween' style={{ paddingTop: '50px' }}>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, marginBottom: '10px' }} variant="h2" >
                                                {abstainVotes.length}   addresses
                                            </Typography>
                                            <Typography sx={{ fontSize: 15, color: theme.lightText, fontWeight: 500, marginBottom: '10px' }} variant="h2" >
                                                Votes
                                            </Typography>

                                        </div>
                                        <div
                                            style={{
                                                height: '100px',
                                                overflow: 'auto',
                                                padding: '0px 4px 4px 0px'
                                            }}>

                                            {
                                                abstainVotes.map(vote => {
                                                    return (
                                                        <div className='d-flexSpaceBetween'>
                                                            <Typography sx={{ fontSize: 15, color: 'blue', marginBottom: '10px' }} variant="h2" >
                                                                {vote.address}
                                                            </Typography>
                                                            <Typography sx={{ fontSize: 15, fontWeight: 600, marginBottom: '10px' }} variant="h2" >
                                                                {vote.vote}
                                                            </Typography>

                                                        </div>
                                                    )
                                                })
                                            }

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Grid>

                    </Grid>}


                </Grid>
                <Grid container direction="row" justifyContent="start" alignItems="flex-start"
                    spacing={2} style={{ width: '100%' }}
                >


                    <Grid item md={12} xs={12} >
                        <Card className={classes.card} >

                            <CardContent className={classes.cardContent} sx={{ padding: '20px', textAlign: 'left' }} >
                                <h4 style={{ color: theme.lightText, fontSize: '18px' }}>
                                    Description
                                </h4>

                                {data?.description && (
                                    <div dangerouslySetInnerHTML={{ __html: data?.description }}></div>
                                )}
                                <h4 style={{ color: theme.lightText, fontSize: '18px', paddingTop: '30px' }}>
                                    Voting options
                                </h4>
                                <div dangerouslySetInnerHTML={{ __html: proposal.votingOptions }}></div>
                                <h4 style={{ color: theme.lightText, fontSize: '18px', paddingTop: '30px' }}>
                                    Operation
                                </h4>
                                <div dangerouslySetInnerHTML={{ __html: proposal.operations }}></div>

                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment >
    );
}
