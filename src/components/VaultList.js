import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VaultFactory from '../artifacts/contracts/VaultFactory.sol/VaultFactory.json';
import { factoryAddress } from '../App';

const VaultList = ({ provider, signer, account }) => {
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, provider);
        const userVaults = await factory.getVaults(account);
        setVaults(userVaults);
      } catch (error) {
        console.error('Erro ao buscar vaults:', error);
      }
    };

    if (provider && account) {
      fetchVaults();
    }
  }, [account, provider, signer]);

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "500px", width: "100%" }}>
        <h2 className="text-center mb-3">Meus Vaults</h2>
        {vaults.length > 0 ? (
          <ul className="list-group list-group-flush overflow-auto" style={{ maxHeight: "300px" }}>
            {vaults.map((vault, index) => (
              <li key={index} className="list-group-item">
                <strong>Endereço:</strong> {vault.vaultAddress} <br />
                <strong>Dono:</strong> {`${vault.owner.slice(0, 8)}...${vault.owner.slice(-6)}`} <br />
                <strong>Desbloqueio:</strong> {new Date(vault.unlockTime * 1000).toLocaleString()} <br />
                <strong>Meta:</strong> {ethers.utils.formatEther(vault.goalAmount)} ETH <br />
                <strong>Carteira Alvo:</strong> {`${vault.targetWallet.slice(0, 8)}...${vault.targetWallet.slice(-6)}`} <br />
                <strong>Carteira Alternativa:</strong> {`${vault.alternativeWallet.slice(0, 8)}...${vault.alternativeWallet.slice(-6)}`}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">Nenhum vault encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default VaultList;