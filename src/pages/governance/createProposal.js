import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { FluteAlertContext } from '../../Components/Alert';

export default function CreateProposal(params) {

    const { setAlert, setAlertToggle } = React.useContext(FluteAlertContext);


    const [updatedRow, setUpdatedRow] = React.useState({})
    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

    const addOrUpdateProposal = async () => {
        const governanceContract = makeContract(contractAddresses.governanceVoting, abis.governanceVoting, signer);

        if (!provider || !signer) {
            return
        }
        setAlert({ severity: 'info', title: 'Create Proposal', description: 'Proposal addition in progress' }
        );
        try {
            const response = await governanceContract.createProposal(
                updatedRow._title,
                updatedRow._description || '',
                { gasLimit: 1000000 }
            )
            await response.wait(1)
            if (response) {
                window.location.reload();
                params.setOpen(false)
            }
        } catch (err) {
            setAlert({ severity: 'error', title: 'Proposal', description: err.message });

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
                        <Grid item xs={8} sm={8} md={8} >
                            <TextField
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


                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
                    <Button onClick={() => saveProposal()} variant="contained">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}