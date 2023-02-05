
import WalletConnect from "@walletconnect/web3-provider";
import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
import Torus from "@toruslabs/torus-embed";
import { Icons } from "../../icons";
import * as dotenv from 'dotenv';
dotenv.config();
export const Networks = [{ name: 'Polygon', internalName: 'goerli', icon: Icons.polygon, chainId: 5 }, { name: 'BSC', icon: 'https://i.imgflip.com/6dky3c.png', chainId: 56 }, { name: 'Ethereum', icon: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Ethereum-icon-purple.svg/480px-Ethereum-icon-purple.svg.png', chainId: 1 }]

const providerOptions = {
    coinbasewallet: {
        package: CoinbaseWalletSDK,
        options: {
            appName: "Web 3 Modal Demo",
            infuraId: process.env.INFURA_KEY
        }
    },
    walletconnect: {
        package: WalletConnect,
        options: {
            infuraId: process.env.INFURA_KEY
        }
    },
    torus: {
        package: Torus, // required
        options: {
            networkParams: {
                chainId: 1337, // optional
                networkId: 1337 // optional
            },
            config: {
                buildEnv: "development" // optional
            }
        }
    }
};


export default providerOptions;