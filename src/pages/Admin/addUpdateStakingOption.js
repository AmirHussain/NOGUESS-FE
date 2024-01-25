import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { Avatar, FormControl, FormControlLabel, Grid, InputLabel, ListItemText, MenuItem, OutlinedInput, Select, Switch } from '@mui/material';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
import { NUOGUESSAlertContext } from '../../Components/Alert';
import { bigToDecimalUnits, decimalToBigUnits } from '../../utils/utils';
import { TokenContext } from '../../tokenFactory';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';

const useStyles = makeStyles({
  rightBar: {
    zIndex: theme.drawerIndex + 1,
    background: theme.headerBackground,
    color: theme.headerText,
    fontStyle: 'bold',
  },

  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down',
  },

  sideBar: {
    background: '#050506',
    color: 'white',
  },
  textHighlighted: theme.textHighlighted,
  sectionHeading: theme.sectionHeading,
  textBoldWhite: theme.textBoldWhite,
  textMuted: theme.textMuted,
  innerCard: theme.innerCard,
  modal: theme.modal,
  drawer: theme.drawer,
  drawerPaper: theme.rightDrawerPaper,
  textBold: theme.textBold,

  actionButton: theme.actionButton2,
});

const MenuProps = {
  PaperProps: {
    style: {
      width: 250,
    },
  },
};

export default function AddUpdateStakingOption(params) {
  const { setAlert } = React.useContext(NUOGUESSAlertContext);

  const [row, setRow] = React.useState({});
  const [newRow, setNewRow] = React.useState(false);
  const [updatedRow, setUpdatedRow] = React.useState({});
  const [stakingToken, setStakingToken] = React.useState({});
  const classes = useStyles();

  React.useEffect(() => {
    if (params.currentRow && Object.keys(params.currentRow).length) {
      setRow(params.currentRow);
    }
    let uprow = { ...params?.currentRow };
    if (params.newRow || !uprow) {
      uprow = getDefaultValues();
      setNewRow(true);
    }
    setUpdatedRow(uprow);
  }, [params.currentRow]);

  const getDefaultValues = () => {
    return {
      staking_contract_address: contractAddresses.staking,
      staking_token: {
        token_name: 'Pedge USDT',
        token_address: '0x0455A1cC4E88A146A98f83D35e94e1D6a3BE2759',
        token_image: 'https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png',
        token_symbol: 'VST',
      },
      plane_name: '',
      min_deposit: '',
      max_deposit: '',
      life_days: '36135',
      percent: '72270',
      num_of_days: '7',
      ref_bonus: '5',
      isActive: true,
    };
  };
  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const addOrUpdateToken = async () => {
    const stakingOfferingsContract = makeContract(contractAddresses.stakingOfferings, abis.stakingOfferings, signer);

    if (!provider || !signer) {
      return;
    }
    const index = setAlert({ severity: 'info', title: 'Staking Option Update', description: 'Staking option update in progress' });
    try {
      let response;
      if (newRow) {
        response = await stakingOfferingsContract.AddStakingOption(
          updatedRow.staking_contract_address,
          updatedRow.staking_token,
          updatedRow.plane_name,
          updatedRow.min_deposit,
          updatedRow.max_deposit,
          decimalToBigUnits(updatedRow.life_days, 0),
          decimalToBigUnits(updatedRow.percent, 0),
          decimalToBigUnits(updatedRow.num_of_days, 0),
          decimalToBigUnits(updatedRow.ref_bonus, 0),
          { gasLimit: 1000000 },
        );
      } else {
        response = await stakingOfferingsContract.updateStakingOption(
          updatedRow.staking_contract_address,
          updatedRow.staking_token,
          updatedRow.plane_name,
          updatedRow.min_deposit,
          updatedRow.max_deposit,
          decimalToBigUnits(updatedRow.life_days, 0),
          decimalToBigUnits(updatedRow.percent, 0),
          decimalToBigUnits(updatedRow.num_of_days, 0),
          decimalToBigUnits(updatedRow.ref_bonus, 0),
          updatedRow.isActive,
          decimalToBigUnits(params.rowId.toString(), 0),

          { gasLimit: 1000000 },
        );
      }
      setAlert({ severity: 'info', title: 'Staking Option Update', description: 'Staking option update in progress', txhash: response.hash }, index);

      await response.wait(1);
      if (response) {
        localStorage.clear();
        window.location.reload();
        params.setOpen(false);
      }
    } catch (err) {
      setAlert({ severity: 'error', title: 'Token', error: err }, index);
    } finally {
    }
  };
  const handleValueChange = (value, key, child) => {
    const uprow = {
      ...updatedRow,
    };
    if (child) {
      uprow[key][child] = value;
    } else {
      uprow[key] = value;
    }

    setUpdatedRow(uprow);
  };
  const savestakingOption = () => {
    addOrUpdateToken();
  };
  const handleStakingTokenChange = (event, key) => {
    const {
      target: { value },
    } = event;
    setStakingToken(value);
    handleValueChange(value, 'staking_token');
  };
  const handleChange = (event) => {
    alert('ok');
  };
  return (
    <div>
      <Dialog open={params.open} onClose={params.handleClose} sx={{ zIndex: 1100, maxWidth: '100vw', minWidth: '60vw' }}>
        <DialogTitle sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt="" src={updatedRow?.staking_token?.token_image} />
          {newRow ? ' New' : ' Update'} Staking Option
        </DialogTitle>
        <DialogContent>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={4} sm={4} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="plane_name"
                onChange={(e) => handleValueChange(e.target.value, 'plane_name')}
                value={updatedRow?.plane_name}
                label="Plan Name"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="min_deposit"
                onChange={(e) => handleValueChange(e.target.value, 'min_deposit')}
                value={updatedRow?.min_deposit}
                label="Minimum Deposit"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={4} sm={4} md={4}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="max_deposit"
                onChange={(e) => handleValueChange(e.target.value, 'max_deposit')}
                value={updatedRow?.max_deposit}
                label="Maximum Deposit"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={12} sm={12} md={12}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="staking_contract_address"
                onChange={(e) => handleValueChange(e.target.value, 'staking_contract_address')}
                value={updatedRow?.staking_contract_address}
                label="Contract Address"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="token_name"
                onChange={(e) => handleValueChange(e.target.value, 'staking_token', 'token_name')}
                value={updatedRow?.staking_token?.token_name}
                label="Currency Name"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="token_symbol"
                onChange={(e) => handleValueChange(e.target.value, 'staking_token', 'token_symbol')}
                value={updatedRow?.staking_token?.token_symbol}
                label="Symbol"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="token_address"
                onChange={(e) => handleValueChange(e.target.value, 'staking_token', 'token_address')}
                value={updatedRow?.staking_token?.token_address}
                label="Address"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="token_image"
                onChange={(e) => handleValueChange(e.target.value, 'staking_token', 'token_image')}
                value={updatedRow?.staking_token?.token_image}
                label="Icon Url"
                type="text"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>

          <Grid container direction="row" spacing={2}>
            <Grid item xs={8} sm={8} md={8}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="life_days"
                onChange={(e) => handleValueChange(e.target.value, 'life_days')}
                value={updatedRow?.life_days}
                label="Life (no of days)"
                type="number"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleValueChange(e.target.value, 'percent')}
                value={updatedRow?.percent}
                margin="dense"
                id="percent"
                label="Return % in life"
                type="number"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={8} sm={8} md={8}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                margin="dense"
                id="num_of_days"
                onChange={(e) => handleValueChange(e.target.value, 'num_of_days')}
                value={updatedRow?.num_of_days}
                label="Repay time out"
                type="number"
                fullWidth
                variant="standard"
              />
            </Grid>
            <Grid item xs={3} sm={3} md={3}>
              <TextField
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={(e) => handleValueChange(e.target.value, 'ref_bonus')}
                value={updatedRow?.ref_bonus}
                margin="dense"
                id="ref_bonus"
                label="Referal Bonus"
                type="number"
                fullWidth
                variant="standard"
              />
            </Grid>
          </Grid>
          <Grid container direction="row" spacing={2}>
            <Grid item xs={3} sm={3} md={3}>
              <FormControl>
                <FormControlLabel
                  checked={updatedRow?.isActive}
                  onChange={(e) => handleValueChange(e.target.checked, 'isActive')}
                  control={<Switch color="primary" />}
                  label="Active"
                  labelPlacement="start"
                />
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={params.handleClose} variant="outlined">
            Cancel
          </Button>
          <Button onClick={() => savestakingOption()} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
