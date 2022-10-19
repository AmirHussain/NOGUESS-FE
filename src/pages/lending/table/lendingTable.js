import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Button, Grid } from '@mui/material';
import { ethers } from 'ethers';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { TokenContext } from '../../../tokenFactory';
import Asset from '../../../Components/asset';
import { getAPY } from '../../../utils/common';
import { bigToDecimal, decimalToBig, decimalToBigUints } from '../../../utils/utils';


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

  const [currentRow, setCurrentRow] = React.useState({});
  const [previousSigner, SetPreviousSigner] = React.useState(false);
  const { IntrestRateModal, Tokens } = React.useContext(TokenContext);

  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);


  React.useEffect(() => {


  }, [SupplyRows, Tokens]);

  React.useEffect(() => {

    console.log('Mounted');

    setSupplyTable().then(resp => {
      console.log(resp);

      setSupplyRows(resp)
    });
    return () => {
      console.log('Will unmount');
    };

  }, [signer, provider, Tokens]); // Empty array means to only run once on mount.


  const getSupplyDetailsFromContract = async (currency, rowindex) => {
    try {

      const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
      const supplyResult = signer ? await lendingContract.getLenderShare(currency.symbol) : decimalToBig('0');
      const borrowResult = signer ? await lendingContract.getBorrowerShare(currency.symbol) : decimalToBig('0');
      const supplyAPR = await lendingContract.calculateCurrentLendingProfitRate(
        currency.address,
        IntrestRateModal
      );
      const uratio = signer ? await lendingContract._utilizationRatio(currency.address) : decimalToBig('0');
      const result = signer ? await lendingContract.getCurrentStableAndVariableBorrowRate(uratio, IntrestRateModal)
        : null;
      const borrowAPR = signer ? await lendingContract.getOverallBorrowRate(
        currency.address, result[0], result[1]
      ) : decimalToBig('0');


      let supplyAPY = Number(ethers.utils.formatEther(supplyAPR));
      let borrowAPY = Number(ethers.utils.formatEther(borrowAPR));;
      let supplyAmount = 0;
      let borrowAmount = 0;
      if (supplyResult) {
        supplyAmount = ethers.utils.formatEther(supplyResult)
      }

      if (borrowResult) {
        borrowAmount = ethers.utils.formatEther(borrowResult)
      }
      return { amount: supplyAmount, borrowAmount, rowindex, supplyAPY, borrowAPY }

    } catch (err) {
      console.log(err)
      return { amount: 0, borrowAmount: 0, rowindex, supplyAPY: 0, borrowAPY: 0 }

    }

  }
  const SetAndOpenAsset = (row) => {
    setCurrentRow(row)
    setOpenAsset(true);
  };
  function createSupplyData(token, supplyAmount, supplyRate, borrowRate, collateral) {
    return { token, supplyAmount, supplyRate, borrowRate, collateral };
  }
  const setSupplyTable = () => {
    return new Promise((resolve, reject) => {

      const rows = []
      if (Tokens && Tokens.length) {
        let rowadded = 0
        Tokens.forEach(element => {
          if (!element.isPedgeToken) {
            getSupplyDetailsFromContract(element).then((resp) => {
              const row = createSupplyData(element, 0, 0, 6.0, 'Button')
              row.supplyAmount = resp.amount
              row.borrowAmount = resp.borrowAmount
              row.supplyAPY = resp.supplyAPY
              row.borrowAPY = resp.borrowAPY
              rows.push(row);
              rowadded++;
              console.log(SupplyRows)
            })
          }
        });
        let interval = setInterval(() => {
          if (rowadded === Tokens.length) {
            resolve(rows);
            clearInterval(interval);
          }
        })
      }

    })
  };
  const handleCloseAsset = () => {
    setOpenAsset(false);
  };
  React.useEffect(() => {
    console.log(props?.reload)
    if (props?.reload) {
      setSupplyTable().then(resp => {
        console.log(resp);
        setSupplyRows(resp);
      })
    }
  }, [props?.reload])

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" >
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.theadRow}>
            <TableCell align="center">ASSETS</TableCell>
            <TableCell align="right">Supply APY</TableCell>
            <TableCell align="right">Supplied</TableCell>
            <TableCell align="right">Borrow APY</TableCell>
            <TableCell align="right">Borrowed</TableCell>
            <TableCell align="center">Action </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {SupplyRows?.map((row) => (
            <TableRow key={row?.token?.address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className={classes.tableRow}>
              <TableCell align="left"
               onClick={() => SetAndOpenAsset(row)} style={{ cursor: 'pointer', display: 'flex' ,alignItems:'center',borderBottom:'0px solid !important'}} >
                <img className="chainIcon" alt="" src={row.token?.icon} /> <h4>{row.token?.name} </h4>  </TableCell>
              <TableCell align="right"><h4> {parseFloat(getAPY(row?.supplyAPY || 0) * 100).toFixed(3)} %</h4></TableCell>
              <TableCell align="right"><h5>{row.supplyAmount || '0.00'} {row.token?.symbol}</h5></TableCell>

              <TableCell align="right"><h4> {parseFloat(getAPY(row?.borrowAPY || 0) * 100).toFixed(3)} %</h4></TableCell>

              <TableCell align="right"><h5>{row.borrowAmount || '0.00'} {row.token?.symbol}</h5></TableCell>

              <TableCell align="right" >
                <Grid container direction="row" justifyContent="start" alignItems="flex-center" spacing={2} style={{ width: '100%' }}>


                  <Grid item xs={12} sm={12} md={6}>
                    <Button variant="contained" size="small"
                      className={classes.actionButton} onClick={() => openDrawer(row, 'SupplyItem')}>
                      {
                        `${row.supplyAmount && row.supplyAmount > 0 ? 'Supply / Redeem' : ' Supply'}`
                      }

                    </Button>

                  </Grid>
                  <Grid item xs={12} sm={12} md={6}>

                    <Button variant="contained" size="small"
                      className={classes.actionButton} onClick={() => openDrawer(row, 'borrowItem')}>
                      {
                        `${row.borrowAmount && row.borrowAmount > 0 ? 'Borrow / Repay' : ' Borrow'}`
                      }
                    </Button>
                  </Grid>
                </Grid>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {currentRow && openAsset && (
        <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>
      )}

    </TableContainer>

  );
}
