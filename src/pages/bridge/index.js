import * as React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import { Stack } from '@mui/system';
import { Typography, TextField, Button, Card } from '@mui/material';
// Components
import DropDown from './Dropdown';
import { ReactComponent as EthLogo } from '../../assets/svg/ethereum.svg';
import { ReactComponent as PolygonLogo } from '../../assets/svg/polygon.svg';
import EastIcon from '@mui/icons-material/East';
import { makeStyles } from '@mui/styles';
import theme from '../../theme'

const useStyles = makeStyles({
  tablist: {
    card: theme.card,
    background: theme.contentBackGround,
    margin: '10px',
    borderRadius: '10px',
    '& .MuiTabs-flexContainer': {
      padding: '10px',
    },



    '& .MuiButtonBase-root': {
      color: 'black',
      marginRight: '10px',
      marginLeft: '10px',
      width: "calc(50% - 20px)",
      maxWidth: '100%',
      borderRadius: '10px !important',
      background: '#F0F8FF',
      fontWeight: 600,

    },

    '& .Mui-selected': {
      background: 'white',
      color: 'black',
    },

    '& .MuiTabs-indicator': {
      display: 'none'
    }
  },
  tabBox: {
    '&.MuiBox-root': {
      background: theme.contentBackGround,
      margin: '10px',
      borderRadius: '10px',
    },
  }


});

export default function LabTabs() {
  const classes = useStyles();
  const [value, setValue] = React.useState('1');

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Stack>
        <Box sx={{ typography: 'body1' }}>
          <Card className={classes.card} sx={{ boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)' }}>

            <TabContext value={value} variant="fullWidth">
              {/* background: '#2A303C' */}
              <Box >
                <TabList className={classes.tablist} onChange={handleChange} aria-label="lab API tabs example">
                  <Tab label="Deposit" value="1" />
                  <Tab label="Withdraw" value="2" />
                </TabList>
              </Box>

              <Box sx={{ background: '#fff', padding: '50px 20px' }} className={classes.tabBox}>
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
                  </Stack>
                  <Stack direction="row" justifyContent="center" alignItems="center">

                    <DropDown />
                    <TextField placeholder="0.00" variant="outlined" type="number" />
                  </Stack>
                  <Stack direction="row" justifyContent="center" alignItems="center">

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
                    
                    <EthLogo style={{ width: 40, height: 40, margin: '0px 10px' }} />
                    </Stack>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <DropDown />
                   <TextField placeholder="0.00" variant="outlined" type="number" />
                  </Stack>
                  <Stack direction="row" justifyContent="center" alignItems="center">
                    <Button sx={{ height: '54px', margin: '0px 0px 0px 10px' }} onClick={() => alert('click function')} variant="contained" size="large">
                      Transfer
                    </Button>
                  </Stack>
                </TabPanel>
              </Box>
            </TabContext>
          </Card>
        </Box>

      </Stack>
    </>
  );
}

// textColor="secondary"
// indicatorColor="secondary"
