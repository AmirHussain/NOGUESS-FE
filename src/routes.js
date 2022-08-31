//========================= MarketPlace =====================================================//
import lendingIcon from './assets/svg/1.svg';
import stakingIcon from './assets/svg/2.svg';
import governanceIcon from './assets/svg/3.svg';
import bridgeIcon from './assets/svg/4.svg';
export const routes = {
    home: "/",
    login: '/login',
    lending: '/lending',
    market: '/market',
    staking: '/staking'
}

export const routeHeaders = {
    "/": { name: "Lending", icon:lendingIcon },
    '/login':  { name: "Login", icon:lendingIcon },
    '/lending': { name: "Lending", icon:lendingIcon } ,
    '/market': { name: "Market", icon:lendingIcon } ,
    '/staking':  { name: "Staking", icon:stakingIcon },
    '/governance': { name: "Governance", icon:governanceIcon } ,
    '/bridge':  { name: "Bridge", icon:bridgeIcon }

}
