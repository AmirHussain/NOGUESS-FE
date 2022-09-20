import { createContext, useEffect, useState } from 'react';
import theme from '../../theme';
import { makeStyles } from '@mui/styles';
import { Button, Card, ButtonGroup, Menu, MenuItem, Fab, Divider, Popover } from '@mui/material';
import { ArrowDownward } from '@mui/icons-material';
import { ethers } from "ethers";
import Web3Modal from "web3modal";
import { useSelector, useDispatch } from 'react-redux';
import { loginUser, logoutUser } from '../../redux/store/actions/user';

import providerOptions from '../walletConnect/providers'


const useStyles = makeStyles({
    walletConnect: theme.actionButton,
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
export const Web3ProviderContext = createContext();

export function Web3Provider({ children }) {
    const classes = useStyles();
    const dispatch = useDispatch();

    const [provider, setProvider] = useState();
    const [library, setLibrary] = useState();
    const [account, setAccount] = useState();
    const [signature, setSignature] = useState("");
    const [signer, setSigner] = useState("");

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
            if (accounts) {
                setAccount(accounts[0]);
                dispatch(loginUser({ address: accounts[0] }));
            }
            setChainId(network.chainId);

            setSigner(library.getSigner())
        } catch (error) {
            setError(error);
        }

        return { provider:library,signer}


    }
    const handleNetwork = (id) => {
        setChainId(id)
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
                params: [{ chainId: ethers.utils.hexlify(chainId) }]
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
                if (accounts) {
                    setAccount(accounts[0]);
                    dispatch(loginUser({ address: accounts[0] }));
                }
            };

            const handleChainChanged = (_hexChainId) => {
                setChainId(_hexChainId);
            };

            const handleDisconnect = () => {
                console.log("disconnect", error);
                disconnect();
                dispatch(logoutUser());
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
    return (
        <Web3ProviderContext.Provider
            value={{
                provider,
                signer,
                setSigner,
                disconnect,
                chainId,
                account,
                connectWallet,
                handleNetwork,
                switchNetwork
            }}
        >
            {
                children
            }

        </Web3ProviderContext.Provider>
    );
}
