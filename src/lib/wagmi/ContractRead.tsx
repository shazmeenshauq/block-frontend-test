import { Address, useContractRead } from 'wagmi'
import dummyAbi from '../../abi/dummyAbi.json'
export type readContractProps = {
  id?: number
}

interface ContractReadProps {
  projId: number
}

export const useReadContractFunc = ({ projId }: ContractReadProps) => {
  const { data: contract } = useContractRead({
    address: '0x123' as Address, // dummy contract address
    chainId: 5, // goerli testnet chainId
    abi: dummyAbi,
    functionName: 'getIds',
    args: [projId],
  })

  return contract as readContractProps
}
