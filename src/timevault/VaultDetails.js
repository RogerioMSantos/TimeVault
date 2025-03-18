import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TimeVaultArtifact from '../artifacts/contracts/TimeVault.sol/TimeVault.json';
import { useParams } from 'react-router-dom';

function VaultDetails() {
  const { id } = useParams();
  const [vault, setVault] = useState(null);

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  useEffect(() => {
    async function fetchVaultDetails() {
      const vaultContract = new ethers.Contract(id, TimeVaultArtifact.abi, signer);
      const owner = await vaultContract.owner();
      const unlockTime = await vaultContract.unlockTime();
      const goalAmount = await vaultContract.goalAmount();
      const totalDeposited = await vaultContract.totalDeposited();

      setVault({
        owner,
        unlockTime: new Date(unlockTime * 1000).toLocaleString(),
        goalAmount: ethers.utils.formatEther(goalAmount),
        totalDeposited: ethers.utils.formatEther(totalDeposited),
      });
    }

    fetchVaultDetails();
  }, [id]);

  if (!vault) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Detalhes do Cofre</h2>
      <p>Proprietário: {vault.owner}</p>
      <p>Tempo de Desbloqueio: {vault.unlockTime}</p>
      <p>Meta de Valor: {vault.goalAmount} ETH</p>
      <p>Total Depositado: {vault.totalDeposited} ETH</p>
    </div>
  );
}

export default VaultDetails;