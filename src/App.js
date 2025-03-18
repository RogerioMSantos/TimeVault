import { useState, useEffect } from "react";
import { ethers } from "ethers";
import VaultFactoryABI from "./artifacts/contracts/VaultFactory.sol/VaultFactory.json";
import TimeVaultABI from "./artifacts/contracts/TimeVault.sol/TimeVault.json";

const VAULT_FACTORY_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

export default function Home() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [vaultFactory, setVaultFactory] = useState(null);
  const [vaults, setVaults] = useState([]);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    if (typeof window.ethereum !== "undefined") {
      const _provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(_provider);
      setVaultFactory(new ethers.Contract(VAULT_FACTORY_ADDRESS, VaultFactoryABI.abi, _provider));
    }
  }, []);

  async function connectWallet() {
    const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
    setAccount(accounts[0]);
    setSigner(provider.getSigner());
  }

  async function fetchVaults() {
    if (!vaultFactory || !account) return;
    const userVaults = await vaultFactory.getVaults(account);
    setVaults(userVaults);
  }

  async function createVault(token, unlockTime, goalAmount, targetWallet, alternativeWallet) {
    if (!signer) return;
    const contractWithSigner = vaultFactory.connect(signer);
    await contractWithSigner.createVault(token, unlockTime, goalAmount, targetWallet, alternativeWallet);
  }

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="p-5 bg-light border rounded d-flex flex-column justify-content-center align-items-center">
        <h1 className="text-2xl font-bold">Time Vault</h1>
        {!account ? (
          <button onClick={connectWallet} className="mt-3 p-2 bg-blue-500 text-white btn btn-warning">Conectar Carteira</button>
        ) : (
          <div>
            <p>Conectado: <b>{account}</b></p>
            <button onClick={fetchVaults} className="mt-3 p-2 bg-green-500 text-white btn btn-primary">Listar Cofres</button>
            <ul>
              {vaults.map((vault, index) => (
                <li key={index}>{vault}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}


// import './App.css';
// import { ethers } from 'ethers'
// import { useState } from 'react';
// import TokenArtifact from "./artifacts/contracts/KevinToken.sol/KevinToken.json"
// const tokenAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3"

// const localBlockchainAddress = 'http://localhost:8545'

// function App() {
//     const [tokenData, setTokenData] = useState({})
//     const [amount, setAmount] = useState()

//     const provider = new ethers.providers.JsonRpcProvider(localBlockchainAddress)
//     const signer = provider.getSigner();

//     async function _intializeContract(init) {
//         const contract = new ethers.Contract(
//             tokenAddress,
//             TokenArtifact.abi,
//             init
//         );

//         return contract
//     }

//     async function _getTokenData() {
//         const contract = await _intializeContract(signer)

//         const name = await contract.name();
//         const symbol = await contract.symbol();
//         const tokenData = { name, symbol }

//         setTokenData(tokenData);
//     }

//     async function getBalance() {
//         if (typeof window.ethereum !== 'undefined') {
//             const contract = await _intializeContract(signer)
//             const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' })
//             const balance = await contract.balanceOf(account);
//             console.log("Account Balance: ", balance.toString());
//         }
//     }

//     async function issueToken() {
//         const contract = await _intializeContract(signer)
//         await contract.functions.issueToken(amount)
//         console.log('Issue token successfull')
//     }

//     return (
//         <div className="App">
//             <header className="App-header">
//                 <button onClick={issueToken}>issueToken</button>
//                 <br />
//                 <input onChange={e => setAmount(e.target.value)} placeholder="Amount" />
//                 <br />
//                 <button onClick={_getTokenData}>get token data</button>
//                 <br />
//                 <button onClick={getBalance}>Get Balance</button>
//                 <br />
//                 <h1>{tokenData.name}</h1>
//                 <h1>{tokenData.symbol}</h1>
//             </header>
//         </div>
//     );
// }

// export default App;


