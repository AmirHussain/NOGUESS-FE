// lib imports
import React from 'react';
import { makeStyles } from '@mui/styles';
import { Box, Tab, Tabs } from '@mui/material';

//components
import theme from './../../theme';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import AdminTokens from './tokens';

const useStyles = makeStyles({
    tabs: {
        "& .MuiButtonBase-root": {
            alignItems: 'start !important',
            maxWidth: '166px !important',
            borderRadius: '8px 0px 0px 8px',
            marginBottom: '12px',
            background: theme.SideHeaderBackground,
            "&.Mui-selected": {
                background: '#383944  !important',
            }
        },

        
    },
    tabPanel: {
        height: 'calc(100vh - 90px)',
        background: '#383944  !important',
        padding:'20px !important',
        borderRadius: '0px 8px 8px 8px',
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
});

export default function Admin() {
    const [value, setValue] = React.useState('1');
    const classes = useStyles();
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (

        <Box sx={{ display: 'flex' }}>

            <TabContext value={value}
                orientation="vertical">
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className={classes.tabs}>
                    <TabList onChange={handleChange}
                        orientation="vertical"
                        indicatorColor="main"
                        textColor="inherit"
                        aria-label="lab API tabs example" centered>
                        <Tab label="Tokens" value="1" />
                        <Tab label="Aggregators" value="2" />
                        <Tab label="Governance" value="3" />
                    </TabList>
                </Box>
                <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100vw - 170px)', xs: 'calc(100vw - 170px)' } }} value="1">
                    <AdminTokens />
                </TabPanel>
                <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100vw - 170px)', xs: 'calc(100vw - 170px)' } }} value="2">
                    <h1>Jello</h1>

                </TabPanel>
                <TabPanel className={classes.tabPanel} sx={{ width: { md: 'calc(100vw - 170px)', xs: 'calc(100vw - 170px)' } }} value="3">

                    <h1>Jello</h1>
                </TabPanel>
            </TabContext>
        </Box>

    );
}