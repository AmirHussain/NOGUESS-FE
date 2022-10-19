import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis, contractAddresses, makeContract } from './contracts/useContracts';
import { bigToDecimal, bigToDecimalUints, decimalToBig, decimalToBigUints } from './utils/utils';
import React, { createContext } from 'react';
import { Web3ProviderContext } from './Components/walletConnect/walletConnect';
export const TokenContext = createContext();
export function TokenFactory({ children }) {
    const [Tokens, setTokens] = React.useState([]);

    const [TokenAggregators, setTokenAggregators] = React.useState([]);

    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

    const getAllTokens = async (governanceContract) => {
        if (!provider) {
            return []
        }

        const result = await governanceContract.getAllToken();
        return result || []
    }
    const getAllAggregators = async (governanceContract) => {
        if (!provider) {
            return []
        }

        const result = await governanceContract.getAllAggregators();
        return result || []
    }

    async function setTokenFactory() {
        if (Tokens.length) {
            return
        }
        const governanceContract = makeContract(contractAddresses.governance, abis.governance, signer);
        const tokens = await getAllTokens(governanceContract);
        const UpdatedTokens = []
        if (!tokens || !tokens.length) {
            return
        }
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
        setTokens(UpdatedTokens)
        // setTokens({
        //     WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
        //     fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
        //     dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
        //     fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
        // })

        const aggregators = await getAllAggregators(governanceContract);
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
        // [
        //     // { tokenSymbol: Tokens.ETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
        //     // { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }
        // ]
        setTokenAggregators(
            UpdatedAggregators
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
        MAX_UTILIZATION_RATE: decimalToBig('0.80'),
        OPTIMAL_UTILIZATION_RATE: decimalToBig('0.70'),
        StableRateSlope1: decimalToBig('0.04'),
        StableRateSlope2: decimalToBig('0.50'),
        VariableRateSlope1: decimalToBig('0.02'),
        VariableRateSlope2: decimalToBig('0.40'),
        baseRate: decimalToBig('0.010'),
        AllowStableJob: true,
    }

    const IntrestRateModal = {
        OPTIMAL_UTILIZATION_RATE: TokenBorrowLimitations.OPTIMAL_UTILIZATION_RATE,
        stableRateSlope1: TokenBorrowLimitations.StableRateSlope1,
        stableRateSlope2: TokenBorrowLimitations.StableRateSlope2,
        variableRateSlope1: TokenBorrowLimitations.VariableRateSlope1,
        variableRateSlope2: TokenBorrowLimitations.VariableRateSlope2,
        baseRate: TokenBorrowLimitations.baseRate,
    }

    const getTokenProperties = (tokenAddress) => {
        const borrowLimitation = {}
        Object.keys(TokenBorrowLimitations).forEach(key => {

            borrowLimitation[key] = typeof TokenBorrowLimitations[key] == 'object' ?
                Number(bigToDecimalUints(TokenBorrowLimitations[key], 2)) * 100 : TokenBorrowLimitations[key];

        })
        let token=Tokens.find(t=>t.address===tokenAddress);
        let aggregator = TokenAggregators.find(aggregator => aggregator.tokenAddress === tokenAddress)
        return { token, borrowLimitation, aggregator }

    }

    return (
        <TokenContext.Provider
            value={{
                getTokenProperties,
                Tokens,
                IntrestRateModal,
                TokenAggregators,
                TokenBorrowLimitations
            }}
        >
            {
                children
            }

        </TokenContext.Provider>
    );
}

