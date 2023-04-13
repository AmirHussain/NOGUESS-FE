import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Edit, Token } from '@mui/icons-material';
import { TokenContext } from '../../tokenFactory';

import theme from './../../theme';
import { makeStyles } from '@mui/styles';
import AddUpdateStakingOption from './addUpdateStakingOption';
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

  content: {
    color: theme.darkText,
    background: theme.contentBackGround,
    padding: '1%',
    position: 'relative',
    top: theme.headerHeight,
    overflow: 'auto',
    // height:'calc(100% - '+theme.headerHeight+') !important'
  },
  card: theme.card,
});
export default function AdminStakingOfferings() {
  const { StakingOptions } = React.useContext(TokenContext);
  const [newRow, setNewRow] = React.useState(true);
  const [rowId, setRowId] = React.useState(0);

  const [currentRow, setCurrentRow] = React.useState([]);
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const newToken = () => {
    setNewRow(true);
    setCurrentRow({});
    setOpen(true);
  };

  const editToken = (row, index) => {
    setNewRow(false);
    setCurrentRow(row);
    setRowId(index);
    setOpen(true);
  };

  React.useEffect(() => {}, [StakingOptions]);

  // {
  //   0x6763d0619CB1D4d7e1F7E67B41ACA9CfbA1Ab772,
  //     0x0455A1cC4E88A146A98f83D35e94e1D6a3BE2759,
  //     Pedge USDT
  //   VST
  //   https://cloudfront-us-east-1.images.arcpublishing.com/coindesk/ZJZZK5B2ZNF25LYQHMUTBTOMLU.png
  //   36135
  //   72270
  //   7
  //   5
  // }
  return (
    <div style={{ width: '100%' }}>
      <div className="d-flexSpaceBetween">
        <Typography sx={{ fontSize: '18px', fontWeight: 600, color: 'white', textAlign: 'left' }} variant="p"></Typography>
        <Typography sx={{ fontSize: 14, fontWeight: 600, color: theme.lightText, paddingBottom: '10px', cursor: 'pointer' }} variant="p" onClick={() => newToken()}>
          + Add Plans
        </Typography>
      </div>
      {open && (
        <AddUpdateStakingOption
          open={open}
          newRow={newRow}
          currentRow={currentRow}
          setOpen={setOpen}
          rowId={rowId}
          handleClickOpen={handleClickOpen}
          handleClose={handleClose}
        ></AddUpdateStakingOption>
      )}
      <List sx={{ width: '100%' }}>
        {StakingOptions?.map((row, index) => {
          return (
            <>
              <ListItem alignItems="flex-start" className={classes.card} secondaryAction={<Edit onClick={() => editToken(row, index)} sx={{ cursor: 'pointer' }}></Edit>}>
                <ListItemAvatar>
                  <Avatar alt="" src={row?.staking_token?.token_image} />
                </ListItemAvatar>
                <ListItemText
                  primary={row?.staking_token?.token_symbol}
                  secondary={
                    <React.Fragment>
                      <Typography sx={{ display: 'inline', color: theme.lightText, fontSize: '14px' }} component="span">
                        {row?.num_of_days} days {' — '} {row?.staking_contract_address}
                      </Typography>
                    </React.Fragment>
                  }
                />
              </ListItem>
            </>
          );
        })}
      </List>
    </div>
  );
}
