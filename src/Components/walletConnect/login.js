import { ArrowDownward } from "@mui/icons-material";
import { Button, ButtonGroup, Fab, Menu, MenuItem } from "@mui/material";
import { createContext, useContext, useEffect, useState } from 'react';
import { makeStyles } from '@mui/styles';

import theme from '../../theme';
import { Web3ProviderContext } from "./walletConnect";
import { Icons } from "../../icons";

const useStyles = makeStyles({
    walletConnect: theme.actionButton,
    drawer: theme.drawer,
    drawerPaper: theme.drawerPaper,
    drawerContainer: theme.drawerContainer,
    cardBackground: theme.cardBackground
});
function ConnectWallet() {
    const { handleNetwork, chainId, connectWallet, account, disconnect, switchNetwork } = useContext(Web3ProviderContext);

    const classes = useStyles();
    const networks = [{ name: 'Polygon', icon: Icons.polygon, chainId: 5 }, { name: 'BSC', icon: 'https://i.imgflip.com/6dky3c.png', chainId: 56 }, { name: 'Ethereum', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png', chainId: 1 }]
    const networkList = []
    networks.forEach(object => {
        networkList.push(<Button key={object.chainId} sx={{ fontWeight: object.chainId === chainId ? 600 : 400 }}
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
            return str.substr(0, 5) + '...' + str.substr(str.length - 5, str.length);
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