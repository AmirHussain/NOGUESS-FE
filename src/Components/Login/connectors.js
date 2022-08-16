import { InjectedConnector } from "web3-react/dist/connectors";
export const injectedChainIds = new InjectedConnector({
    supportedNetworks: [1, 3, 4, 5, 42]
})