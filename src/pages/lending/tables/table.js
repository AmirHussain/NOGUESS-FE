import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@mui/styles';
import { Button, Grid, Menu, MenuItem } from '@mui/material';
import { ethers } from 'ethers';
import theme from '../../../theme';
import { Web3ProviderContext } from '../../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../../contracts/useContracts';
import { TokenContext } from '../../../tokenFactory';
import Asset from '../../../Components/asset';
import { getAPY } from '../../../utils/common';


const useStyles = makeStyles({
    root: {},
    boxRoot: {
        height: '180px',
        width: '100%',
        borderRadius: 8,
    },
    tableRow: {
        background: theme.DrawerBackground,
        borderRadius: 8,
        padding:'2px 2px 0px 0px',
        color: 'white',
        cursor: 'pointer !important',
        border: '0px solid transparent',
        "&:hover": {
            background: '#393A41 !important'
        }
    },
    theadRow: {
        padding:'2px 2px 0px 0px',
        "& .MuiTableCell-root": {
            color: theme.DrawerText,
            border: '0px solid transparent',
        }
    },
    tableCell: {
        color: 'white !important',
        padding:'0px',
        minHeight: '10px !important',
        lineHeight: '1 !important',
        border: '0px solid transparent !important',
        fontSize: '12px !important',
        fontWeight:'500',
    },
    tableHead: {
        background: theme.DrawerBackground,
        color: theme.DrawerText,
        width: '100%',
        fontSize: '10px !important',
        fontWeight:'500',
        justifyItems: 'center',
        padding: '16px 24px',
        border: '0px solid transparent'
    },

    actionButton: theme.actionButton2
});




export default function LendingTable(props) {
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
    }
    const SetAndOpenAsset = (row) => {
        props.setCurrentRow(row)
        props.setOpenAsset(true)
    };
    React.useEffect(() => {
    }, [props?.SupplyRows])

    return (
        <TableContainer sx={{ borderRadius: '8px' }}>
            <Table aria-label="simple table" >
                <TableHead className={classes.tableHead}>
                    <TableRow className={classes.theadRow}>
                        <TableCell align="left">Asset</TableCell>
                        <TableCell align="left">APY</TableCell>
                        <TableCell align="right">Wallet</TableCell>
                        {/* <TableCell align="center">Action</TableCell> */}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props?.SupplyRows?.map((row) => (
                        <TableRow className={classes.tableRow} key={row?.token?.address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}

                            onClick={() => props.market === 'supply' ? openDrawer(row, 'SupplyItem') : openDrawer(row, 'borrowItem')}
                        >
                            <TableCell className={classes.tableCell} align="left"
                                 style={{ cursor: 'pointer', zIndex: 1000000, display: 'flex', alignItems: 'center', borderBottom: '0px solid !important' }} >
                                <img className="chainIcon" alt="" src={row.token?.icon} /> <h4>{row.token?.name} </h4>  </TableCell>

                            <TableCell className={classes.tableCell} align="right"><h4> {parseFloat(getAPY(
                                (props.market === 'supply' ? row.supplyAPY : row.borrowAPY) || 0) * 100).toFixed(3)} %</h4></TableCell>
                            <TableCell className={classes.tableCell} align="right"><h5>{(props.market === 'supply' ? row.supplyAmount : row.borrowAmount) || '0.00'} {row.token?.symbol}</h5></TableCell>

                            {/* <TableCell className={classes.tableCell} align="center" >
                                <MenuOpen
                                    aria-controls={open ? 'basic-menu' : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? 'true' : undefined}
                                    onClick={handleClick}
                                ></MenuOpen>
                                <Menu
                                    id="basic-menu"
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                    MenuListProps={{
                                        'aria-labelledby': 'basic-button',
                                    }}
                                >
                                    <MenuItem onClick={() => openDrawer(row, 'SupplyItem')}>
                                        {
                                            `${row.supplyAmount && row.supplyAmount > 0 ? 'Supply / Redeem' : ' Supply'}`
                                        }
                                    </MenuItem>
                                    <MenuItem >{
                                        `${row.borrowAmount && row.borrowAmount > 0 ? 'Borrow / Repay' : ' Borrow'}`
                                    }</MenuItem>
                                </Menu>

                            </TableCell> */}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>

    );
}
