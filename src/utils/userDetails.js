import { ethers } from "ethers";
import { abis, contractAddresses, makeContract } from "../contracts/useContracts";

export async function getUserSuppliedAmount(signer, symbol) {
    if (!signer) {
        return

    }
    let returnamount = 0;
    const lendingContract = makeContract(contractAddresses.lending, abis.lending, signer);
    const ids = await lendingContract.getLenderId(symbol);
    debugger;
    if (ids && ids.length) {
        for (var i = 0; i < ids.length; i++) {
            const details = await lendingContract.getLenderAsset(ids[i]);
            returnamount += Number(ethers.utils.formatEther(details.tokenAmount));
        }

    }

    return returnamount;
}

export const TransformIntrestRateModel = (IRM) => {
    return {
        OPTIMAL_UTILIZATION_RATE: IRM.OPTIMAL_UTILIZATION_RATE,
        stableRateSlope1: IRM.StableRateSlope1,
        stableRateSlope2: IRM.StableRateSlope2,
        variableRateSlope1: IRM.VariableRateSlope1,
        variableRateSlope2: IRM.VariableRateSlope2,
        baseRate: IRM.BaseRate
    }

}

