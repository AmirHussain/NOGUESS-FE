import { abis, contractAddresses, makeContract } from './contracts/useContracts';
import { bigToDecimal, bigToDecimalUnits, decimalToBig, decimalToBigUnits } from './utils/utils';
import React, { createContext } from 'react';
import { Web3ProviderContext } from './Components/walletConnect/walletConnect';

import { useSelector, useDispatch } from 'react-redux';
import { getStorage, setStorage } from './utils/common';
import Header from './Components/header';
import { ethers } from 'ethers';
export const TokenContext = createContext();
let readingContracts = false;

export function TokenFactory({ children }) {
  const [Tokens, setTokens] = React.useState([]);
  const [StakingOptions, setStakingOptions] = React.useState([]);

  const [BorrowLimitations, setBorrowLimitations] = React.useState([]);
  const [TokensIntrestRateModal, setTokensIntrestRateModal] = React.useState([]);
  const [headerText, setHeaderText] = React.useState('');
  // const dispatch = useDispatch();
  const [TokenAggregators, setTokenAggregators] = React.useState([]);
  const [refreshData, setRefreshData] = React.useState(false);
  const [owner, setOwner] = React.useState('');

  const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);
  // const getAllTokens = async (governanceContract) => {
  //   let tokens = [];
  //   if (localStorage.tokenStorage) {
  //     tokens = JSON.parse(localStorage.tokenStorage || '[]');
  //     tokens.forEach((token) => (token.abi = abis.WETH));
  //   }
  //   if (!provider) {
  //     tokens = JSON.parse(localStorage.tokenStorage || '[]') || [];

  //     tokens.forEach((token) => (token.abi = abis.WETH));
  //   }
  //   if (!tokens || !tokens.length) {
  //     tokens = await governanceContract.getAllToken();
  //   }
  //   const UpdatedTokens = [];
  //   tokens.forEach((token) => {
  //     if (!token.isDeleted) {
  //       const newToken = {
  //         name: token.name,
  //         symbol: token.symbol,
  //         address: token.tokenAddress,
  //         icon: token.icon,
  //         abi: abis.WETH,
  //         pedgeToken: token.pedgeToken,
  //         isPedgeToken: false,
  //       };
  //       UpdatedTokens.push(newToken);
  //     }
  //   });

  //   setStorage('tokenStorage', JSON.stringify(UpdatedTokens));
  //   return UpdatedTokens || [];
  // };
  const getAllStakingOptions = async (offeringContract) => {
    let stakingOptions = [];
    const lastUpdated = await offeringContract.lastUpdated();
    if (new Date(lastUpdated * 1000).toISOString() !== new Date(localStorage.lastUpdated || 0).toISOString()) {
      setStorage('lastUpdated', new Date(lastUpdated * 1000).toISOString());
      setStorage('stakingOptions', JSON.stringify([]));
    }
    if (localStorage.stakingOptions) {
      stakingOptions = JSON.parse(localStorage.stakingOptions || '[]');
    }
    if (!provider) {
      stakingOptions = JSON.parse(localStorage.stakingOptions || '[]') || [];
    } else if (!stakingOptions.length) {
      console.log('getting contract');
      stakingOptions = await offeringContract.GetAllStakingOptions();
      stakingOptions = transformAndSetStakingOptions(stakingOptions);
      setStorage('stakingOptions', JSON.stringify(stakingOptions));
    }

    return stakingOptions || [];
  };

  const transformAndSetStakingOptions = (rows) => {
    const tRows = [];
    if (rows && rows) {
      rows.forEach((row) => {
        tRows.push({
          staking_contract_address: row.staking_contract_address,
          staking_token: {
            token_name: row.staking_token.token_name,
            token_address: row.staking_token.token_address,
            token_image: row.staking_token.token_image,
            token_symbol: row.staking_token.token_symbol,
          },
          plane_name: row.plane_name,
          min_deposit: row.min_deposit,
          max_deposit: row.max_deposit,
          life_days: Number(row.life_days).toString(),
          percent: Number(row.percent).toString(),
          num_of_days: Number(row.num_of_days).toString(),
          ref_bonus: Number(row.ref_bonus).toString(),
          isActive: row.isActive,
        });
      });
    }

    return tRows;
  };
  const getAllAggregators = async (governanceContract) => {
    if (localStorage.aggregatorsStorage) {
      return JSON.parse(localStorage.aggregatorsStorage || '[]');
    }
    if (!provider) {
      return JSON.parse(localStorage.aggregatorsStorage || '[]') || [];
    }

    const aggregators = await governanceContract.getAllAggregators();
    const UpdatedAggregators = [];
    if (aggregators && aggregators.length) {
      aggregators.forEach((aggregator) => {
        if (aggregator.isApplicable) {
          const newAggregator = {
            aggregator: aggregator.aggregatorAddress,
            decimals: Number(aggregator.decimals),
            tokenAddress: aggregator.tokenAddress,
          };
          UpdatedAggregators.push(newAggregator);
        }
      });
    }

    setStorage('aggregatorsStorage', JSON.stringify(UpdatedAggregators));
    return UpdatedAggregators || [];
  };

  const getAllBorrowLimitations = async (governanceContract) => {
    if (localStorage.borrowLimitations) {
      return JSON.parse(localStorage.borrowLimitations || '[]');
    }
    if (!provider) {
      return JSON.parse(localStorage.borrowLimitations || '[]') || [];
    }

    const borrowLimitations = await governanceContract.getAllTokenBorrowLimitations();
    const UpdatedborrowLimitations = [];
    if (borrowLimitations && borrowLimitations.length) {
      borrowLimitations.forEach((borrowLimitation) => {
        const newBorrowLimitation = {
          tokenAddress: borrowLimitation.tokenAddress,
          CollateralFator: borrowLimitation.CollateralFator,
          LiquidationThreshold: borrowLimitation.LiquidationThreshold,
          LiquidationPenalty: borrowLimitation.LiquidationPenalty,
          ProtocolShare: borrowLimitation.ProtocolShare,
          InitialBorrowRate: borrowLimitation.InitialBorrowRate,
          MAX_UTILIZATION_RATE: borrowLimitation.MAX_UTILIZATION_RATE,
          AllowStableJob: borrowLimitation.AllowStableJob,
        };
        UpdatedborrowLimitations.push(newBorrowLimitation);
      });
    }

    setStorage('borrowLimitations', JSON.stringify(UpdatedborrowLimitations));
    return UpdatedborrowLimitations || [];
  };

  const getAllIntrestRateModel = async (governanceContract) => {
    if (localStorage.tokensIntrestRateModels) {
      return JSON.parse(localStorage.tokensIntrestRateModels || '[]');
    }
    if (!provider) {
      return JSON.parse(localStorage.tokensIntrestRateModels || '[]') || [];
    }

    const tokensIntrestRateModels = await governanceContract.getAllTokenIntrestRateModel();
    const UpdatedtokensIntrestRateModels = [];
    if (tokensIntrestRateModels && tokensIntrestRateModels.length) {
      tokensIntrestRateModels.forEach((borrowLimitation) => {
        const newIntrestRateModels = {
          tokenAddress: borrowLimitation.tokenAddress,
          OPTIMAL_UTILIZATION_RATE: borrowLimitation.OPTIMAL_UTILIZATION_RATE,
          StableRateSlope1: borrowLimitation.StableRateSlope1,
          StableRateSlope2: borrowLimitation.StableRateSlope2,
          VariableRateSlope1: borrowLimitation.VariableRateSlope1,
          VariableRateSlope2: borrowLimitation.VariableRateSlope2,
          BaseRate: borrowLimitation.BaseRate,
        };
        UpdatedtokensIntrestRateModels.push(newIntrestRateModels);
      });
    }

    setStorage('tokensIntrestRateModels', JSON.stringify(UpdatedtokensIntrestRateModels));
    return UpdatedtokensIntrestRateModels || [];
  };

  const readContractFunctions = (offerings) => {
    const contracts = [];
    offerings.forEach(async (offer, index) => {
      contracts[index] = makeContract(offer.staking_contract_address, abis.staking);
    });
    checkLastUpdate(contracts, offerings);
  };

  async function checkLastUpdate(contracts, offerings) {
    setTimeout(async () => {
      for (var i = 0; i < contracts.length; i++) {
        const lastUpdated = await contracts[i].lastUpdated();
        if (new Date(lastUpdated * 1000).toISOString() !== new Date(localStorage['lastUpdated-' + offerings[i].staking_contract_address] || 0).toISOString()) {
          setStorage('lastUpdated-' + offerings[i].staking_contract_address, new Date(lastUpdated * 1000).toISOString());
          setRefreshData(true);
          setTimeout(() => {
            setRefreshData(false);
          });
        }
      }
      checkLastUpdate(contracts, offerings);
    }, 30000);
  }
  async function setTokenFactory() {
    const stakingOfferingsContract = makeContract(contractAddresses.stakingOfferings, abis.stakingOfferings, signer);
    setOwner(await stakingOfferingsContract.getOwner());

    const offerings = await getAllStakingOptions(stakingOfferingsContract);
    if (!offerings || !offerings.length) {
      return;
    }
    setStakingOptions(offerings);

    // setTokens({
    //     WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
    //     fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
    //     dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
    //     fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
    // })

    // const aggregators = await getAllAggregators(governanceContract);

    // [
    //     // { tokenSymbol: Tokens.ETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
    //     // { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }
    // ]
    // setTokenAggregators(
    //     aggregators
    // )

    // const newborrowLimitations = await getAllBorrowLimitations(governanceContract);

    // setBorrowLimitations(
    //     newborrowLimitations
    // )
    // const tokenIRS = await getAllIntrestRateModel(governanceContract);

    // setTokensIntrestRateModal(
    //     tokenIRS
    // )
  }
  React.useEffect(() => {
    if (provider) {
      setTokenFactory();
    }
  }, [provider, setTokenFactory]);

  React.useEffect(() => {
    if (StakingOptions && StakingOptions.length && !readingContracts) {
      readingContracts = true;
      readContractFunctions(StakingOptions);
    }
  }, [StakingOptions, readContractFunctions]);
  const TokenBorrowLimitations = {
    CollateralFator: decimalToBig('0.70'),
    LiquidationThreshold: decimalToBig('0.80'),
    LiquidationPenalty: decimalToBig('0.30'),
    ProtocolShare: decimalToBig('0.01'),
    InitialBorrowRate: decimalToBig('0.30'),
    MAX_UTILIZATION_RATE: decimalToBig('1.00'),
    OPTIMAL_UTILIZATION_RATE: decimalToBig('0.70'),
    StableRateSlope1: decimalToBig('0.04'),
    StableRateSlope2: decimalToBig('0.15'),
    VariableRateSlope1: decimalToBig('0.02'),
    VariableRateSlope2: decimalToBig('0.10'),
    BaseRate: decimalToBig('0.010'),
    AllowStableJob: true,
  };

  const IntrestRateModal = {
    OPTIMAL_UTILIZATION_RATE: TokenBorrowLimitations.OPTIMAL_UTILIZATION_RATE,
    StableRateSlope1: TokenBorrowLimitations.StableRateSlope1,
    StableRateSlope2: TokenBorrowLimitations.StableRateSlope2,
    VariableRateSlope1: TokenBorrowLimitations.VariableRateSlope1,
    VariableRateSlope2: TokenBorrowLimitations.VariableRateSlope2,
    BaseRate: TokenBorrowLimitations.BaseRate,
  };

  const getTokenProperties = (tokenAddress) => {
    const borrowLimitation = {};
    Object.keys(TokenBorrowLimitations).forEach((key) => {
      borrowLimitation[key] = typeof TokenBorrowLimitations[key] == 'object' ? Number(bigToDecimalUnits(TokenBorrowLimitations[key], 2)) * 100 : TokenBorrowLimitations[key];
    });
    let token = Tokens.find((t) => t.address === tokenAddress);
    let aggregator = TokenAggregators.find((aggregator) => aggregator.tokenAddress === tokenAddress);
    return { token, borrowLimitation, aggregator };
  };

  const getToken = async (address) => {
    const currentToken = Tokens.find((t) => t.address === address);
    if (!TokenAggregators.length) {
      const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);
      const aggregators = await getAllAggregators(governanceContract);
      // [
      //     // { tokenSymbol: Tokens.ETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
      //     // { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }
      // ]
      setTokenAggregators(aggregators);
    }
    let aggregator = TokenAggregators.find((aggregator) => aggregator.tokenAddress === address);

    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
    if (currentToken) {
      currentToken.aggregator = aggregator;
      return {
        symbol: currentToken.symbol,
        tokenAddress: currentToken.address, // address of the user that lended
        unitPriceInUSD: await getPrice(currentToken, lendingContract),
      };
    }
    return;
  };

  const getPrice = async (tokendetails, lendingContract) => {
    if (tokendetails.aggregator) {
      const result = await lendingContract.getAggregatorPrice(tokendetails?.aggregator?.aggregator);
      const priceInUSD = Number(result) / Math.pow(10, tokendetails?.aggregator?.decimals);
      return decimalToBigUnits(priceInUSD.toString(), 18);
    }
  };

  return (
    <TokenContext.Provider
      value={{
        getTokenProperties,
        Tokens,
        IntrestRateModal,
        StakingOptions,
        BorrowLimitations,
        TokensIntrestRateModal,
        TokenAggregators,
        TokenBorrowLimitations,
        headerText,
        setHeaderText,
        getToken,
        refreshData,
        setRefreshData,
        owner,
      }}
    >
      {children}
    </TokenContext.Provider>
  );
}
