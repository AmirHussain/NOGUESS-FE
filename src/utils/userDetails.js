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
        for(var i=0;i<ids.length;i++){
            const details = await lendingContract.getLenderAsset(ids[i]);
            returnamount += Number(ethers.utils.formatEther(details.tokenAmount));
        }
          
    }

    return returnamount;
}

