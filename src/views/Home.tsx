import { useState, useEffect } from 'react'
import Button from '../components/Button/Button'
import styled from 'styled-components'
import { useAccount, useBalance, useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import { parseEther } from 'ethers'
import toast from 'react-hot-toast';
import ConnectWallet from '../components/ConnectWallet/ConnectWallet'
const Home = () => {
    const acceptedChainId = 5 // chainId for Goerli
    const [toAddress, setToAddress] = useState('')
    const [amount, setAmount] = useState(0)
    const { address, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { error: switchNetworkError, switchNetwork } = useSwitchNetwork()
    const { data, isError: fetchBalanceError, isLoading: balanceLoading } = useBalance({
        address
    })
    const { config } = usePrepareSendTransaction({
        to: toAddress,
        value: parseEther(amount.toString()),

    })
    const { data: transactionHash, sendTransaction, error: sendtransactionError } = useSendTransaction(config)

    const { isLoading: sendingTransaction, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: transactionHash?.hash,
    })
    const handleSubmit = async () => {
        if (chain?.id !== 5) {
            switchNetwork?.(acceptedChainId)
        }
        else sendTransaction?.()
    }
    useEffect(() => {
        if (sendtransactionError) toast.error(sendtransactionError.message)
    }, [sendtransactionError])
    return (
        <Box>
            <div>
                {chain && <div>Connected to {chain?.name}</div>}
                {
                    isConnected && <>
                        <h4>  Wallet address: {address}</h4>
                        <h4>Balance: {balanceLoading ? 'Fetching balance...' : fetchBalanceError ? 'Something went wrong' : <> {data?.formatted} {data?.symbol}</>} </h4>
                    </>
                }
                {
                    transactionSuccess && transactionHash?.hash
                }
            </div>
            <Flex>
                {
                    isDisconnected && <ConnectWallet />
                }

                {
                    isConnected &&
                    <>
                        <input type="text" placeholder='Enter Wallet Address' value={toAddress} onChange={(e) => setToAddress(e.target.value)} />
                        <input type="number" placeholder='Enter amount' value={amount} onChange={(e) => setAmount(parseFloat(e.target.value))} />
                        <Button onClick={handleSubmit}>{sendingTransaction ? 'Please wait...' : 'Send'} </Button>

                    </>
                }
            </Flex>

        </Box>
    )
}


const Box = styled.div`
display:flex;
align-items: center;
justify-content: center;
gap:50px;
min-height:100vh;
`

const Flex = styled.div`
display:flex;
flex-direction: column;
gap:10px;

`

export default Home