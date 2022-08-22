import { Typography, Stack, Grid, Box, Divider } from '@mui/material';
import React from 'react';
import { makeStyles } from '@mui/styles';

//components
import CustomTable from "../../Components/lendingTable.js/CustomTable"

const useStyles = makeStyles({
  root: {},
  boxRoot: {
    height: '180px',
    width: '100%',
    background: '#0b0a0d',
    borderRadius: 8,
  },
  dividerRoot: {
    background: '#808080',
  },
});

function Lending() {
  const classes = useStyles();
  return (
    <>
      <Grid container direction="row" justifyContent="start" alignItems="flex-start" spacing={2} style={{ width: '100%' }}>
        <Grid item xs={12} sm={12} md={6}>
          
        </Grid>
        <Grid item xs={12} sm={12} md={6}>
        </Grid>

        {/* Boxes */}
        <Grid item xs={12} sm={12} md={6}>
        <Typography sx={{textAlign:'start'}}>
            <h1>Supply Market</h1>
            </Typography>
          <Box className={classes.boxRoot} p={10}>
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
        <Typography sx={{textAlign:'start'}}>
            <h1>Borrom Market</h1></Typography>

          <Box className={classes.boxRoot} p={10}>
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
        <CustomTable/>
        </div>
        </Grid>
        
        <Grid item xs={12} sm={12} md={6}>
        <div>
        <CustomTable/>
        </div>
        </Grid>
      </Grid>
    </>
  );
}

export default Lending;
