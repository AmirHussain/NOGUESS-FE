import { useContractCall } from '@usedapp/core';
import { ethers } from 'ethers';
import { governance, lendingAbi, stakingOfferings, wethAbi, staking, governanceVoting } from './abi/abi';
import * as dotenv from 'dotenv';
import { Interface } from 'ethers/lib/utils';
dotenv.config();

const abis = {
  lending: new ethers.utils.Interface(lendingAbi),
  governance: new ethers.utils.Interface(governance),
  governanceVoting: new ethers.utils.Interface(governanceVoting),
  stakingOfferings: new ethers.utils.Interface(stakingOfferings),
  staking: new ethers.utils.Interface(staking),
  WETH: new ethers.utils.Interface(wethAbi),
  fWETH: new ethers.utils.Interface(wethAbi),
  DAI: new ethers.utils.Interface(wethAbi),
  fDAI: new ethers.utils.Interface(wethAbi),
};

const contractAddresses = {
  lending: '0xfb90B43c2381383Cc9720d8A78DaC278F2Bb1e12',
  governance: '0xb1E094AceA8A1dbAf6d5C1b204d200a05f82362e',
  stakingOfferings: '0x7dbafa04E693F523C962da4E3680282e2Ee1d0e3',
  staking: '0xea8128e8a6F3e523bB44257A5A94B6187289E4AD',
  governanceVoting: '0x9d0D655CfD6f873b900D50de82e309415242DD9c',
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
  if (!signerOrProvider) {
    signerOrProvider = ethers.getDefaultProvider('sepolia');
  }
  if (!address || !abi) {
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
