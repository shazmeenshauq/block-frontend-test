import React from 'react';
import { useAccount, useConnect, useEnsName } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'


function App() {
  const { address, isConnected } = useAccount()
  const { data: ensName } = useEnsName({ address })
  const { connect } = useConnect({
    connector: new InjectedConnector(),
  })
  return (
    <div className="App">
      <p>{address}</p>
      <button onClick={() => connect()}>COnnect</button>
    </div>
  );
}

export default App;
