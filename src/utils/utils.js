const { ethers } = require("ethers");

const bigToDecimal = (num) => num ? ethers.utils.formatEther(num) : '0';
const decimalToBig = (num) => num ? ethers.utils.parseEther(num) : ethers.utils.parseEther('0');
const bigToDecimalUints = (num, units) => num ? ethers.utils.formatEther(num, units) : '0';
const decimalToBigUnits = (num, units) => num ? ethers.utils.parseUnits(num, units) : ethers.utils.parseUnits('0', units);

const decimalToBigObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] === 'number') {
            obj[key] = decimalToBig(obj[key])
        }
    })
    return obj
}
const bigToDecimalObject = (obj) => {
    Object.keys(obj).forEach(key => {
        if (typeof obj[key] !== 'string' && typeof obj[key] !== 'boolean') {
            obj[key] = bigToDecimal(obj[key])
        }
    })
    return obj
}

export {
    bigToDecimal, decimalToBig, bigToDecimalUints, decimalToBigUnits, bigToDecimalObject, decimalToBigObject
}
