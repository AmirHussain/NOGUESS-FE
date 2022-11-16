import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Grid } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { FluteAlertContext } from '../../Components/Alert';
import { decimalToBigUints } from '../../utils/utils';

export default function AddUpdateAggregator(params) {

  const { setAlert, setAlertToggle } = React.useContext(FluteAlertContext);

  const [row, setRow] = React.useState({})

  const [updatedRow, setUpdatedRow] = React.useState({})

  React.useEffect(() => {
    if (params.currentRow && Object.keys(params.currentRow).length)
      setRow(params.currentRow)
    const uprow = { ...params?.currentRow }
    setUpdatedRow(uprow)

  }, [params.currentRow])
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const addOrUpdateToken = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
    setAlert({ severity: 'info', title: 'Aggregator Update', description: 'Token aggregate update in progress' }
    );
    try {
      const response = await governanceContract.UpdateAggregators(
        params.currentRow.address,
        updatedRow.aggregator.aggregator,
        decimalToBigUints(updatedRow.aggregator.decimals || 18, 0),
        true, { gasLimit: 1000000 }
      )
      await response.wait(1)
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false)
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Token', description: err.message });

    } finally { }
  }
  const handleValueChange = (value, key) => {
    const uprow = {
      ...updatedRow
    }
    uprow.aggregator[key] = value

    setUpdatedRow(uprow)
  }
  const saveAggregator = () => {
    const token = { ...updatedRow }
    addOrUpdateToken()
  }
  return (
    <div>

      <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="" src={params?.currentRow?.icon} />
          Update  Aggregator
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
                disabled
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
                id="aggregator"
                onChange={(e) => handleValueChange(e.target.value, 'aggregator')}
                value={updatedRow?.aggregator?.aggregator}
                label="Aggregator Address"
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
                onChange={(e) => handleValueChange(e.target.value, 'decimals')}
                value={updatedRow?.aggregator?.decimals}
                margin="dense"
                id="decimal"
                label="Decimal"
                type="number"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>

        </DialogContent>
        <DialogActions>

          <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
          <Button onClick={() => saveAggregator()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}