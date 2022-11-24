import React, { useEffect, useRef } from 'react';
import { Grid, Box, Card, CardContent, Typography, Stepper, Step, StepLabel, StepContent, Button, AppBar, LinearProgress } from '@mui/material';
import { makeStyles } from '@mui/styles'
import theme from '../../theme';
import { CheckCircle } from '@mui/icons-material';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';







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

    const proposal={
        description:`                                <div class="wmde-markdown wmde-markdown-color css-xpu30a"><p>VIP-77 releases the changes implemented in <a href="https://github.com/VenusProtocol/venus-protocol/pull/164" target="_blank">PR 164</a>.</p>
        <p>The changes to the Comptroller contract allow for faster and more fine-grained reaction to changing market conditions:</p>
        <ul>
            <li>Supply cap is introduced to prevent market manipulation attacks.</li>
            <li>Risk parameters (collateral factor, supply cap, borrow cap) can now be configured with a risk manager multisig.</li>
            <li>Certain actions can now be paused and unpaused on a per-market basis without a VIP with a pause guardian multisig.</li>
        </ul>
        <p>Access control for risk parameters and pausing is now moved to a separate Access Control Manager contract.
            Governance owns the access control contract, so the roles can be asigned and unassigned by governance only.</p>
        <p>This VIP sets the supply cap for the following markets:</p>
        <ul>
            <li>SXP: 25M SXP</li>
            <li>LTC: 2M LTC</li>
            <li>XRP: 1B XRP</li>
            <li>BCH: 500K BCH</li>
            <li>DOT: 33M DOT</li>
            <li>LINK: 15M LINK</li>
            <li>FIL: 9M FIL</li>
            <li>ADA: 1B ADA</li>
            <li>DOGE: 4B DOGE</li>
            <li>MATIC: 262M MATIC</li>
            <li>CAKE: 7M CAKE</li>
            <li>AAVE: 422K AAVE</li>
            <li>LUNA: 0 LUNA</li>
            <li>UST: 0 UST</li>
        </ul>
        <p>The supply cap of 0 means that no further supply is allowed (so nothing changes for LUNA and UST). The supply caps are subject for further adjustment.</p></div>`,
        votingOptions:`<ul class="css-uf52su"><li>For - I agree that Venus Protocol should upgrade the Comptroller contract and set the supply caps</li><li>Against - I do not think that Venus Protocol should upgrade the Comptroller contract and set the supply caps</li><li>Abstain - I am indifferent to whether Venus Protocol upgrades the Comptroller contract and sets the supply caps</li></ul>`,
        operations:`<p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xfD36E2c2a6789Db23113685031d7F16329158384" target="_blank" rel="noreferrer">Comptroller</a>._setPendingImplementation("0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6")</p>
        <p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6" target="_blank" rel="noreferrer">0xAe8Ba50ee0a0E55EC21bf4ffE2c48d2FdF52D3e6</a>._become("0xfD36E2c2a6789Db23113685031d7F16329158384")</p><p class="MuiTypography-root MuiTypography-body1 css-nw98rb"><a class="MuiTypography-root MuiTypography-body1 css-1nhco9o" href="https://bscscan.com/address/0xfD36E2c2a6789Db23113685031d7F16329158384" target="_blank" rel="noreferrer">Comptroller</a>._setAccessControl("0x4788629ABc6cFCA10F9f969efdEAa1cF70c23555")</p>
        `
    }
    const [ProposalAddress, setProposalAddress] = React.useState(params?.match?.params.address || '');
    const [data, setData] = React.useState({id:'',title:'',address:'',status:'',description:''});
    const classes = useStyles();
    const [activeStep, setActiveStep] = React.useState(2);
    const { provider, signer } = React.useContext(Web3ProviderContext);

    


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
    const steps = [

        {
            label: 'Created',
            date: new Date().toISOString(),
        },
        {
            label: 'Active',
            date: new Date().toISOString(),
        },
        {
            label: 'Succeed',
            date: new Date().toISOString(),
        },
        {
            label: 'Queue',
            date: new Date().toISOString(),
        },
        {
            label: 'Execute',
            date: new Date().toISOString(),
        },
    ];
    React.useEffect(() => {
        console.log("=>",params?.match?.params?.id)
        console.log("=>",params?.match?.params?.address);
        getData(params?.match?.params?.address,params?.match?.params?.id);
        if (params?.match?.params.address) {
            setProposalAddress(params?.match?.params.address)
            // setData({...data, id:params?.match?.params?.id})
        }
    }, [params?.match?.params.address])

    const getData = async (_address,_id)=>{
        
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);
        let proposals = await governanceContract.getProposal(_address);
        proposals = proposals.map((p)=>{ return {...p} })
        proposals = proposals.filter((p)=> parseInt(p.id)===parseInt(_id));
        setData({...data,
            description:proposals[0].description,
            title:proposals[0].title,
            address:proposals[0].userAddress,
            status:proposals[0].status,
            id:_id,
        })
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
                                                {steps.map((step, index) => (
                                                    <Step key={step.label} >
                                                        <StepLabel
                                                        >

                                                            <Typography sx={{ color: 'white', fontSize: 12, fontWeight: 600, display: 'flex', width: '100%', justifyContent: 'space-between' }}><span> {step.label}</span> <Typography sx={{ color: theme.lightText, fontWeight: 500, fontSize: '11px' }} > {step.date}</Typography></Typography>

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
                    {data.status==='active' &&<Grid item md={12} xs={12} container direction="row" justifyContent="start" alignItems="flex-start"
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
                                        <Button disabled sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
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
                                        <Button disabled sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
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
                                        <Button disabled sx={{ width: "100%", borderRadius: '10px', minHeight: '45px', color: theme.lightText + ' ! important', fontWeight: '600' }} variant="contained" >
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

                    </Grid> }
                    

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

                                    <div dangerouslySetInnerHTML={{__html: proposal.description}}></div>
                                <h4 style={{ color: theme.lightText, fontSize: '18px', paddingTop: '30px' }}>
                                    Voting options
                                </h4>
                                <div dangerouslySetInnerHTML={{__html: proposal.votingOptions}}></div>
                                <h4 style={{ color: theme.lightText, fontSize: '18px', paddingTop: '30px' }}>
                                    Operation
                                </h4>
                                <div dangerouslySetInnerHTML={{__html: proposal.operations}}></div>
                               
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Box>
        </React.Fragment >
    );
}
