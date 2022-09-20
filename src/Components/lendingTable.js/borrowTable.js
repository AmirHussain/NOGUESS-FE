import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Button, Link } from '@mui/material';
import theme from '../../theme'
import Asset from '../asset';
import { Tokens } from '../../token-icons';
import { abis, makeContract } from '../../contracts/useContracts';
import { ethers } from 'ethers';
import { Web3ProviderContext } from '../walletConnect/walletConnect';


const useStyles = makeStyles({
  root: {},
  boxRoot: {
    height: '180px',
    width: '100%',
    borderRadius: 8,
  },
  tableRow: {
    padding: '20px',
    borderRadius: '6px',
    background: '#ffffff',
    color: '#000000',
    border: '1px solid #E0E0E0',
  },
  theadRow: {
    "& .MuiTableCell-root": {
      color: 'white',

    }
  },
  tableHead: {
    background: '#2A303C',
    width: '100%',
    height: '50px',
    gridTemplateColumns: 'repeat(6, 1fr)',
    justifyItems: 'center',
    // borderRadius: '8px 8px 0px 0px',
    padding: '16px 24px',
  },
  actionButton: theme.actionButton2
});




export default function BorrowTable(props) {
  const classes = useStyles();
  const openDrawer = (row) => {
    props.action(row, props.component);
  }
  const [openAsset, setOpenAsset] = React.useState(false);

  const [currentRow, setCurrentRow] = React.useState(false);
  const { connectWallet } = React.useContext(Web3ProviderContext);

  const getSupplyDetailsFromContract = async (currency) => {
    const { provider, signer } = await connectWallet();
    const lendingContract = makeContract('0x7da3D57DC26e6F5EBa359eaCaeE3AA258973d974', abis.lending, signer);
    const result = await lendingContract.lendedAssetDetails(currency.symbol);
    alert('Lended amount 50')
  }
  const SetAndOpenAsset = (row) => {
    setCurrentRow(row)
    setOpenAsset(true);
  };
  function createSupplyData(token, rate, collateral) {
    return { token, rate, collateral };
  }
  const SupplyRows = [
    createSupplyData(Tokens.WETH, 159, 6.0, 'Button'),
    createSupplyData(Tokens.fWETH, 159, 6.0, 'Button'),
    createSupplyData(Tokens.dai, 159, 6.0, 'Button'),
    createSupplyData(Tokens.fDAI, 159, 6.0, 'Button'),
  ];
  function createData(token, rate, collateral) {
    return { token, rate, collateral };
  }
  const rows = [
    createData(Tokens.WETH, 159, 6.0, 'Button'),
    createData(Tokens.fWETH, 159, 6.0, 'Button'),
    createData(Tokens.dai, 159, 6.0, 'Button'),
    createData(Tokens.fDAI, 159, 6.0, 'Button'),
  ];
  const handleCloseAsset = () => {
    setOpenAsset(false);
  };


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" >
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.theadRow}>
            <TableCell>ASSETS</TableCell>
            <TableCell align="right">APY</TableCell>
            <TableCell align="right">WALLET</TableCell>
            <TableCell align="right">            Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className={classes.tableRow}>
              <TableCell sx={{ cursor: 'pointer' }} component="th" scope="row" onClick={() => SetAndOpenAsset(row)}>
                <Link sx={{ cursor: 'pointer', textDecoration: 'none' }}>{row.token?.name}</Link>
              </TableCell>
              <TableCell align="right">{row.rate}</TableCell>
              <TableCell align="right">{row.facollateralt}</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small" className={classes.actionButton} onClick={() => openDrawer(row)}>
                  {props.component === 'SupplyItem' ?
                    'Supply' : 'Borrow'
                  }

                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>

    </TableContainer>

  );
}
