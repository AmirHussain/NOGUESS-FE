import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis } from './contracts/useContracts';


export const Tokens = {
    WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0x21c639bBC0ce1be64a442dc495867a4F1D2122d0', icon: polygon, abi: abis.WETH, pedgeToken: 'fWETH', isPedgeToken: false },
    fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x4a52E515b61ae9BEE3f32B8EFBaE8978fC0Bf703', icon: ethereum, abi: abis.fWETH, pedgeToken: 'fWETH', isPedgeToken: true },
    dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xC7C2a6b1026387F241a9F312b98d4A0843bf442c', icon: ethereum, abi: abis.DAI, pedgeToken: 'fDAI', isPedgeToken: false },
    fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0x8076040fC2BC15c4033A12D2e4a19901fFa3C648', icon: ethereum, abi: abis.fDAI, pedgeToken: 'fDAI', isPedgeToken: true },
}

export const TokenAggregators = [
    { collatralToken: Tokens.WETH.symbol, loanToken: Tokens.dai.symbol, collateralAggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', loanAggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', decimals:8 },
    { collatralToken: Tokens.dai.symbol, loanToken: Tokens.WETH.symbol, collateralAggregator: '0x0d79df66BE487753B02D015Fb622DED7f0E9798d', loanAggregator: '0xD4a33860578De61DBAbDc8BFdb98FD742fA7028e', decimals: 8 }

]
