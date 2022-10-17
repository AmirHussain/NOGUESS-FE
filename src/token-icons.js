import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis, contractAddresses, makeContract } from './contracts/useContracts';
import { bigToDecimal, bigToDecimalUints, decimalToBig, decimalToBigUints } from './utils/utils';
import React, { createContext } from 'react';
import { Web3ProviderContext } from './Components/walletConnect/walletConnect';
export const GovernanceContext = createContext();
export function Governance({ children }) {
    const { connectWallet, provider, signer } = React.useContext(Web3ProviderContext);

    const getAllTokens = async () => {
        

        const lendingContract = makeContract(contractAddresses.governance, abis.governance, signer);
        const TokenKeysAndAddresses = Object.keys(Tokens).map(key => {
            return { symbol: Tokens[key].symbol, address: Tokens[key].address }
        })
        const aggregators = TokenAggregators.map((aggtoken) => {
            const currentToken = TokenKeysAndAddresses.find(token => aggtoken.tokenSymbol === token.symbol)
            if (currentToken) {
                return {
                    aggregator: aggtoken.aggregator, tokenAddress: currentToken.address, decimal: decimalToBigUints(aggtoken.decimals.toString(), aggtoken.decimals > 9 ? 0 : 0)
                }

            }
        });
        const data = await lendingContract.getCurrentLiquidity(
            aggregators
        );
    }


    const Tokens = {
        WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
        fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
        dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
        fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
    }

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
     const TokenAggregators = [
        { tokenSymbol: Tokens.WETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
        { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }
    ]

     const getTokenProperties = (symbol) => {
        const borrowLimitation = {}
        Object.keys(TokenBorrowLimitations).forEach(key => {

            borrowLimitation[key] = typeof TokenBorrowLimitations[key] == 'object' ?
                Number(bigToDecimalUints(TokenBorrowLimitations[key], 2)) * 100 : TokenBorrowLimitations[key];

        })
        let token;
        Object.keys(Tokens).forEach(key => {
            if (Tokens[key].symbol === symbol) {
                token = Tokens[key];
            }
        });
        let aggregator = TokenAggregators.find(token => token.tokenSymbol === symbol)
        return { token, borrowLimitation, aggregator }

    }

    return (
        <Web3ProviderContext.Provider
            value={{
                getTokenProperties,
                Tokens
            }}
        >
            {
                children
            }

        </Web3ProviderContext.Provider>
    );
}

