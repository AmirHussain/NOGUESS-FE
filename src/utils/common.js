export const getAPY = (apr, seconds) => {
  if (apr) {
    if (!seconds) {
      seconds = 31536000
    }

    const apy = Math.pow(1 + (apr / seconds), seconds) - 1
    return apy
  } return 0;
}

export const setStorage = (title, data) => {
  localStorage.setItem(title, data)
}
export const getStorage = (title) => {
  localStorage.getItem(title)

}
export const ProposalStatus = {
  created: 'created',
  active: 'active',  
  complete: 'complete',
  success: 'succeeded',
  rejected: 'rejected',
  queued: 'queued',
  executed: 'executed'
}