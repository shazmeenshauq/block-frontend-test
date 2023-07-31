

const useIsMetamaskInstalled = () => {
    const isMetamaskInstalled = () => {
        if (window?.ethereum?.isMetaMask) {
            return true
          } else {
            return false
          }

    }
    return {isMetamaskInstalled}

}
export default useIsMetamaskInstalled