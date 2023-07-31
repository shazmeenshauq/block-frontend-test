import { useState, useEffect } from 'react'
import Button from '../components/Button/Button'
import styled from 'styled-components'
import { useAccount, useBalance, useNetwork, useSwitchNetwork, useWaitForTransaction } from 'wagmi'
import { usePrepareSendTransaction, useSendTransaction } from 'wagmi'
import { parseEther } from 'ethers'
import toast from 'react-hot-toast';
import ConnectWallet from '../components/ConnectWallet/ConnectWallet'
import { revertReason } from '../utils/revertReason'
import { parseGwei } from 'viem'

const Home = () => {
    const acceptedChainId = 5 // chainId for Goerli
    const [receipientAddress, setReceipientAddress] = useState('')
    const [amount, setAmount] = useState(0)
    const { address, isConnected, isDisconnected } = useAccount()
    const { chain } = useNetwork()
    const { switchNetwork } = useSwitchNetwork()
    const { data, isError: fetchBalanceError, isLoading: balanceLoading, } = useBalance({
        address,
    })
    const { config } = usePrepareSendTransaction({
        to: receipientAddress,
        value: parseEther(amount.toString()),
        gasPrice: parseGwei('20'), // custom gas price

    })
    const { data: transactionHash, sendTransaction, error: sendtransactionError } = useSendTransaction(config)

    const { isLoading: sendingTransaction, isSuccess: transactionSuccess } = useWaitForTransaction({
        hash: transactionHash?.hash,
    })
    const handleSubmit = async () => {
        if (chain?.id !== 5) {
            switchNetwork?.(acceptedChainId)
        } else if (data && parseFloat(data?.formatted) < amount) { toast.error("Amount exceeds the available balance.") }
        else sendTransaction?.()
    }

    useEffect(() => {
        if (sendtransactionError) toast.error(revertReason(sendtransactionError.cause))
    }, [sendtransactionError])

    useEffect(() => {
        if (chain && chain?.id !== 5) {
            toast.error(chain?.name + 'is not supported')
            switchNetwork?.(5)
        }
    }, [chain, switchNetwork, address])

    return (
        <Box>
            <div>
                {chain && <div>Connected to {chain?.name}</div>}
                {
                    isConnected && <>
                        <h4>  Wallet address: {address}</h4>
                        <h4>Balance: {balanceLoading ? 'Fetching balance...' : fetchBalanceError ? 'Something went wrong' : <> {data?.formatted}   {data?.symbol}</>} </h4>
                    </>
                }
                {
                    transactionSuccess &&
                    <p onClick={() => window.open(`https://goerli.etherscan.io/tx/${transactionHash?.hash}`)}>View transaction on <br />
                        https://goerli.etherscan.io/tx/{transactionHash?.hash}
                    </p>
                }
            </div>
            <Flex>
                {isDisconnected && <ConnectWallet />}
                {
                    isConnected &&
                    <>
                        <input type="text" placeholder='Enter Wallet Address' value={receipientAddress} onChange={(e) => setReceipientAddress(e.target.value)} />
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