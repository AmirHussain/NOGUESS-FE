import React from 'react';
import { Grid ,Box} from '@mui/material';
import {makeStyles} from '@mui/styles'
const useStyles = makeStyles({
  
  listSection: {
    backgroundColor: 'inherit',
  },
  ul: {
    backgroundColor: 'inherit',
    padding: 0,
  },
  cardmedia:{    
    objectFit: 'scale-down'
  }
});

export default function Staking() {
  const classes = useStyles();

  return (
<Box sx={{ flexGrow: 1 }}>
      <Grid container spacing={2}>
        <Grid span md={6} xs={12}>
          <div>xs=6</div>
        </Grid>
        <Grid span md={6} xs={12}>
          <div>xs=6</div>
        </Grid>
      </Grid>
    </Box>
  );
}
