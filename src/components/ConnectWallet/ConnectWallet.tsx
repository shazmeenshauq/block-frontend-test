import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import Button from '../Button'
import useIsMetamaskInstalled from '../../hooks/useIsMetamaskInstalled'
import toast from 'react-hot-toast';

const ConnectWallet = () => {
    const { isMetamaskInstalled } = useIsMetamaskInstalled();
    const { isConnected, isConnecting } = useAccount()
    const { disconnect } = useDisconnect()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })

    const handleClick = () => {
        if (!isMetamaskInstalled()) {
            toast.error("Please install Metamask in your browser.", { position: 'top-right' });
            return 0;
        }
        if (isConnected) disconnect();
        else {
            connect()
        }
    }

    return (
        <>
            <Button onClick={handleClick}>{isConnected ? 'Disconnect' : isConnecting ? 'Connecting...' : 'Connect Wallet'} </Button>

        </>
    )
}

export default ConnectWallet