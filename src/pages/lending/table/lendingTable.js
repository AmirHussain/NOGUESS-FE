import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Button } from '@mui/material';
import { ethers } from 'ethers';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { Tokens } from '../../../token-icons';
import Asset from '../../../Components/asset';


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




export default function SupplyTable(props) {
  const classes = useStyles();
  const openDrawer = (row, component) => {
    props.action(row, component);
  }
  const [openAsset, setOpenAsset] = React.useState(false);
  const [updateTable, setUpdateTable] = React.useState(false);

  const [SupplyRows, setSupplyRows] = React.useState([]);

  const [currentRow, setCurrentRow] = React.useState(false);
  const [previousSigner, SetPreviousSigner] = React.useState(false);

  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  React.useEffect(() => {
    setSupplyTable().then(resp => {
      setSupplyRows(resp)
    });
  }, [updateTable]);

  React.useEffect(() => {
    if (signer) {
      if (previousSigner === signer) {
        return
      }
      SetPreviousSigner(signer)
      console.log('Mounted');
      setUpdateTable(true)
      return () => {
        console.log('Will unmount');
      };
    }
  }, [signer]); // Empty array means to only run once on mount.

  const getSupplyDetailsFromContract = async (currency, rowindex) => {
    try {
      if (!signer) {
        return { amount: 0, rowindex }
      }
      const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
      const supplyResult = await lendingContract.getLenderShare(currency.symbol);
      const borrowResult = await lendingContract.getBorrowerShare(currency.symbol);
      let supplyAmount = 0;
      let borrowAmount = 0;
      if (supplyResult) {
        supplyAmount = ethers.utils.formatEther(supplyResult)
      }

      if (borrowResult) {
        borrowAmount = ethers.utils.formatEther(borrowResult)
      }
      return { amount: supplyAmount, borrowAmount, rowindex }

    } catch (err) {
      return { amount: 0, borrowAmount: 0, rowindex }

    }

  }
  const SetAndOpenAsset = (row) => {
    setCurrentRow(row)
    setOpenAsset(true);
  };
  function createSupplyData(token, supplyAmount, rate, collateral) {
    return { token, supplyAmount, rate, collateral };
  }
  const setSupplyTable = () => {
    return new Promise((resolve, reject) => {

      const rows = []
      setSupplyRows([])
      setTimeout(() => {
        if (Tokens) {
          let rowadded = 0
          const keys = Object.keys(Tokens).map(key => key)
          for (var rowindex = 0; rowindex < (keys.length); rowindex++) {
            // eslint-disable-next-line no-loop-func
            if (!Tokens[keys[rowindex]].isPedgeToken) {

              getSupplyDetailsFromContract(Tokens[keys[rowindex]], rowindex).then((resp) => {
                const row = createSupplyData(Tokens[keys[resp.rowindex]], 0, 159, 6.0, 'Button')
                row.supplyAmount = resp.amount
                row.borrowAmount = resp.borrowAmount
                setSupplyRows(current => [...current, row]);
                console.log(SupplyRows)
              })

            }
          }
        }

      })
    })
  };
  const handleCloseAsset = () => {
    setOpenAsset(false);
  };
  React.useEffect(() => {
    console.log(props?.reload)
    if (props?.reload) {
      setSupplyTable()
    }
  }, [props?.reload])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" >
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.theadRow}>
            <TableCell align="center" width="10%"></TableCell>
            <TableCell>ASSETS</TableCell>
            <TableCell align="right">APY</TableCell>
            <TableCell align="right">Supply</TableCell>
            <TableCell align="right">Borrow</TableCell>
            <TableCell align="right">Action </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {SupplyRows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className={classes.tableRow}>
              <TableCell align="center" > <img onClick={() => SetAndOpenAsset(row)} sx={{ cursor: 'pointer' }} className="chainIcon" alt="" src={row.token.icon} /></TableCell>
              <TableCell component="th" scope="row" >   {row.token?.name}  </TableCell>
              <TableCell align="right">{row.rate}</TableCell>
              <TableCell align="right">{row.supplyAmount || '0.00'}</TableCell>
              <TableCell align="right">{row.borrowAmount || '0.00'}</TableCell>

              <TableCell align="right" >
                <Button variant="contained" size="small" sx={{ marginRight: '10px!important' }}
                  className={classes.actionButton} onClick={() => openDrawer(row, 'SupplyItem')}>
                  {
                    `${row.supplyAmount && row.supplyAmount > 0 ? 'Supply / Redeem' : ' Supply'}`
                  }

                </Button>
                <Button variant="contained" size="small" className={classes.actionButton} onClick={() => openDrawer(row, 'borrowItem')}>
                  {
                    `${row.borrowAmount && row.borrowAmount > 0 ? 'Borrow / Repay' : ' Borrow'}`
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
