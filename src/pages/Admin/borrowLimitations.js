import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { makeStyles } from '@mui/styles';
import theme from '../../theme';
import { TokenContext } from '../../tokenFactory';
import { Edit } from '@mui/icons-material';
import AddUpdateBorrowLimitations from './addUpdateBorrowLimitations';
import { bigToDecimalObject, decimalToBigObject } from '../../utils/utils';


const useStyles = makeStyles({
    root: {},
    boxRoot: {
        height: '180px',
        width: '100%',
        borderRadius: theme.cardBorderRadius,
    },
    tableRow: {
        background: theme.DrawerBackground,
        borderRadius: theme.cardBorderRadius,
        padding: '2px 2px 2px 2px',
        color: 'white',
        cursor: 'pointer !important',
        border: '0px solid transparent',
        "&:hover": {
            background: '#393A41 !important'
        }

    },
    theadRow: {
        padding: '2px 2px 2px 2px',
        "& .MuiTableCell-root": {
            color: theme.DrawerText,
            border: '0px solid transparent',
            fontWeight: 500,
            fontSize: '11px'
        }
    },
    tableCell: {
        color: 'white !important',
        padding: '0px',
        minHeight: '10px !important',
        lineHeight: '1 !important',
        border: '0px solid transparent !important',
        fontSize: '12px !important',
        fontWeight: '500',
    },
    tableHead: {
        background: theme.DrawerBackground,
        color: theme.DrawerText,
        width: '100%',
        fontSize: '10px !important',
        fontWeight: '500',
        justifyItems: 'center',
        padding: '16px 24px',
        border: '0px solid transparent'
    },

    actionButton: theme.actionButton2
});




export default function AdminBorrowLimitations(props) {
    const classes = useStyles();

    const { Tokens, BorrowLimitations,TokenBorrowLimitations,IntrestRateModal, TokensIntrestRateModal } = React.useContext(TokenContext);

    const [rows, setRows] = React.useState([]);

    const setTokenBorrowLimitations = (row) => {
        if (BorrowLimitations && BorrowLimitations.length) {

            const borrowLimitations = BorrowLimitations.find(agg => agg.tokenAddress === row.address);
            row.borrowLimitations =bigToDecimalObject( borrowLimitations || TokenBorrowLimitations)
        }else{
            row.borrowLimitations=bigToDecimalObject(TokenBorrowLimitations)
        }
        if (TokensIntrestRateModal && TokensIntrestRateModal.length) {

            const tokensIntrestRateModal = TokensIntrestRateModal.find(agg => agg.tokenAddress === row.address);
            row.intrestRateModal = bigToDecimalObject(tokensIntrestRateModal|| IntrestRateModal)
        }else{
            row.intrestRateModal=bigToDecimalObject(IntrestRateModal)
        }
    }
    const [open, setOpen] = React.useState(false);
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };
    const [newRow, setNewRow] = React.useState(true);
    const [currentRow, setCurrentRow] = React.useState({});

    const editToken = (row) => {
        setNewRow(false)
        setCurrentRow(row)
        setOpen(true);
    }

    React.useEffect(()=>{},[rows])
    React.useEffect(() => {
        if (Tokens && Tokens.length) {
            const updatedTokens = Object.assign([], Tokens);
            updatedTokens.forEach(row => setTokenBorrowLimitations(row))
            setRows(updatedTokens)
            console.log(updatedTokens)
        }

    }, [Tokens, BorrowLimitations, TokensIntrestRateModal]);

    return (
        <>
            {open && (<AddUpdateBorrowLimitations open={open} newRow={newRow} currentRow={currentRow} setOpen={setOpen} handleClickOpen={handleClickOpen} handleClose={handleClose}></AddUpdateBorrowLimitations>)}

            <TableContainer sx={{ borderRadius: '0px' }}>
                <Table aria-label="simple table" >
                    <TableHead className={classes.tableHead}>
                        <TableRow className={classes.theadRow}>
                            <TableCell align="left">Asset</TableCell>
                            <TableCell align="right">Collateral Fator</TableCell>
                            <TableCell align="right">Liquidation Threshold</TableCell>
                            <TableCell align="right">Liquidation Penalty</TableCell>
                            <TableCell align="right">Protocol Share</TableCell>
                            <TableCell align="right">Initial Borrow Rate</TableCell>
                            <TableCell align="right">MAX UTILIZATION RATE</TableCell>
                            <TableCell align="right">OPTIMAL UTILIZATION RATE</TableCell>
                            <TableCell align="right">Stable Rate Slope1</TableCell>
                            <TableCell align="right">Stable Rate Slope2</TableCell>
                            <TableCell align="right">Variable Rate Slope1</TableCell>
                            <TableCell align="right">Variable Rate Slope2</TableCell>
                            <TableCell align="right">Base Rate</TableCell>
                            <TableCell align="right">Allow Stable Job</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows?.map((row) => (
                            <TableRow
                                onClick={() => editToken(row)}
                                className={classes.tableRow} key={row?.token?.address} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell className={classes.tableCell} align="left"
                                    style={{ zIndex: 1000000, display: 'flex', alignItems: 'center', borderBottom: '0px solid !important' }} >

                                    <img className="chainIcon" alt="" src={row?.icon} /> <h4>{row?.name} </h4>  </TableCell>

                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.CollateralFator}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.LiquidationThreshold}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.LiquidationPenalty}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.ProtocolShare}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.InitialBorrowRate}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.MAX_UTILIZATION_RATE}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.OPTIMAL_UTILIZATION_RATE}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.StableRateSlope1}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.StableRateSlope2}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.VariableRateSlope1}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.VariableRateSlope2}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.BaseRate}</h5>
                                </TableCell>
                                <TableCell className={classes.tableCell} align="right">
                                    <h5>{row?.borrowLimitations?.AllowStableJob}</h5>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
