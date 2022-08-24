import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';

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
  "& .MuiTableCell-root":{
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

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 'Button'),
  createData('Ice cream sandwich', 237, 9.0, 'Button'),
  createData('Eclair', 262, 16.0, 'Button'),
  createData('Cupcake', 305, 3.7, 'Button'),
  createData('Gingerbread', 356, 16.0, 'Button'),
];

export default function BasicTable() {
  const classes = useStyles();

  return (
    <TableContainer component={Paper}>
      <Table aria-label="simple table">
        <TableHead className={classes.tableHead}>
          <TableRow className={classes.theadRow}>
            <TableCell>ASSETS</TableCell>
            <TableCell align="right">SUPPLY APY</TableCell>
            <TableCell align="right">WALLET</TableCell>
            <TableCell align="right">Button</TableCell>
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
              <TableCell align="right">{row.carbs}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
