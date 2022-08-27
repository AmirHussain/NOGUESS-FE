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
});

function createData(name, calories, fat, carbs, protein, icon = '') {
  return { name, calories, fat, carbs, protein, icon: icon || 'https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3' };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 'Button'),
  createData('Ice cream sandwich', 237, 9.0, 'Button'),
  createData('Eclair', 262, 16.0, 'Button'),
  createData('Cupcake', 305, 3.7, 'Button'),
  createData('Gingerbread', 356, 16.0, 'Button'),
];

export default function BasicTable(props) {
  const classes = useStyles();
  const openDrawer = (row) => {
    props.action(row, props.component);
  }


  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table" sx={{wordBreak: 'break-word'}}>
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.theadRow}>
            <TableCell>ASSETS</TableCell>
            <TableCell align="right">SUPPLY APY</TableCell>
            <TableCell align="right">WALLET</TableCell>
            <TableCell align="right">            Action
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.name} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} className={classes.tableRow}>
              <TableCell component="th" scope="row">
                {row.name}
              </TableCell>
              <TableCell align="right">{row.calories}</TableCell>
              <TableCell align="right">{row.fat}</TableCell>
              <TableCell align="right">
                <Button variant="contained" size="small" className={classes.actionButton} onClick={() => openDrawer(row)}>
                  {props.component === 'sellItem' ?
                    'Sell' : 'Borrow'
                  }

                </Button>

              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
