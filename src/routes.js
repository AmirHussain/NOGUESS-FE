//========================= MarketPlace =====================================================//
import lendingIcon from './assets/svg/1.svg';
import stakingIcon from './assets/svg/2.svg';
import governanceIcon from './assets/svg/3.svg';
import bridgeIcon from './assets/svg/4.svg';
import marketIcon from './assets/svg/5.svg';
export const routes = {
  home: '/',
  login: '/login',
  lending: '/lending',
  market: '/market',
  asset: '/asset',
  staking: '/staking',
  proposal: '/proposal',
  game: '/game',
};

export const routeHeaders = {
  '/asset': { name: 'Asset', icon: lendingIcon, showBackBotton: true },
  '/': { name: 'Staking', icon: lendingIcon },
  '/login': { name: 'Login', icon: lendingIcon },
  '/lending': { name: 'Dashboard', icon: lendingIcon },
  '/market': { name: 'Market', icon: marketIcon },
  '/staking': { name: 'Staking', icon: stakingIcon },
  '/governance': { name: 'Governance', icon: governanceIcon },
  '/bridge': { name: 'Bridge', icon: bridgeIcon },
  '/proposal': { name: 'overview', icon: governanceIcon, showBackBotton: true },
};
