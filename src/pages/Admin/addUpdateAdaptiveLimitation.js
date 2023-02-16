import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Autocomplete, Avatar, Checkbox, FilledInput, FormControl, FormControlLabel, Grid, IconButton, InputAdornment, InputLabel, MenuItem, Select } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { FluteAlertContext } from '../../Components/Alert';
import { decimalToBigUnits } from '../../utils/utils';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';
const useStyles = makeStyles({
  rightBar: {
    zIndex: theme.drawerIndex + 1,
    color: theme.headerText,
    fontStyle: 'bold',

  },
  selectOperator: {
    border: 'none',
    "& .MuiInputBase-root": {
      borderBottom: 'none !important',
      "&:hover": {
        borderBottom: 'none !important',
      }
    },
    "& .MuiSvgIcon-root": {
      display: "none !important"
    }
  },
  inputField: {
    background: 'transparent',
    marginBottom: "10px",
    "&:hover": {
      background: 'transparent'
    }
    ,
    "& .MuiFilledInput-root": {
      alignItems: "baseline",
      "&:hover": {
        background: 'transparent'
      }
    }
  }
});
export default function AddUpdateAdaptiveLimitation(params) {

  const classes = useStyles();
  const { setAlert } = React.useContext(FluteAlertContext);



  const [updatedRow, setUpdatedRow] = React.useState({})

  React.useEffect(() => {
    if (params.currentRow && Object.keys(params.currentRow).length) {
      const row = Object.assign({}, params?.currentRow)
      setUpdatedRow(row)
    }

  }, [params.currentRow])
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const addOrUpdateToken = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
   const index= setAlert({ severity: 'info', title: 'Adative limit', description: 'Token adaptive limit update in progress' }
    );
    try {
      let response;
      if (params.newRow) {
        response = await governanceContract.AddTokenAdaptiveLimitations(
          params.currentToken.address,
          updatedRow.Utilization,
          updatedRow.Withdraw,
          updatedRow.Borrow,
          updatedRow.Replenish,
          updatedRow.Redeem, { gasLimit: 1000000 }
        )
      } else {
        response = await governanceContract.UpdateTokenAdaptiveLimitations(
          params.currentToken.address,
        decimalToBigUnits(params.rowIndex.toString(),0),
          updatedRow.Utilization,
          updatedRow.Withdraw,
          updatedRow.Borrow,
          updatedRow.Replenish,
          updatedRow.Redeem, { gasLimit: 1000000 }
        )
      }
      setAlert({ severity: 'info', title: 'Adative limit', description: 'Token adaptive limit update in progress',txhash:response.hash },index)

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

  const handleDelete = async () => {
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);

    if (!provider || !signer) {
      return
    }
   const index= setAlert({ severity: 'info', title: 'Token Adaptive Limitation', description: 'Token Adaptive Limitation deletion in progress' }
    );
    try {
      const response = await governanceContract.RemoveTokenAdaptiveLimitations(
        updatedRow.tokenAddress,
        params.rowIndex,
        { gasLimit: 100000 }
      )
      
      setAlert({ severity: 'info', title: 'Token Adaptive Limitation', description: 'Token Adaptive Limitation deletion in progress',txhash:response.hash },index)

      await response.wait(1)
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false)
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Token Adaptive Limitation', error: err },index);

    } finally { }
  }

  const handleValueChange = (value, key) => {
    const uprow = {
      ...updatedRow
    }
    uprow[key] = value

    setUpdatedRow(uprow)
  }
  const saveAggregator = () => {
    const token = { ...updatedRow }
    addOrUpdateToken()
  }
  const range = [
    "Paused", "No Limit"
  ]
  const getRangeValue = (value) => {

    if (typeof value === "string") {
      return value
    } else {
      return range[value];
    }

  }

  return (
    <div>

      <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>

          {params.newRow ? 'Add' : 'Update'}  Adaptive Limitation
        </DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={2} >

            <Grid item xs={12} sm={12} md={12} className={classes.inputField}>
              <FormControl variant="standard"
                fullWidth >
                <InputLabel htmlFor="filled-adornment-Utilization">Utilization</InputLabel>
                <FilledInput

                  id="Utilization"
                  type="text"
                  sx={{ background: 'transparent' }}
                  InputLabelProps={{
                    shrink: true,
                  }}

                  value={updatedRow?.Utilization}
                  onChange={(e) => handleValueChange(e.target.value, 'Utilization')}
                  startAdornment={
                    <InputAdornment position="start">
                      <Select
                        className={classes.selectOperator}
                        variant="standard"
                        id="demo-simple-select"
                        value={updatedRow?.operator}

                        onChange={(e) => handleValueChange(e.target.value, 'operator')}
                      >
                        <MenuItem value=">">{">"}</MenuItem>
                        <MenuItem value="<=">{"<="}</MenuItem>
                      </Select>
                    </InputAdornment>
                  }
                  endAdornment="%"
                />
              </FormControl>
            </Grid>

          </Grid>

          <Grid container direction="row" spacing={2} >
            <Grid item xs={6} sm={6} md={6} >

              <Autocomplete

                fullWidth
                variant="standard"
                value={updatedRow?.Withdraw}
                onChange={(e) => handleValueChange(getRangeValue(e.target.value), 'Withdraw')}
                freeSolo
                options={range.map((option) => option)}
                renderInput={(params) =>
                  <TextField {...params} sx={{ marginTop: '10px' }}
                    value={updatedRow?.Withdraw}
                    onChange={(e) => handleValueChange(getRangeValue(e.target.value), 'Withdraw')}
                    id="demo-withdraw"
                    InputLabelProps={{
                      shrink: true,
                    }} label="Withdraw" variant="standard" />}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} >

              <Autocomplete

                fullWidth
                variant="standard"
                value={updatedRow?.Borrow}
                onChange={(e) => handleValueChange(getRangeValue(e.target.value), 'Borrow')}
                freeSolo
                options={range.map((option) => option)}
                renderInput={(params) =>
                  <TextField  {...params} sx={{ marginTop: '10px' }}
                    value={updatedRow?.Borrow}
                    id="demo-Borrow"
                    onChange={(e) => handleValueChange(getRangeValue(e.target.value), 'Borrow')}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    label="Borrow" variant="standard" />}
              />
            </Grid>

          </Grid>
          <Grid container direction="row" spacing={2} >
            <Grid item xs={6} sm={6} md={6} >
              <FormControlLabel
                control={
                  <Checkbox checked={updatedRow?.Replenish}
                    onChange={(e) => handleValueChange(e.target.value === "on", 'Replenish')} name="Replenish" />
                }
                label="Replenish"
              />

            </Grid>
            <Grid item xs={6} sm={6} md={6} >
              <FormControlLabel
                control={
                  <Checkbox checked={updatedRow?.Redeem}
                    onChange={(e) => handleValueChange(e.target.value === "on", 'Redeem')}
                    name="Redeem" />
                }
                label="Redeem"
              />

            </Grid>

          </Grid>
        </DialogContent>
        <DialogActions>
          {!params.newRow && (

            <Button sx={{ position: 'absolute', left: '10px' }} onClick={() => handleDelete()} variant="contained" color="error">Delete</Button>
          )}
          <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
          <Button onClick={() => saveAggregator()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}