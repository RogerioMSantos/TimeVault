import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TimeVault from '../artifacts/contracts/TimeVault.sol/TimeVault.json'

const VaultDetails = ({ provider, signer, vaultAddress }) => {
  const [vault, setVault] = useState(null);
  const [amount, setAmount] = useState('');

  useEffect(() => {
    const fetchVaultDetails = async () => {
      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, provider);
      const details = {
        owner: await vaultContract.owner(),
        token: await vaultContract.token(),
        unlockTime: await vaultContract.unlockTime(),
        goalAmount: await vaultContract.goalAmount(),
        targetWallet: await vaultContract.targetWallet(),
        alternativeWallet: await vaultContract.alternativeWallet(),
        goalMet: await vaultContract.goalMet(),
        totalDeposited: await vaultContract.totalDeposited(),
      };
      setVault(details);
    };

    fetchVaultDetails();
  }, [vaultAddress, provider]);

  const deposit = async () => {
    const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
    const tx = await vaultContract.deposit(ethers.utils.parseUnits(amount, 18));
    await tx.wait();
    alert('Depósito realizado com sucesso!');
  };

  const withdraw = async () => {
    const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
    const tx = await vaultContract.withdraw();
    await tx.wait();
    alert('Saque realizado com sucesso!');
  };

  if (!vault) return <div>Carregando...</div>;

  return (
    <div>
      <h2>Detalhes do Vault</h2>
      <p>Proprietário: {vault.owner}</p>
      <p>Token: {vault.token}</p>
      <p>Tempo de Desbloqueio: {new Date(vault.unlockTime * 1000).toLocaleString()}</p>
      <p>Quantidade Alvo: {ethers.utils.formatUnits(vault.goalAmount, 18)}</p>
      <p>Carteira Alvo: {vault.targetWallet}</p>
      <p>Carteira Alternativa: {vault.alternativeWallet}</p>
      <p>Meta Alcançada: {vault.goalMet ? 'Sim' : 'Não'}</p>
      <p>Total Depositado: {ethers.utils.formatUnits(vault.totalDeposited, 18)}</p>

      <input type="text" placeholder="Quantidade" value={amount} onChange={(e) => setAmount(e.target.value)} />
      <button onClick={deposit}>Depositar</button>
      <button onClick={withdraw}>Sacar</button>
    </div>
  );
};

export default VaultDetails;