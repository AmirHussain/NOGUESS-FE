const { ethers } = require("ethers");

const bigToDecimal = (num) => {
    try {
        return ethers.utils.formatEther(num)
    } catch (err) {
        return 0;
    }
};
const decimalToBig = (num) => { return ethers.utils.parseEther(num) };
const bigToDecimalUints = (num, units) => {
    try {
        return ethers.utils.formatEther(num, units)
    } catch (err) {
        return 0;
    }
};
const decimalToBigUints = (num, units) => {

    return ethers.utils.parseEther(num, units)


};

export {
    bigToDecimal, decimalToBig, bigToDecimalUints, decimalToBigUints
}