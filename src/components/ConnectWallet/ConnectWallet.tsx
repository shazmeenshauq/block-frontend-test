import React from 'react'
import { useAccount, useConnect, useDisconnect, useNetwork, useSwitchNetwork } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Button from '../Button'

const ConnectWallet = () => {
    const acceptedChain: number = 5
    const { isConnected, isConnecting } = useAccount()

    const { chain } = useNetwork()
    const { error, switchNetwork } =
        useSwitchNetwork()
    const { disconnect } = useDisconnect()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    const handleClick = async () => {
        if (isConnected) disconnect();
        else {
            await connect()
            if (chain?.id !== acceptedChain) switchNetwork?.(acceptedChain)
        }
    }
    return (
        <Button onClick={handleClick}>{isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect Wallet'} </Button>
    )
}

export default ConnectWallet