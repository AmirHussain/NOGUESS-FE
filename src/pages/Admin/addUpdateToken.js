import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Grid } from '@mui/material';

export default function AddUpdateToken(params) {

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

  const handleValueChange = (value, key) => {
    const uprow = {
      ...updatedRow
    }
    uprow[key] = value

    setUpdatedRow(uprow)
  }

  const saveToken = () => {
    const token = { ...updatedRow }
    token.pedgeToken = false;
  }
  return (
    <div>

      <Dialog open={params.open} onClose={params.handleClose} sx={{ maxWidth: '100vw', minWidth: '60vw' }}>
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

            <Button onClick={params.handleClose} sx={{ position: 'absolute', left: '10px' }} variant="contained" color="error">Delete</Button>
          )}
          <Button onClick={params.handleClose} variant="outlined" >Cancel</Button>
          <Button onClick={() => saveToken()} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}