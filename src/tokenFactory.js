
import { abis, contractAddresses, makeContract } from './contracts/useContracts';
import { bigToDecimal, bigToDecimalUints, decimalToBig, decimalToBigUints } from './utils/utils';
import React, { createContext } from 'react';
import { Web3ProviderContext } from './Components/walletConnect/walletConnect';

import { useSelector, useDispatch } from 'react-redux';
import { getStorage, setStorage } from './utils/common';
import Header from './Components/header';
export const TokenContext = createContext();

export function TokenFactory({ children }) {
    const [Tokens, setTokens] = React.useState([]);
    const [BorrowLimitations, setBorrowLimitations] = React.useState([]);
    const [TokensIntrestRateModal, setTokensIntrestRateModal] = React.useState([]);
    const [headerText, setHeaderText] = React.useState('');
    // const dispatch = useDispatch();
    const [TokenAggregators, setTokenAggregators] = React.useState([]);



    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

    const getAllTokens = async (governanceContract) => {
        if (localStorage.tokenStorage) {
            return JSON.parse(localStorage.tokenStorage || '[]')
        }
        if (!provider) {
            return JSON.parse(localStorage.tokenStorage || '[]') || []
        }

        const tokens = await governanceContract.getAllToken();
        const UpdatedTokens = []
        tokens.forEach((token) => {
            if (!token.isDeleted) {
                const newToken = {
                    name: token.name,
                    symbol: token.symbol,
                    address: token.tokenAddress,
                    icon: token.icon,
                    abi: abis.WETH,
                    pedgeToken: token.pedgeToken,
                    isPedgeToken: false
                }
                UpdatedTokens.push(newToken)
            }
        });

        setStorage('tokenStorage', JSON.stringify(UpdatedTokens))
        return UpdatedTokens || []
    }
    const getAllAggregators = async (governanceContract) => {
        if (localStorage.aggregatorsStorage) {
            return JSON.parse(localStorage.aggregatorsStorage || '[]')
        }
        if (!provider) {
            return JSON.parse(localStorage.aggregatorsStorage || '[]') || []
        }

        const aggregators = await governanceContract.getAllAggregators();
        const UpdatedAggregators = []
        if (aggregators && aggregators.length) {
            aggregators.forEach((aggregator) => {
                if (aggregator.isApplicable) {
                    const newAggregator = {
                        aggregator: aggregator.aggregatorAddress,
                        decimals: Number(aggregator.decimals),
                        tokenAddress: aggregator.tokenAddress,
                    }
                    UpdatedAggregators.push(newAggregator)
                }
            });
        }

        setStorage('aggregatorsStorage', JSON.stringify(UpdatedAggregators))
        return UpdatedAggregators || []
    }

    const getAllBorrowLimitations = async (governanceContract) => {
        if (localStorage.borrowLimitations) {
            return JSON.parse(localStorage.borrowLimitations || '[]')
        }
        if (!provider) {
            return JSON.parse(localStorage.borrowLimitations || '[]') || []
        }

        const borrowLimitations = await governanceContract.getAllTokenBorrowLimitations();
        const UpdatedborrowLimitations = []
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
                }
                UpdatedborrowLimitations.push(newBorrowLimitation)

            });
        }

        setStorage('borrowLimitations', JSON.stringify(UpdatedborrowLimitations))
        return UpdatedborrowLimitations || []
    }

    const getAllIntrestRateModel = async (governanceContract) => {
        if (localStorage.tokensIntrestRateModels) {
            return JSON.parse(localStorage.tokensIntrestRateModels || '[]')
        }
        if (!provider) {
            return JSON.parse(localStorage.tokensIntrestRateModels || '[]') || []
        }

        const tokensIntrestRateModels = await governanceContract.getAllTokenIntrestRateModel();
        const UpdatedtokensIntrestRateModels = []
        if (tokensIntrestRateModels && tokensIntrestRateModels.length) {
            tokensIntrestRateModels.forEach((borrowLimitation) => {
                const newIntrestRateModels = {
                    tokenAddress: borrowLimitation.tokenAddress,
                    OPTIMAL_UTILIZATION_RATE: borrowLimitation.OPTIMAL_UTILIZATION_RATE,
                    StableRateSlope1: borrowLimitation.StableRateSlope1,
                    StableRateSlope2: borrowLimitation.StableRateSlope2,
                    VariableRateSlope1: borrowLimitation.VariableRateSlope1,
                    VariableRateSlope2: borrowLimitation.VariableRateSlope2,
                    BaseRate: borrowLimitation.BaseRate
                }
                UpdatedtokensIntrestRateModels.push(newIntrestRateModels)

            });
        }

        setStorage('tokensIntrestRateModels', JSON.stringify(UpdatedtokensIntrestRateModels))
        return UpdatedtokensIntrestRateModels || []
    }

    async function setTokenFactory() {
        if (Tokens.length) {
            return
        }
        const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);
        const tokens = await getAllTokens(governanceContract);
        if (!tokens || !tokens.length) {
            return
        }
        setTokens(tokens)
        // setTokens({
        //     WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
        //     fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
        //     dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
        //     fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
        // })

        const aggregators = await getAllAggregators(governanceContract);

        // [
        //     // { tokenSymbol: Tokens.ETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
        //     // { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }
        // ]
        setTokenAggregators(
            aggregators
        )

        const newborrowLimitations = await getAllBorrowLimitations(governanceContract);

        setBorrowLimitations(
            newborrowLimitations
        )
        const tokenIRS = await getAllIntrestRateModel(governanceContract);

        setTokensIntrestRateModal(
            tokenIRS
        )

    }
    React.useEffect(() => {
        setTokenFactory()
    }, [provider]);
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
    }

    const IntrestRateModal = {
        OPTIMAL_UTILIZATION_RATE: TokenBorrowLimitations.OPTIMAL_UTILIZATION_RATE,
        StableRateSlope1: TokenBorrowLimitations.StableRateSlope1,
        StableRateSlope2: TokenBorrowLimitations.StableRateSlope2,
        VariableRateSlope1: TokenBorrowLimitations.VariableRateSlope1,
        VariableRateSlope2: TokenBorrowLimitations.VariableRateSlope2,
        BaseRate: TokenBorrowLimitations.BaseRate,
    }

    const getTokenProperties = (tokenAddress) => {
        const borrowLimitation = {}
        Object.keys(TokenBorrowLimitations).forEach(key => {

            borrowLimitation[key] = typeof TokenBorrowLimitations[key] == 'object' ?
                Number(bigToDecimalUints(TokenBorrowLimitations[key], 2)) * 100 : TokenBorrowLimitations[key];

        })
        let token = Tokens.find(t => t.address === tokenAddress);
        let aggregator = TokenAggregators.find(aggregator => aggregator.tokenAddress === tokenAddress)
        return { token, borrowLimitation, aggregator }

    }

    return (
        <TokenContext.Provider
            value={{
                getTokenProperties,
                Tokens,
                IntrestRateModal,
                BorrowLimitations,
                TokensIntrestRateModal,
                TokenAggregators,
                TokenBorrowLimitations,
                headerText, setHeaderText
            }}
        >
            {
                children
            }

        </TokenContext.Provider>
    );
}

