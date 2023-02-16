import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, Grid, InputLabel, Switch } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { FluteAlertContext } from '../../Components/Alert';
import { decimalToBig } from '../../utils/utils';

export default function AddUpdateBorrowLimitations(params) {

  const { setAlert} = React.useContext(FluteAlertContext);

  const [row, setRow] = React.useState({})

  const [updatedRow, setUpdatedRow] = React.useState({})

  React.useEffect(() => {
    if (params.currentRow && Object.keys(params.currentRow).length)
      setRow(params.currentRow)
    const uprow = { intrestRateModal: params?.currentRow?.intrestRateModal, borrowLimitations: params?.currentRow?.borrowLimitations, tokenAddress: params.currentRow.address }
    console.log(uprow)
    setUpdatedRow(uprow)

  }, [params.currentRow])
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const addOrUpdateToken = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
    const index= setAlert({ severity: 'info', title: 'Borrow Limitation', description: 'Borrow Limitation update in progress' }
    );
    try {

      const response1 = await governanceContract.AddOrUpdateTokenBorrowLimiations(
        updatedRow.tokenAddress,
        decimalToBig(updatedRow.borrowLimitations.CollateralFator),
        decimalToBig(updatedRow.borrowLimitations.LiquidationThreshold),
        decimalToBig(updatedRow.borrowLimitations.LiquidationPenalty),
        decimalToBig(updatedRow.borrowLimitations.ProtocolShare),
        decimalToBig(updatedRow.borrowLimitations.InitialBorrowRate),
        decimalToBig(updatedRow.borrowLimitations.MAX_UTILIZATION_RATE),
        updatedRow.borrowLimitations.AllowStableJob
        , { gasLimit: 1000000 }
      )
        setAlert({ severity: 'info', title: 'Borrow Limitation', description: 'Borrow Limitation update in progress',txhash:response1.hash },index)

      const response = await governanceContract.AddOrUpdateTokenIntrestRateModel(
        updatedRow.tokenAddress,
        decimalToBig(updatedRow.intrestRateModal.OPTIMAL_UTILIZATION_RATE),
        decimalToBig(updatedRow.intrestRateModal.StableRateSlope1),
        decimalToBig(updatedRow.intrestRateModal.StableRateSlope2),
        decimalToBig(updatedRow.intrestRateModal.VariableRateSlope1),
        decimalToBig(updatedRow.intrestRateModal.VariableRateSlope2),
        decimalToBig(updatedRow.intrestRateModal.BaseRate)
        , { gasLimit: 1000000 }
      )
      setAlert({ severity: 'info', title: 'Borrow Limitation', description: 'Borrow Limitation update in progress',txhash:response.hash },index)

      await response.wait(1)
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false)
      }

    } catch (err) {
      setAlert({ severity: 'error', title: 'Borrow Limitation', error: err },index);

    } finally { }
  }
  const handleValueChange = (value, isBorrowLimitations, key) => {
    const uprow = {
      ...updatedRow
    }
    isBorrowLimitations ? uprow.borrowLimitations[key] = value : uprow.intrestRateModal[key] = value

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
          Update  Borrow Limitations
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
                fullWidth
                variant="standard"
                disabled
              />
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={2} >
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="CollateralFator"
                onChange={(e) => handleValueChange(e.target.value, true, 'CollateralFator')}
                value={updatedRow?.borrowLimitations?.CollateralFator}
                label="Collateral Fator"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="LiquidationThreshold"
                onChange={(e) => handleValueChange(e.target.value, true, 'LiquidationThreshold')}
                value={updatedRow?.borrowLimitations?.LiquidationThreshold}
                label="LiquidationThreshold"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="LiquidationPenalty"
                onChange={(e) => handleValueChange(e.target.value, true, 'LiquidationPenalty')}
                value={updatedRow?.borrowLimitations?.LiquidationPenalty}
                label="LiquidationPenalty"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="ProtocolShare"
                onChange={(e) => handleValueChange(e.target.value, true, 'ProtocolShare')}
                value={updatedRow?.borrowLimitations?.ProtocolShare}
                label="ProtocolShare"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="InitialBorrowRate"
                onChange={(e) => handleValueChange(e.target.value, true, 'InitialBorrowRate')}
                value={updatedRow?.borrowLimitations?.InitialBorrowRate}
                label="InitialBorrowRate"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="MAX_UTILIZATION_RATE"
                onChange={(e) => handleValueChange(e.target.value, true, 'MAX_UTILIZATION_RATE')}
                value={updatedRow?.borrowLimitations?.MAX_UTILIZATION_RATE}
                label="MAX_UTILIZATION_RATE"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <InputLabel>AllowStableJob</InputLabel>
              <Switch
                checked={updatedRow?.borrowLimitations?.AllowStableJob}
                onChange={(e) => handleValueChange(e.target.value, true, 'AllowStableJob')}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2} >
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="OPTIMAL_UTILIZATION_RATE"
                onChange={(e) => handleValueChange(e.target.value, false, 'OPTIMAL_UTILIZATION_RATE')}
                value={updatedRow?.intrestRateModal?.OPTIMAL_UTILIZATION_RATE}
                label="OPTIMAL_UTILIZATION_RATE"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>

            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="StableRateSlope1"
                onChange={(e) => handleValueChange(e.target.value, false, 'StableRateSlope1')}
                value={updatedRow?.intrestRateModal?.StableRateSlope1}
                label="stableRateSlope1"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="StableRateSlope2"
                onChange={(e) => handleValueChange(e.target.value, false, 'StableRateSlope2')}
                value={updatedRow?.intrestRateModal?.StableRateSlope2}
                label="StableRateSlope2"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="VariableRateSlope1"
                onChange={(e) => handleValueChange(e.target.value, false, 'VariableRateSlope1')}
                value={updatedRow?.intrestRateModal?.VariableRateSlope1}
                label="VariableRateSlope1"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="VariableRateSlope2"
                onChange={(e) => handleValueChange(e.target.value, false, 'VariableRateSlope2')}
                value={updatedRow?.intrestRateModal?.VariableRateSlope2}
                label="VariableRateSlope2"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3} >
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="BaseRate"
                onChange={(e) => handleValueChange(e.target.value, false, 'BaseRate')}
                value={updatedRow?.intrestRateModal?.BaseRate}
                label="BaseRate"
                type="number"
                min="0"
                max="1"
                inputProps={{ inputMode: 'numeric', pattern: '[0-1]*' }}
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