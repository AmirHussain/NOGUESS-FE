import { useContractCall } from '@usedapp/core';
import { ethers } from 'ethers';
import { governance, lendingAbi,wethAbi } from './abi/abi';

const abis = {
  lending: new ethers.utils.Interface(lendingAbi),
  governance: new ethers.utils.Interface(governance),
  WETH: new ethers.utils.Interface(wethAbi),
  fWETH: new ethers.utils.Interface(wethAbi),
  DAI: new ethers.utils.Interface(wethAbi),
  fDAI: new ethers.utils.Interface(wethAbi),
};

const contractAddresses = {
  lending: '0x117EcdB238423F3a72Cde5F2FEB172D1FFEe1E64', 
  governance: '0xc72c5c9457c2EE23D8CF6D9eBEBe0610eF72809E'
};

const useCustomContractCall = (abi, contractAddress, method, args, transformFunc) => {
  //   const data = useContractCall(abi && contractAddress && method && args && { abi, contractAddress, method, args }) ?? [];
  const data =
    useContractCall(
      abi &&
        contractAddress &&
        method &&
        args && {
          abi: abi,
          address: contractAddress,
          method: method,
          args: [...args],
        },
    ) ?? [];

  if (typeof transformFunc === 'function') {
    return transformFunc(data);
  }
  return data;
};

const getInfuraProvider = () => {
  const rpcUrls = process.env.REACT_APP_INFURA_ENDPOINT;
  const ethProvider = new ethers.providers.JsonRpcProvider(rpcUrls);
  return ethProvider;
};

const getWalletProvider = (walletName) => {
  if (!walletName) {
    throw new Error('No wallet name provided');
  }

  if (walletName === 'metamask') {
    if (!window.ethereum) throw new Error('Metamask Unavailable');
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    return provider;
  }

  if (walletName === 'walletConnect') {
  }
};

const makeContract = (address, abi, signerOrProvider) => {
  if(!signerOrProvider){
     signerOrProvider = ethers.getDefaultProvider('goerli');
  }
  if (!address || !abi ) {
    throw new Error('Insuficient arguments');
  }
  return new ethers.Contract(address, abi, signerOrProvider);
};

const asyncContractCall = async (contract, method, args, transformFunc) => {
  try {
    console.log(contract, method);
    return await contract[method](...args);
  } catch (error) {
    console.log(error);
  }
};

export { abis, contractAddresses, useCustomContractCall, makeContract, asyncContractCall, getInfuraProvider, getWalletProvider };
