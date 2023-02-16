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

export default function AddUpdateToken(params) {

  const { setAlert} = React.useContext(FluteAlertContext);

  const [row, setRow] = React.useState({})

  const [updatedRow, setUpdatedRow] = React.useState({})

  React.useEffect(() => {
    if (params.currentRow && Object.keys(params.currentRow).length)
      setRow(params.currentRow)
    const uprow = { ...params.currentRow }
    uprow.tokenAddress = params.currentRow?.address
    delete uprow["address"];
    setUpdatedRow(uprow)

  }, [params.currentRow])
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const addOrUpdateToken = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
   const index= setAlert({ severity: 'info', title: 'Token ' + (params.newRow ? 'Addition' : 'Update'), description: 'Token addition in progress' }
    );
    try {
      const response = await governanceContract.AddOrUpdateToken(
        updatedRow.tokenAddress,
        updatedRow.symbol || '',
        updatedRow.name || '',
        updatedRow.icon || '',
        updatedRow.abiJSON || '[]',
        updatedRow.pedgeToken || '',
        false,
        false,
        params.newRow, { gasLimit: 1000000 }
      )
       setAlert({ severity: 'info', title: 'Token ' + (params.newRow ? 'Addition' : 'Update'), description: 'Token addition in progress', txhash:response.hash},index
      );
  
      await response.wait(1)
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false)
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Token', error: err },index);

    } finally { }
  }
  const handleValueChange = (value, key) => {
    const uprow = {
      ...updatedRow
    }
    uprow[key] = value

    setUpdatedRow(uprow)
  }
  const handleDelete = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
    setAlert({ severity: 'info', title: 'Token Deletion', description: 'Token deletion in progress' }
    );
    try {
      const response = await governanceContract.deleteToken(
        updatedRow.tokenAddress,
      true, { gasLimit: 100000 }
      )
      await response.wait(1)
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false)
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Token', error: err });

    } finally { }
  }
  const saveToken = () => {
    const token = { ...updatedRow }
    token.pedgeToken = false;
    addOrUpdateToken()
  }
  return (
    <div>

      <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
        <DialogTitle>
          {params.newRow ? 'Add ' : 'Update '} Token
        </DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={2} >

            <Grid item xs={12} sm={12} md={12} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                value={updatedRow?.tokenAddress}
                margin="dense"
                id="tokenAddress"
                label="Address"
                type="text"
                onChange={(e) => handleValueChange(e.target.value, 'tokenAddress')}
                fullWidth
                variant="standard"
                disabled={params.newRow ? false : true}
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
                id="name"
                onChange={(e) => handleValueChange(e.target.value, 'name')}
                value={updatedRow?.name}
                label="Name"
                type="text"
                fullWidth
                variant="standard"


              />
            </Grid>
            <Grid item xs={4} sm={4} md={4} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleValueChange(e.target.value, 'symbol')}
                value={updatedRow?.symbol}
                margin="dense"
                id="symbol"
                label="Symbol"
                type="text"
                fullWidth
                variant="standard"
                disabled={params.newRow ? false : true}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} >
            <Grid item xs={12} sm={12} md={12} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}

                onChange={(e) => handleValueChange(e.target.value, 'icon')}
                value={updatedRow?.icon}
                margin="dense"
                id="icon"
                label="Icon Url"
                type="url"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={12} sm={12} md={12} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}

                onChange={(e) => handleValueChange(e.target.value, 'abiJSON')}
                margin="dense"
                id="abiJSON"
                label="abiJSON"
                type="abiJSON"
                value={updatedRow?.abiJSON}
                fullWidth
                variant="standard"
              />

            </Grid>


            <Grid item xs={12} sm={12} md={12} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleValueChange(e.target.value, 'isPedgeToken')}
                margin="dense"
                id="isPedgeToken"
                label="isPedgeToken"
                type="text"
                value={updatedRow?.isPedgeToken}
                fullWidth
                variant="standard"
              />

            </Grid>


            <Grid item xs={12} sm={12} md={12} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}

                onChange={(e) => handleValueChange(e.target.value, 'pedgeToken')}
                margin="dense"
                id="pedgeToken"
                label="pedgeToken"
                type="text"
                value={updatedRow?.pedgeToken}
                fullWidth
                variant="standard"
              />

            </Grid>


          </Grid>
          {/* isDeleted */}
        </DialogContent>
        <DialogActions>
          {!params.newRow && (

            <Button onClick={()=>handleDelete()} sx={{ position: 'absolute', left: '10px' }} variant="contained" color="error">Delete</Button>
          )}
          <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
          <Button onClick={() => saveToken()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}