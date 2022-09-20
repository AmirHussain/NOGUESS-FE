import polygon from './assets/svg/polygon.svg';
import ethereum from './assets/svg/ethereum.svg';
import { abis } from './contracts/useContracts';


export const Tokens = {
    WETH: { name: 'Wrapped Ether', symbol: 'WETH', address: '0x21c639bBC0ce1be64a442dc495867a4F1D2122d0', icon: polygon, abi: abis.WETH },
    fWETH: { name: 'Pledged Wrapped Ether', symbol: 'fWETH', address: '0x4a52E515b61ae9BEE3f32B8EFBaE8978fC0Bf703', icon: ethereum, abi: abis.fWETH },
    dai: { name: 'Dai Stable Coin', symbol: 'DAI', address: '0xC7C2a6b1026387F241a9F312b98d4A0843bf442c', icon: polygon, abi: abis.DAI },
    fDAI: { name: 'Pledged Dai Stable Coin', symbol: 'fDAI', address: '0x8076040fC2BC15c4033A12D2e4a19901fFa3C648', icon: ethereum, abi: abis.fDAI },
}