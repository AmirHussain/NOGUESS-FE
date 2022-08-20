import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {makeStyles} from "@mui/styles"

const useStyles = makeStyles({
    root: {},
    boxRoot: {
      height: '180px',
      width: '100%',
      borderRadius: 8,
    },
    tableRow:{
        padding:'20px',
        borderRadius:'6px',
        background: '#0b0a0d33',
        border:"1px solid #E0E0E0" ,
    },
    tableCell:{
        color:'grey'
    }
  });

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, "Button"),
  createData('Ice cream sandwich', 237, 9.0, "Button"),
  createData('Eclair', 262, 16.0, "Button"),
  createData('Cupcake', 305, 3.7, "Button"),
  createData('Gingerbread', 356, 16.0, "Button"),
];

export default function BasicTable() {
    const classes = useStyles();

  return (
    <TableContainer component={Paper} sx={{minHeight:'100vh',background:'#0b0a0d33',padding:'10px 5px', borderRadius:'8px 8px 0 0'}}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell sx={{color:'white'}}>ASSETS</TableCell>
            <TableCell sx={{color:'white'}} align="right">SUPPLY APY</TableCell>
            <TableCell sx={{color:'white'}} align="right">WALLET</TableCell>
            <TableCell  sx={{color:'white'}} align="right">Button</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>

          {rows.map((row) => (
            <TableRow
              key={row.name}
              sx={{ '&:last-child td, &:last-child th': { border: 0,}}}
              className={classes.tableRow}
            >
              <TableCell sx={{color:'#c3c0c9',padding:'27px 8px' }} component="th" scope="row">{row.name}</TableCell>
              <TableCell sx={{color:'#c3c0c9',padding:'27px 8px' }} align="right">{row.calories}</TableCell>
              <TableCell sx={{color:'#c3c0c9',padding:'27px 8px' }} align="right">{row.fat}</TableCell>
              <TableCell sx={{color:'#c3c0c9',padding:'27px 8px' }} align="right">{row.carbs}</TableCell>
              <TableCell sx={{color:'#c3c0c9',padding:'27px 8px' }} align="right">{row.protein}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
