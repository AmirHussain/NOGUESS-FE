import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis } from './contracts/useContracts';
import { decimalToBig } from './utils/utils';


export const Tokens = {
    WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
    fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
    dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
    fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
}

export const TokenBorrowLimitations = {
    CollateralFator: decimalToBig('70'),
    LiquidationThreshold: decimalToBig('70'),
    LiquidationPenalty: decimalToBig('30'),
    ProtocolShare: decimalToBig('0.01'),
    InitialBorrowRate: decimalToBig('0.30'),
    OPTIMAL_UTILIZATION_RATE: decimalToBig('60'),
    StableRateSlope1: decimalToBig('0.01'),
    StableRateSlope2: decimalToBig('0.03'),
    VariableRateSlope1: decimalToBig('0.01'),
    VariableRateSlope2: decimalToBig('0.01'),
    baseRate: decimalToBig('0.05'),
    AllowStableJob: true,
}
// let OPTIMAL_UTILIZATION_RATE=decimalToBig('0.70');
// let stableRateSlope1=decimalToBig('0.01')
// let stableRateSlope2=decimalToBig('0.01')
// let variableRateSlope1=decimalToBig('0.01')
// let variableRateSlope2=decimalToBig('0.01')
// let baseRate=decimalToBig('0.04')
// let ProtocolShare=decimalToBig('0.3')
export const IntrestRateModal={
    OPTIMAL_UTILIZATION_RATE:TokenBorrowLimitations.OPTIMAL_UTILIZATION_RATE,
    stableRateSlope1:TokenBorrowLimitations.StableRateSlope1,
    stableRateSlope2:TokenBorrowLimitations.StableRateSlope2,
    variableRateSlope1:TokenBorrowLimitations.VariableRateSlope1,
    variableRateSlope2:TokenBorrowLimitations.VariableRateSlope2,
    baseRate:TokenBorrowLimitations.baseRate,
}
export const TokenAggregators = [
    { tokenSymbol: Tokens.WETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
    { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }

]
