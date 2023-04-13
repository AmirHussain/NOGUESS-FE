import React from 'react';
import { Grid } from '@mui/material';
import { makeStyles } from '@mui/styles';
import theme from '../../../theme';
import Asset from '../../../Components/asset';
import StakingItem from './item';

const useStyles = makeStyles({
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia: {
    objectFit: 'scale-down',
  },

  card: theme.card,
  avatar: theme.avatar,
  cardContent: theme.cardContent,
  walletConnect: theme.walletConnect,
  actionButton: theme.actionButton2,
});

export default function StakingList(props) {
  const rows = props?.stakingOptions || [];

  const openDrawer = (row) => {
    props.action(row);
  };

  const openClaimDrawer = (row) => {
    props.claimAction(row);
  };

  const [openAsset, setOpenAsset] = React.useState(false);

  const [currentRow, setCurrentRow] = React.useState(false);

  const SetAndOpenAsset = (row) => {
    setCurrentRow(row);
    setOpenAsset(true);
  };

  const handleCloseAsset = () => {
    setOpenAsset(false);
  };

  return (
    <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>
      {rows?.map((row, index) => (
        <Grid item xs={12} sm={6} md={6} key={index + '-card'}>
          <StakingItem row={row} SetAndOpenAsset={SetAndOpenAsset} openDrawer={openDrawer} openClaimDrawer={openClaimDrawer}></StakingItem>
        </Grid>
      ))}
      {currentRow && <Asset currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} open={openAsset} handleClose={handleCloseAsset}></Asset>}
    </Grid>
  );
}
