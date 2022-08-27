import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Stack } from '@mui/system';
import { Typography, TextField, Button } from '@mui/material';
// Components
import DropDown from './Dropdown';
import { ReactComponent as EthLogo } from '../../assets/svg/ethereum.svg';
import { ReactComponent as PolygonLogo } from '../../assets/svg/polygon.svg';
import EastIcon from '@mui/icons-material/East';
import { makeStyles } from '@mui/styles';


const useStyles = makeStyles({
  tablist: {
    background: '#2A303C',
    '& .MuiButtonBase-root': {
      color: '#fff',
      fontSize:'20px',
      fontFamily:'Roboto',
      fontWeight:600
    },
  },
});

export default function LabTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <h1>Bridge</h1>
      <Stack>
        <Box sx={{ typography: 'body1' }}>
          <TabContext value={value}>
            {/* background: '#2A303C' */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList className={classes.tablist} onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="Deposit" value="1" />
                <Tab label="Withdraw" value="2" />
              </TabList>
            </Box>

            <Box sx={{ background: '#fff', padding: '50px 20px' }}>
              <TabPanel value="1">
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <Typography variant="h5" style={{ padding: '0px 10px' }}>
                    Ethereum
                  </Typography>
                  <EthLogo style={{ width: 40, height: 40, margin: '0px 10px' }} />
                  <EastIcon fontSize="large" />
                  <Typography variant="h5" style={{ padding: '0px 10px' }}>
                    Polygon
                  </Typography>
                  <PolygonLogo style={{ width: 40, height: 40, margin: '0px 10px' }} />
                  <DropDown />
                  <TextField placeholder="0.00" variant="outlined" type="number" />
                  <Button sx={{ height: '54px', margin: '0px 0px 0px 10px' }} onClick={() => alert('click function')} variant="contained" size="large">
                    Transfer
                  </Button>
                </Stack>
              </TabPanel>
              <TabPanel value="2">
                <Stack direction="row" justifyContent="center" alignItems="center">
                  <Typography variant="h5" style={{ padding: '0px 10px' }}>
                    Polygon
                  </Typography>
                  <PolygonLogo style={{ width: 40, height: 40, margin: '0px 10px' }} />
                  <EastIcon fontSize="large" />
                  <Typography variant="h5" style={{ padding: '0px 10px' }}>
                    Ethereum
                  </Typography>
                  <EthLogo style={{ width: 40, height: 40, margin: '0px 10px' }} /> <DropDown />
                  <TextField placeholder="0.00" variant="outlined" type="number" />
                  <Button sx={{ height: '54px', margin: '0px 0px 0px 10px' }} onClick={() => alert('click function')} variant="contained" size="large">
                    Transfer
                  </Button>
                </Stack>
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Stack>
    </>
  );
}

// textColor="secondary"
// indicatorColor="secondary"
