import { ArrowDownward } from "@mui/icons-material";
import { Button, ButtonGroup, Fab, Menu, MenuItem } from "@mui/material";
import { createContext, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import { Web3ProviderContext } from "./walletConnect";
import { Networks } from "./providers";

const useStyles = makeStyles({
    walletConnect: theme.actionButton,
    drawer: theme.drawer,
    drawerPaper: theme.drawerPaper,
    drawerContainer: theme.drawerContainer,
    cardBackground: theme.cardBackground,
    accountMenu:{
     background:theme.SideHeaderBackground,color:'white !important'
    }
});
function ConnectWallet() {
    const { handleNetwork, chainId, connectWallet, account, disconnect, switchNetwork } = useContext(Web3ProviderContext);

    const classes = useStyles();
    const networkList = []
    Networks.forEach(object => {
        networkList.push(<Button key={object.chainId} sx={{ fontWeight: object.chainId === chainId ? 600 : 400 ,color:'white'}}
            onClick={() => handleNetwork(object.chainId)}>
            <img alt="" className={object.chainId === chainId ? 'selectedNetworkIcon chainIcon' : 'chainIcon'} src={object.icon} />
            <div className="networktext"> {object.name}</div></Button >)
    }

    )


    const logout = () => {
        disconnect();
        setAnchorEl(null);
    }

    const [anchorEl, setAnchorEl] = useState(null);
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    function start_and_end(str) {
        if (str && str.length > 35) {
            return str.substr(0, 3) + '..' + str.substr(str.length - 2, str.length);
        }
        return str;
    }


    return (
        <div className="d-flex-evenly">
            <ButtonGroup variant="text" aria-label="text button group" onClick={switchNetwork}
                sx={{ marginRight: '5px' }}>
                {networkList}
            </ButtonGroup>
            {!account ?
                <Button variant="text" className={classes.walletConnect} onClick={connectWallet}>Connect</Button>
                :
                <div>
                    <Fab variant="extended"
                    
                    className={classes.accountMenu}
                        aria-controls={open ? 'basic-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={open ? 'true' : undefined}
                        onClick={handleClick}
                    >
                        {start_and_end(account)}
                        <ArrowDownward sx={{ ml: 1 }} />

                    </Fab>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        <MenuItem >{account}</MenuItem>
                        <MenuItem onClick={logout}>Logout</MenuItem>
                    </Menu>
                </div>
            }

        </div>
    )
}


export default ConnectWallet;