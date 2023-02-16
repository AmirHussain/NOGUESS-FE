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
import { FluteAlertContext } from '../../Components/Alert';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function CreateProposal(params) {

    const { setAlert} = React.useContext(FluteAlertContext);
    const [updatedRow, setUpdatedRow] = React.useState({})
    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);


    const addOrUpdateProposal = async () => {
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);

        if (!provider || !signer) {
            return
        }
      const index=  setAlert({ severity: 'info', title: 'Create Proposal', description: 'Proposal addition in progress' }
        );
        try {
            const response = await governanceContract.createProposal(
                updatedRow._title,
                updatedRow._description || '',
                updatedRow.proposal_Type || '',
                updatedRow.active_until.toISOString() || '',
                { gasLimit: 1000000 }
            )
             setAlert({ severity: 'info', title: 'Create Proposal', description: 'Proposal addition in progress',txhash:response.hash },index)

            await response.wait(1)
            if (response) {
                window.location.reload();
                params.setOpen(false)
            }
        } catch (err) {
            setAlert({ severity: 'error', title: 'Proposal', error: err },index);

        } finally { }
    }
    const handleValueChange = (value, key) => {
        const uprow = {
            ...updatedRow
        }
        uprow[key] = value

        setUpdatedRow(uprow)
    }
    const saveProposal = () => {
        addOrUpdateProposal()
    }
    return (
        <div>

            <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
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
                        {/* <TextField
                                InputLabelProps={{
                                    shrink: true,
                                }}
                                margin="dense"
                                id="_description"
                                onChange={(e) => handleValueChange(e.target.value, '_description')}
                                value={updatedRow?._description}
                                label="Description"
                                type="text"
                                fullWidth
                                variant="standard"


                            /> */}

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
        </Dialog>
        </div >
    );
}