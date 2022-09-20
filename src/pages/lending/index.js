import { Typography, Stack, Grid, Box, Divider } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';

//components
import RightDrawer from '../../Components/rightDrawer';
import SupplyTable from '../../Components/lendingTable.js/supplyTable';
import BorrowTable from '../../Components/lendingTable.js/borrowTable';

const useStyles = makeStyles({
  root: {},
  boxRoot: {
    height: '180px',
    width: '100%',
    // background: '#0b0a0d',
    color: '#56525d !important',
    borderRadius: 8,
    border: "2px solid #0B0A0D"
  },
  dividerRoot: {
    background: '#808080',
  },

});

function Lending() {
  const classes = useStyles();

  const [currentMethod, setCurrentMethod] = React.useState('sellItem');
  const [currentRow, setCurrentRow] = React.useState({});
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  const OpenDrawer = (row, method) => {
    toggleDrawer();
    setCurrentRow(row);

    setCurrentMethod(method);
  }
  return (
    <>
      <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>

        {/* Boxes */}
        <Grid item xs={12} sm={12} md={6}>
          <Typography varient="h3" sx={{ textAlign: 'start', marginBottom: '5px !important', fontWeight: 600 }}>
            Supply Market
          </Typography>
          <Box className={classes.boxRoot} p={10} style={{ background: "#ffffff" }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>0$</Typography>
              <Typography>0.03%</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>0$</Typography>
              <Typography>0.03%</Typography>
            </Stack>
            <Divider classes={{ root: classes.dividerRoot }} style={{ marginTop: '20px', marginBottom: '20px' }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography>Collateral Enabled from supply balance</Typography>
              <Typography>0.03$</Typography>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <Typography varient="h3" sx={{ textAlign: 'start', marginBottom: '5px !important', fontWeight: 600 }}>
            Borrom Market</Typography>

          <Box className={classes.boxRoot} p={10} style={{ background: "#ffffff" }}>
            <Stack direction="row" justifyContent="space-between">
              <Typography>0$</Typography>
              <Typography>0.03%</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography>0$</Typography>
              <Typography>0.03%</Typography>
            </Stack>
            <Divider classes={{ root: classes.dividerRoot }} style={{ marginTop: '20px', marginBottom: '20px' }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography>Borrow limit used</Typography>
              <Divider classes={{ root: classes.dividerRoot }} flexItem style={{ padding: '1px' }} />
              <Typography>0.03$</Typography>
            </Stack>
          </Box>
        </Grid>


        {/* Tables */}
        <Grid item xs={12} sm={12} md={6}>
          <div>
            <SupplyTable action={OpenDrawer} component="SupplyItem" />
          </div>
        </Grid>

        <Grid item xs={12} sm={12} md={6}>
          <div>
            <BorrowTable action={OpenDrawer} component="borrowItem" />
          </div>
        </Grid>
      </Grid>
      {drawerOpen && (
        <RightDrawer Opration="Lending" component={currentMethod} currentRow={currentRow} icon={currentRow.icon} title={currentRow.name} toggleDrawer={toggleDrawer} drawerOpen={drawerOpen} />
      )}
    </>
  );
}

export default Lending;
