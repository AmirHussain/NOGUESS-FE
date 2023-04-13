import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { AddCircle, ArrowCircleUpRounded, Delete, Edit, EditOutlined, ExpandCircleDown, Token } from '@mui/icons-material';
import { TokenContext } from '../../tokenFactory';

import theme from './../../theme';
import { makeStyles } from '@mui/styles';
import { Checkbox, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import AddUpdateAdaptiveLimitation from './addUpdateAdaptiveLimitation';
import { Web3ProviderContext } from '../../Components/walletConnect/walletConnect';
import { abis, contractAddresses, makeContract } from '../../contracts/useContracts';
const useStyles = makeStyles({
  tabs: {
    '& .MuiButtonBase-root': {
      alignItems: 'start !important',
      maxWidth: '166px !important',
      borderRadius: '8px 0px 0px 8px',
      marginBottom: '12px',
      background: theme.SideHeaderBackground,
      '&.Mui-selected': {
        borderTop: '1px solid blue',
        borderLeft: '1px solid blue',
        borderBottom: '1px solid blue',
        left: '2px',
      },
    },
  },

  tabPanel: {
    height: 'calc(100vh - 90px)',
    borderLeft: '1px solid blue',
  },
  tableRow: {
    background: theme.DrawerBackground,
    borderRadius: theme.cardBorderRadius,
    padding: '2px 2px 0px 0px',
    color: 'white',
    cursor: 'pointer !important',
    border: '0px solid transparent',
    '&:hover': {
      background: '#393A41 !important',
    },
  },
  theadRow: {
    padding: '2px 2px 0px 0px',
    '& .MuiTableCell-root': {
      color: theme.DrawerText,
      border: '0px solid transparent',
      fontWeight: 500,
      fontSize: '11px',
    },
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
    border: '0px solid transparent',
  },

  content: {
    color: theme.darkText,
    background: theme.contentBackGround,
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
  card: {
    ...theme.card,

    '& .MuiListItemSecondaryAction-root': {
      position: 'absolute',
      top: '35px !important',
      right: '16px !important',
    },
  },
});
export default function AdaptiveLimitations() {
  const { Tokens, TokenAggregators } = React.useContext(TokenContext);
  const [rows, setRows] = React.useState([]);
  const [newRow, setNewRow] = React.useState(true);

  const [tableRows, setTableRow] = React.useState([]);

  const [currentToken, setCurrentToken] = React.useState([]);
  const [currentIndex, setCurrentIndex] = React.useState(-1);
  const [currentRow, setCurrentRow] = React.useState([]);
  const classes = useStyles();
  const [loading, setLoading] = React.useState(false);
  const [openAddress, setOpenAddress] = React.useState();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleCollapse = () => {
    setOpenAddress('');
  };
  const handleClose = () => {
    setOpen(false);
  };

  const editAdaptiveLimit = (row, trow, index) => {
    setNewRow(false);
    setOpen(true);
    setCurrentToken(row);
    setCurrentIndex(index);
    setCurrentRow(trow);
  };
  const addAdaptiveLimit = (row) => {
    setNewRow(true);
    setOpen(true);
    setCurrentToken(row);
    setCurrentIndex(-1);
    setCurrentRow({});
  };

  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

  const getAdaptiveLimits = async (address) => {
    setTableRow([]);
    const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);
    const adaptiveLimiations = await governanceContract.getTokenAdaptiveLimitations(address);
    const tRows = [];
    if (adaptiveLimiations && adaptiveLimiations.length) {
      adaptiveLimiations.forEach((adl) => {
        const newAggregator = {
          operator: adl.operator,
          Utilization: adl.Utilization,
          Withdraw: adl.Withdraw,
          Borrow: adl.Borrow,
          Replenish: adl.Replenish,
          IsApplicable: adl.IsApplicable,
          Redeem: adl.Redeem,
        };
        tRows.push(newAggregator);
      });
    }
    setTableRow(tRows);
  };

  const expandToken = async (row) => {
    setLoading(true);
    setOpenAddress(row.address);
    await getAdaptiveLimits(row.address);

    setLoading(false);
  };
  React.useEffect(() => {}, [tableRows]);
  React.useEffect(() => {
    if (Tokens && Tokens.length) {
      setRows(Tokens);
    }
  }, [Tokens, TokenAggregators]);

  return (
    <>
      {open && (
        <AddUpdateAdaptiveLimitation
          open={open}
          newRow={newRow}
          currentRow={currentRow}
          currentToken={currentToken}
          rowIndex={currentIndex}
          setOpen={setOpen}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        ></AddUpdateAdaptiveLimitation>
      )}
      <List sx={{ width: '100%' }}>
        {rows?.map((row) => {
          return (
            <>
              <ListItem
                alignItems="flex-start"
                className={classes.card}
                key={row.address}
                secondaryAction={
                  <>
                    {openAddress !== row.address && <ExpandCircleDown sx={{ cursor: 'pointer' }} onClick={() => expandToken(row)}></ExpandCircleDown>}
                    {openAddress === row.address && <ExpandCircleDown sx={{ cursor: 'pointer', transform: 'rotate(180deg)' }} onClick={() => handleCollapse()}></ExpandCircleDown>}
                  </>
                }
              >
                <ListItemAvatar>
                  <Avatar alt="" src={row.icon} />
                </ListItemAvatar>
                <ListItemText
                  primary={row.name}
                  secondary={
                    <React.Fragment>
                      <Typography sx={{ display: 'inline', color: theme.lightText, fontSize: '14px' }} component="span">
                        {row?.aggregator?.decimals || 18} decimals {' — '} {row?.aggregator?.aggregator}
                      </Typography>
                      {openAddress === row.address && (
                        <TableContainer sx={{ borderRadius: 'inherit' }}>
                          <Table aria-label="simple table">
                            <TableHead className={classes.tableHead}>
                              <TableRow className={classes.theadRow}>
                                <TableCell align="center">Utilization</TableCell>
                                <TableCell align="center">Withdraw</TableCell>
                                <TableCell align="center">Borrow</TableCell>
                                <TableCell align="center">Replenish</TableCell>
                                <TableCell align="center">Redeem</TableCell>
                                <TableCell align="right" width="20px">
                                  <AddCircle onClick={() => addAdaptiveLimit(row)} sx={{ width: '20px', cursor: 'pointer' }}></AddCircle>
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {tableRows?.map((trow, index) => (
                                <>
                                  {trow.IsApplicable && (
                                    <TableRow
                                      className={classes.tableRow}
                                      key={row?.token?.address}
                                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                      onClick={() => editAdaptiveLimit(row, trow, index)}
                                    >
                                      <TableCell className={classes.tableCell} align="center">
                                        {trow.operator} {trow.Utilization} %
                                      </TableCell>
                                      <TableCell className={classes.tableCell} align="center">
                                        {trow.Withdraw} {row.symbol}
                                      </TableCell>
                                      <TableCell className={classes.tableCell} align="center">
                                        {trow.Borrow} {row.symbol}
                                      </TableCell>
                                      <TableCell className={classes.tableCell} align="center">
                                        <Checkbox checked={trow.Replenish} disabled />
                                      </TableCell>
                                      <TableCell className={classes.tableCell} align="center">
                                        <Checkbox checked={trow.Redeem} disabled />
                                      </TableCell>
                                    </TableRow>
                                  )}
                                </>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      )}
                    </React.Fragment>
                  }
                />
              </ListItem>
            </>
          );
        })}
      </List>
    </>
  );
}
