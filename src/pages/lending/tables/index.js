import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Button, Grid, Menu, MenuItem, Typography } from '@mui/material';
import { ethers } from 'ethers';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { TokenContext } from '../../../tokenFactory';
import Asset from '../../../Components/asset';
import { getAPY } from '../../../utils/common';
import { bigToDecimal, decimalToBig, decimalToBigUnits } from '../../../utils/utils';
import { MenuOpen } from '@mui/icons-material';
import LendingTable from './table';
import { Box } from '@mui/system';

const useStyles = makeStyles({
  root: {},
  boxRoot: theme.boxRoot,
  tableRow: {
    borderRadius: theme.cardBorderRadius,
    color: 'white',
    cursor: 'pointer !important',
    border: '0px solid transparent',
    '&:hover': {
      background: '#393A41 !important',
    },
  },
  theadRow: {
    '& .MuiTableCell-root': {
      color: theme.DrawerText,
      border: '0px solid transparent',
    },
  },
  tableCell: {
    color: 'white !important',
    padding: '2px !important',
    minHeight: '10px !important',
    lineHeight: '0.5 !important',
    border: '0px solid transparent !important',
  },
  tableHead: {
    color: theme.DrawerText,
    width: '100%',
    fontSize: '10px !important',
    justifyItems: 'center',
    // borderRadius: '8px 8px 0px 0px',
    padding: '16px 24px',
    border: '0px solid transparent',
  },

  actionButton: theme.actionButton2,
});

export default function SupplyTable(props) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const openDrawer = (row, component) => {
    props.action(row, component);
  };
  const [openAsset, setOpenAsset] = React.useState(false);
  const [updateTable, setUpdateTable] = React.useState(false);

  const [SupplyRows, setSupplyRows] = React.useState([]);

  const [currentRow, setCurrentRow] = React.useState({});
  const [previousSigner, SetPreviousSigner] = React.useState(false);
  const { IntrestRateModal, Tokens } = React.useContext(TokenContext);

  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  React.useEffect(() => {}, [SupplyRows, Tokens]);

  React.useEffect(() => {
    if (Tokens && Tokens.length) {
      console.log('Mounted');
      clearDetailsEmptyTable();
      setSupplyTable();
    }
    return () => {
      console.log('Will unmount');
    };
  }, [signer, Tokens]); // Empty array means to only run once on mount.

  const getSupplyDetailsFromContract = async (currency, rowindex) => {
    try {
      const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
      const supplyResult = signer ? await lendingContract.getLenderShare(currency.symbol) : decimalToBig('0');
      const borrowResult = signer ? await lendingContract.getBorrowerShare(currency.symbol) : decimalToBig('0');
      const supplyAPR = await lendingContract.calculateCurrentLendingProfitRate(currency.address, IntrestRateModal);
      const uratio = signer ? await lendingContract._utilizationRatio(currency.address) : decimalToBig('0');
      const result = signer ? await lendingContract.getCurrentStableAndVariableBorrowRate(uratio, IntrestRateModal) : null;
      const borrowAPR = signer ? await lendingContract.getOverallBorrowRate(currency.address, result[0], result[1]) : decimalToBig('0');

      let supplyAPY = Number(ethers.utils.formatEther(supplyAPR));
      let borrowAPY = Number(ethers.utils.formatEther(borrowAPR));
      let supplyAmount = 0;
      let borrowAmount = 0;
      if (supplyResult) {
        supplyAmount = ethers.utils.formatEther(supplyResult);
      }

      if (borrowResult) {
        borrowAmount = ethers.utils.formatEther(borrowResult);
      }
      return { amount: supplyAmount, borrowAmount, rowindex, supplyAPY, borrowAPY };
    } catch (err) {
      console.log(err);
      return { amount: 0, borrowAmount: 0, rowindex, supplyAPY: 0, borrowAPY: 0 };
    }
  };
  const SetAndOpenAsset = (row) => {
    setCurrentRow(row);
    setOpenAsset(true);
  };
  function createSupplyData(token, supplyAmount, supplyRate, borrowRate, collateral) {
    return { token, supplyAmount, supplyRate, borrowRate, collateral };
  }

  function clearDetailsEmptyTable() {
    const rows = [];
    Tokens.forEach((element) => {
      const row = createSupplyData(element, 0, 0, 6.0, 'Button');
      rows.push(row);
    });
    setSupplyRows(rows);
  }

  async function setSupplyTable() {
    if (Tokens && Tokens.length) {
      const rows = Tokens.filter((token) => !token.isPedgeToken)?.map((fToken) => createSupplyData(fToken, 0, 0, 6.0, 'Button'));
      let rowAdded = 0;
      for (var i = 0; i < rows.length; i++) {
        const resp = await getSupplyDetailsFromContract(Tokens[i], i);
        console.log(i, resp, rows);
        rows[i].supplyAmount = resp.amount;
        rows[i].borrowAmount = resp.borrowAmount;
        rows[i].supplyAPY = resp.supplyAPY;
        rows[i].borrowAPY = resp.borrowAPY;
        rowAdded++;
      }
      setSupplyRows(rows);
      // const interval = setInterval(() => {
      //   if (rowAdded === rows.length) {
      //     setSupplyRows(rows);
      //     clearInterval(interval)
      //   }

      // })
    }
  }

  const handleCloseAsset = () => {
    setOpenAsset(false);
  };
  React.useEffect(() => {
    console.log(props?.reload);
    if (props?.reload) {
      clearDetailsEmptyTable();
    }
  }, [props?.reload]);

  return (
    <div>
      <Grid container direction="row" justifyContent="center" alignItems="flex-center" spacing={2}>
        <Grid item xs={12} sm={12} md={6} style={{ marginBottom: '10px' }}>
          <Box className={classes.boxRoot}>
            <Typography varient="h2" p={2} sx={{ textAlign: 'start', fontSize: '18px', marginBottom: '5px !important', fontWeight: 500 }}>
              Supply Market
            </Typography>

            <LendingTable SupplyRows={SupplyRows} action={props.action} setCurrentRow={setCurrentRow} setOpenAsset={setOpenAsset} market="supply"></LendingTable>
          </Box>
        </Grid>
        <Grid item xs={12} sm={12} md={6} style={{ marginBottom: '10px' }}>
          <Box className={classes.boxRoot}>
            <Typography varient="h2" p={2} sx={{ textAlign: 'start', fontSize: '18px', marginBottom: '5px !important', fontWeight: 500 }}>
              Borrow Market
            </Typography>

            <LendingTable SupplyRows={SupplyRows} action={props.action} setCurrentRow={setCurrentRow} setOpenAsset={setOpenAsset} market="borrow"></LendingTable>
          </Box>
        </Grid>
      </Grid>
      {currentRow && openAsset && <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>}
    </div>
  );
}
