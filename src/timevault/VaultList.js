import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VaultFactoryArtifact from '../artifacts/contracts/VaultFactory.sol/VaultFactory.json';
import { Link } from 'react-router-dom';

const vaultFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function VaultList() {
  const [vaults, setVaults] = useState([]);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    async function fetchVaults() {
      const vaultFactory = new ethers.Contract(vaultFactoryAddress, VaultFactoryArtifact.abi, signer);
      const owner = await signer.getAddress();
      const vaults = await vaultFactory.getVaults(owner);
      setVaults(vaults);
    }

    fetchVaults();
  }, []);

  return (
    <div>
      <h2>Meus Cofres</h2>
      <ul>
        {vaults.map((vault, index) => (
          <li key={index}>
            <Link to={`/vault/${vault}`}>Cofre {index + 1}</Link>
          </li>
        ))}
      </ul>
      <Link to="/create">Criar Novo Cofre</Link>
    </div>
  );
}

export default VaultList;