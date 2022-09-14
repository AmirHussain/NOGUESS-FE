
  import WalletConnect from "@walletconnect/web3-provider";
  import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
  import Torus from "@toruslabs/torus-embed";

const  providerOptions = {
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