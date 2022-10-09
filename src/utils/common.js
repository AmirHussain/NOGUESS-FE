export const getAPY = (apr,seconds) => {
  if(apr){
    if (!seconds) {
        seconds = 31536000
    }

    const apy = Math.pow(1 + (apr / seconds), seconds) - 1
    return apy
  } return 0;
}