import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';

import dayjs from 'dayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import DialogTitle from '@mui/material/DialogTitle';
import { FormControl, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { NUOGUESSAlertContext } from '../../Components/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import AwesomeSlider from 'react-awesome-slider';
import 'react-awesome-slider/dist/styles.css';
import UserBalance from '../../Components/Balance';
import { Flex } from 'antd';
import { bigToDecimal, decimalToBig, decimalToBigUnits } from '../../utils/utils';
import * as dotenv from 'dotenv';
import { ethers } from 'ethers';

dotenv.config();

export default function GamePage(params) {

    const { setAlert } = React.useContext(NUOGUESSAlertContext);
    const [updatedRow, setUpdatedRow] = React.useState({})

    const [gameTypeSelected, setGameTypeSelected] = React.useState(false);
    const [eventRegistered, setEventRegistered] = React.useState(false);
    const [gameType, setGameType] = React.useState(0);

    const { connectWallet, provider, signer, account } = React.useContext(Web3ProviderContext);

    const [playerNumber, setPlayerNumber] = React.useState('');
    const [playerStake, setPlayerStake] = React.useState('');
    const [totalWins, setTotalWins] = React.useState(0);
    const [userData, setUserData] = React.useState(true);

    const handlePlay = async (level) => {
        const gameContract = makeContract(contractAddresses.game, abis.GAME, signer || provider);

        if (!account) {
            return
        }
        const index = setAlert({ severity: 'info', title: 'Please wait', description: 'Confirm the transaction on metamask.' });
        const response = await gameContract.playGame(
            decimalToBigUnits(level, 0),
            decimalToBigUnits(playerNumber.toString(), 0),
            decimalToBig(playerStake.toString()),
            { gasLimit: 1000000 },
        )
        setAlert({ severity: 'info', title: 'Please wait', description: 'Submitting your answer on chain.' }, index);
        response.wait(2)
        setAlert({ severity: 'success', title: 'Please wait', description: 'Answer submitted successfully' }, index);
    };
    const showResult = (sender, level, number, stake, win, reward) => {
        setUserData(false)
        if (win) {
            setAlert({ severity: 'success', title: 'Hurray', description: 'You won you recieved ' + bigToDecimal(reward) + ' NGTs' });
        } else {
            setAlert({ severity: 'error', title: 'Alas!', description: 'You lost try again' });
        }
        setTimeout(()=>{
            setUserData(true);

        },3000)

    }
    const registerContractListner = async () => {
        const newprovider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_INFURA_ENDPOINT);
        const contractAddress = contractAddresses.game;

        const contract = new ethers.Contract(contractAddress, abis.GAME, newprovider);

        // Event to listen to (replace with your specific event)
        const eventName = 'GamePlayed';

        // Start listening to Ethereum events
        contract.on(eventName, showResult)
    }
    React.useEffect(() => {
        if (!eventRegistered) {
            setEventRegistered(true);
            registerContractListner();
        }
    })
    return (
        <div>
            <div className="game-page-container">
                {account && userData && (
                    <UserBalance></UserBalance>
                )}
                <div className="game-card-container">

                    <AwesomeSlider>
                        <div className="card-container">
                            <div className="card">
                                <div className="card-header">
                                    <div className="heading-left"><h3>Easy Mode</h3>   </div>
                                    <span className="heading-right">  <div ><b> Rewards</b> </div>
                                        <Flex style={{ justifyContent: 'space-evenly', lineHeight: '12px', fontSize: '12px' }}>
                                            <div>Single win <span><b>500%</b></span> </div>

                                            <div> Consecutive 3 wins <span><b>2000%</b></span> </div>
                                        </Flex>
                                    </span>
                                </div>
                                <div className='card-content'>

                                    <p>Pick a number from 1-3</p>
                                    <input
                                        type="number"
                                        placeholder="Enter number"
                                        value={playerNumber}
                                        onChange={(e) => setPlayerNumber(e.target.value)}
                                    />
                                    <p>Stake an amount between 1 - 100</p>
                                    <input
                                        type="number"
                                        placeholder="Enter stake"
                                        value={playerStake}
                                        onChange={(e) => setPlayerStake(e.target.value)}
                                    />
                                    <br/><button className="actionButton" onClick={() => handlePlay('0')}>Play</button>
                                    
                                    {/* Display other game details */}
                                </div>

                            </div>
                        </div>

                        <div className="card-container">
                            <div className="card">
                                <div className="card-header">
                                    <div className="heading-left medium"><h3>Medium Mode</h3>   </div>
                                    <span className="heading-right">  <div ><b> Rewards</b> </div>
                                        <Flex style={{ justifyContent: 'space-evenly', lineHeight: '12px', fontSize: '12px' }}>
                                            <div>Single win <span><b>1000%</b></span> </div>

                                            <div> Consecutive 7 wins <span><b>5000%</b></span> </div>
                                        </Flex>
                                    </span>
                                </div>
                                <div className='card-content'>

                                    <p>Pick a number from 1-5</p>
                                    <input
                                        type="number"
                                        placeholder="Enter number"
                                        value={playerNumber}
                                        onChange={(e) => setPlayerNumber(e.target.value)}
                                    />
                                    <p>Stake an amount between 100 - 1000</p>
                                    <input
                                        type="number"
                                        placeholder="Enter stake"
                                        value={playerStake}
                                        onChange={(e) => setPlayerStake(e.target.value)}
                                    />
                                    <br/><button className="button-large" onClick={() => handlePlay('1')}>Play</button>
                                    
                                    {/* Display other game details */}
                                </div>

                            </div>
                        </div>
                        <div className="card-container">
                            <div className="card">
                                <div className="card-header">
                                    <div className="heading-left difficult"><h3>Difficult Mode</h3>   </div>
                                    <span className="heading-right">  <div ><b> Rewards</b> </div>
                                        <Flex style={{ justifyContent: 'space-evenly', lineHeight: '12px', fontSize: '12px' }}>
                                            <div>Single win <span><b>3000%</b></span> </div>

                                            <div>  <b>5000%</b> bonus in their next win which adds by <b>200%</b> in each win until loss.</div>
                                        </Flex>
                                    </span>
                                </div>
                                <div className='card-content'>

                                    <p>Pick a number from 1- 10</p>
                                    <input
                                        type="number"
                                        placeholder="Enter number"
                                        value={playerNumber}
                                        onChange={(e) => setPlayerNumber(e.target.value)}
                                    />
                                    <p>Stake an amount between 1000 - 100,000 </p>
                                    <input
                                        type="number"
                                        placeholder="Enter stake"
                                        value={playerStake}
                                        onChange={(e) => setPlayerStake(e.target.value)}
                                    />
                                    <br/><button className="button-large" onClick={() => handlePlay('2')}>Play</button>
                                    
                                    {/* Display other game details */}
                                </div>

                            </div>
                        </div>
                    </AwesomeSlider>
                </div>
            </div>

            {/* <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
                <DialogTitle>
                    Create Proposal
                </DialogTitle>
                <DialogContent>
                    <Grid container direction="row" spacing={2} >

                        <Grid item xs={12} sm={12} md={12} >
                            <TextField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                value={updatedRow?._title}
                                margin="dense"
                                id="_title"
                                label="Title"
                                type="text"
                                onChange={(e) => handleValueChange(e.target.value, '_title')}
                                fullWidth
                                variant="standard"
                            />
                        </Grid>
                    </Grid>

                    <Grid container direction="row" spacing={2} >
                        <Grid item xs={5} sm={5} md={5} >
                            <FormControl fullWidth>
                                <InputLabel variant="standard" htmlFor="uncontrolled-native">
                                    Proposal Type
                                </InputLabel>
                                <Select
                                    labelId="demo-simple-select-filled-label"
                                    id="demo-simple-select-filled"
                                    value={updatedRow.proposal_Type}
                                    label="Proposal Type"
                                    variant="standard"

                                    shrink="true"
                                    onChange={(e) => handleValueChange(e.target.value, 'proposal_Type')}
                                >
                                    <MenuItem value="">
                                        <em>None</em>
                                    </MenuItem>
                                    <MenuItem value="AddToken">Add token</MenuItem>
                                    <MenuItem value="RetireToken">Retire Token</MenuItem>
                                    <MenuItem value="UpdateBorrowLimitations">Update Borrow Limitations</MenuItem>
                                    <MenuItem value="UpdateAdaptiveLimitation">Update adaptive limitation</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={7} sm={7} md={7} >
                            <FormControl fullWidth>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label="Active Until"
                                        value={updatedRow.active_until}
                                        onChange={(e) => handleValueChange(new Date(e), 'active_until')}
                                        renderInput={(params) => <TextField {...params} InputLabelProps={{
                                            shrink: true,
                                        }}
                                            variant="standard" />}
                                    />
                                </LocalizationProvider>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid container direction="row" spacing={2} >
                        <Grid item xs={8} sm={8} md={8} >
                           

                            <p style={{ fontSize: '12px' }}>
                                Description
                            </p>
                            <ReactQuill theme="snow" value={updatedRow?._description}
                                style={{ minWidth: '40vw' }}
                                onChange={(e) => handleValueChange(e, '_description')}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
                    <Button onClick={() => saveProposal()} variant="contained">Save</Button>
                </DialogActions>
            </Dialog> */}
        </div >
    );
}