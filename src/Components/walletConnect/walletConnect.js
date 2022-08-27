import { useEffect, useState } from 'react';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';
import { Button, Card, ButtonGroup, Menu, MenuItem, Fab, Divider, Popover } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import providerOptions from '../walletConnect/providers'


const useStyles = makeStyles({
    walletConnect: theme.walletConnect,
    drawer: theme.drawer,
    drawerPaper: theme.drawerPaper,
    drawerContainer: theme.drawerContainer,
    cardBackground: theme.cardBackground
});
const web3Modal = new Web3Modal({
    theme: {
        background: "rgb(39, 49, 56)",
        main: "rgb(199, 199, 199)",
        secondary: "rgb(136, 136, 136)",
        border: "rgba(195, 195, 195, 0.14)",
        hover: "rgb(16, 26, 32)"
    },
    cacheProvider: true, // optional
    providerOptions // required
});
function WalletConnecter() {
    const classes = useStyles();
    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [signature, setSignature] = useState("");
    const [error, setError] = useState("");
    const [chainId, setChainId] = useState();
    const [network, setNetwork] = useState();
    const [message, setMessage] = useState("");
    const [signedMessage, setSignedMessage] = useState("");
    const [verified, setVerified] = useState();
    const handleWalleltDrawerToggle = () => {
        connectWallet();
    };
    async function connectWallet() {

        try {
            const provider = await web3Modal.connect();
            const library = new ethers.providers.Web3Provider(provider);
            const accounts = await library.listAccounts();
            const network = await library.getNetwork();
            setProvider(provider);
            setLibrary(library);
            if (accounts) setAccount(accounts[0]);
            setChainId(network.chainId);
        } catch (error) {
            setError(error);
        }

        //   const instance = await web3Modal.connect();

        //   const provider = new ethers.providers.Web3Provider(instance);
        //   const signer = provider.getSigner();

    }
    const handleNetwork = (e) => {
        const id = e.target.value;
        setNetwork(Number(id));
    };

    const handleInput = (e) => {
        const msg = e.target.value;
        setMessage(msg);
    };

    const switchNetwork = async () => {
        try {
            await library.provider.request({
                method: "wallet_switchEthereumChain",
                // params: [{ chainId: toHex(network) }]
            });
        } catch (switchError) {
            if (switchError.code === 4902) {
                try {
                    await library.provider.request({
                        method: "wallet_addEthereumChain",
                        // params: [networkParams[toHex(network)]]
                    });
                } catch (error) {
                    setError(error);
                }
            }
        }
    };

    const signMessage = async () => {
        if (!library) return;
        try {
            const signature = await library.provider.request({
                method: "personal_sign",
                params: [message, account]
            });
            setSignedMessage(message);
            setSignature(signature);
        } catch (error) {
            setError(error);
        }
    };

    const verifyMessage = async () => {
        if (!library) return;
        try {
            const verify = await library.provider.request({
                method: "personal_ecRecover",
                params: [signedMessage, signature]
            });
            setVerified(verify === account.toLowerCase());
        } catch (error) {
            setError(error);
        }
    };

    const refreshState = () => {
        setAccount();
        setChainId();
        setNetwork("");
        setMessage("");
        setSignature("");
        setVerified(undefined);
    };

    const disconnect = async () => {
        await web3Modal.clearCachedProvider();
        refreshState();
    };

    useEffect(() => {
        if (web3Modal.cachedProvider) {
            connectWallet();
        }
    }, []);

    useEffect(() => {
        if (provider?.on) {
            const handleAccountsChanged = (accounts) => {
                console.log("accountsChanged", accounts);
                if (accounts) setAccount(accounts[0]);
            };

            const handleChainChanged = (_hexChainId) => {
                setChainId(_hexChainId);
            };

            const handleDisconnect = () => {
                console.log("disconnect", error);
                disconnect();
            };

            provider.on("accountsChanged", handleAccountsChanged);
            provider.on("chainChanged", handleChainChanged);
            provider.on("disconnect", handleDisconnect);

            return () => {
                if (provider.removeListener) {
                    provider.removeListener("accountsChanged", handleAccountsChanged);
                    provider.removeListener("chainChanged", handleChainChanged);
                    provider.removeListener("disconnect", handleDisconnect);
                }
            };
        }
    }, [provider])

    const logout = () => {
        setAnchorEl(null);
        disconnect()

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
    const networks = [{ name: 'Polygon', icon: 'https://polygonscan.com/images/svg/brands/polygon.svg?v=1.3', chainId: 137 }, { name: 'BSC', icon: 'https://i.imgflip.com/6dky3c.png', chainId: 56 }, { name: 'Ethereum', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png', chainId: 1 }]
    const networkList = []
    networks.forEach(object => {
        networkList.push(<Button key={object.chainId } color={object.chainId === chainId ? 'primary' : 'secondary'}>
            <img  alt=""className={object.chainId === chainId ? 'selectedNetworkIcon chainIcon' : 'chainIcon'} src={object.icon}  />
            <div className="networktext"> {object.name}</div></Button >)


    })
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
    );
}

export default WalletConnecter;