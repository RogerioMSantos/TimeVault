import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import CreateVault from './components/CreateVault';
import VaultList from './components/VaultList';
import VaultDetails from './components/VaultDetails';
import './App.css';

export const factoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState('');
  const [accountName, setAccountName] = useState('');
  const [selectedVault, setSelectedVault] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!window.ethereum) {
        alert('Por favor, instale o MetaMask ou use um navegador compatível com Ethereum.');
        return;
      }

      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        console.error('Usuário negou a permissão para acessar a carteira.');
        return;
      }

      const web3Provider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(web3Provider);
      const signer = web3Provider.getSigner();
      setSigner(signer);

      const accounts = await web3Provider.listAccounts();
      setAccount(accounts[0]);

      try {
        const ensName = await web3Provider.lookupAddress(accounts[0]);
        setAccountName(ensName || 'Usuário');
      } catch (error) {
        console.error('Erro ao resolver nome ENS:', error);
        setAccountName('Usuário');
      }

      // Listener para mudança de conta
      window.ethereum.on('accountsChanged', (newAccounts) => {
        setAccount(newAccounts[0] || '');
        setAccountName('Usuário');
      });

      // Listener para mudança de rede
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    };

    init();

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', () => { });
        window.ethereum.removeListener('chainChanged', () => { });
      }
    };
  }, []);

  return (
    <div className="container mt-4">
      {/* Informações da carteira */}
      <div className="card p-3 mb-4 shadow-sm">
        <h5 className="text-center">Carteira Conectada</h5>
        <p className="text-center mb-1">
          <strong>Nome:</strong> {accountName}
        </p>
        <p className="text-center">
          <strong>Endereço:</strong> {account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Desconectado'}
        </p>
      </div>

      <div className="d-flex flex-wrap gap-4">
        {/* Criar Vault */}
        <div className="flex-grow-1">
          <CreateVault provider={provider} signer={signer} />
        </div>

        {/* Lista de Vaults */}
        <div className="flex-grow-1">
          <VaultList provider={provider} signer={signer} account={account} onSelectVault={setSelectedVault} />
        </div>

        {/* Detalhes do Vault (se selecionado) */}
        {selectedVault && (
          <div className="flex-grow-1">
            <VaultDetails provider={provider} signer={signer} vaultAddress={selectedVault} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
