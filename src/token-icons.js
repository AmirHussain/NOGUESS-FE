import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis } from './contracts/useContracts';


export const Tokens = {
    WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0xFb156f075E7F00c80abEBFD4BaB3b9258F5D8B13', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
    fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x933458F3F0154c3141b044eB77D20a409e614028', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
    dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xe00FDE46D3fA6dFa89D513C0E076F75aE5E2573C', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
    fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0xd3Ff113B615104E2eD6821ed6eEe318bdEb7B83A', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
}

export const TokenAggregators = [
    { tokenSymbol: Tokens.WETH.symbol, aggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 },
    { tokenSymbol: Tokens.dai.symbol, aggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals: 8 }

]
