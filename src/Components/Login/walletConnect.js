// import WalletConnectProvider from '@walletconnect/web3-provider';
import { ethers, providers } from 'ethers';
// import Fortmatic from 'fortmatic';
// import Torus from '@toruslabs/torus-embed';
import Web3Modal from 'web3modal';
// import { store } from '../redux/store';

const providerHandler = async (providerOptions, walletName) => {
  const web3Modal = new Web3Modal({
    cacheProvider: true,
    providerOptions: providerOptions,
  });
  const providerConnect = await web3Modal.connectTo(walletName);
  const provider = new providers.Web3Provider(providerConnect);
  return provider;
};

const metamaskProvider = async (providerName) => {
  try {
    // let providerName = name || store.getState().user.ethProviderName || 'jsonrpc';
    // 
      let provider;
      if (providerName === 'metamask') {
        if (!window.ethereum) throw new Error('Metamask Unavailable');
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        return provider;
      }

    if (providerName === 'jsonrpc') {
      const chainId = process.env.REACT_APP_CHAIN_ID;
      const rpcUrls = chainId === '80001' ? 'https://rpc-mumbai.maticvigil.com' : 'https://rpc-mainnet.maticvigil.com';
      provider = new ethers.providers.JsonRpcProvider(rpcUrls);
    }
    return provider;
  } catch (error) {
    console.log(error);
    throw error;
  }

  // await window.ethereum.enable(); //(DEPRECATED)
  // // await window.ethereum.request({
  // //   method: 'wallet_requestPermissions',
  // //   params: [
  // //     {
  // //       eth_accounts: {},
  // //     },
  // //   ],
  // // });
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // return provider;
};

// const walletConnectProvider = async () => {
//   const providerOptions = {
//     walletconnect: {
//       package: WalletConnectProvider,
//       options: {
//         infuraId: '214b5c5d785048ddadb554b728857f22',
//       },
//     },
//   };
//   const provider = await providerHandler(providerOptions, walletsList.walletConnect);
//   return provider;
// };

// const torusProvider = async () => {
//   const torus = new Torus({
//     enableLogging: true,
//   });
//   await torus.init();
//   torus.ethereum.isStatus = true;
//   const provider = new providers.Web3Provider(torus.ethereum);
//   return provider;
// };

// const fortmaticProvider = async () => {
//   const providerOptions = {
//     fortmatic: {
//       package: Fortmatic, // required
//       options: {
//         key: 'pk_test_5EF4C10219F1BAF4', // required
//       },
//     },
//   };
//   const provider = await providerHandler(providerOptions, walletsList.fortmatic);
//   return provider;
// };

export { metamaskProvider };
