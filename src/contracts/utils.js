const { ethers } = require("ethers");

const bigToDecimal=(num)=> ethers.utils.formatEther(num);
const decimalToBig=(num)=> ethers.utils.parseEther(num);
const bigToDecimalUints=(num,units)=> ethers.utils.formatEther(num,units);
const decimalToBigUints=(num,units)=> ethers.utils.parseUnits(num,units);

export {
bigToDecimal,decimalToBig,bigToDecimalUints,decimalToBigUints
}