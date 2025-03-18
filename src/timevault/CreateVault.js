import React, { useState } from 'react';
import { ethers } from 'ethers';
import VaultFactoryArtifact from '../artifacts/contracts/VaultFactory.sol/VaultFactory.json';
import TimeVaultArtifact from '../artifacts/contracts/TimeVault.sol/TimeVault.json';

const vaultFactoryAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

function CreateVault() {
  const [tokenAddress, setTokenAddress] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [targetWallet, setTargetWallet] = useState('');
  const [alternativeWallet, setAlternativeWallet] = useState('');

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  async function createVault() {
    const vaultFactory = new ethers.Contract(vaultFactoryAddress, VaultFactoryArtifact.abi, signer);

    const unlockTimestamp = Math.floor(new Date(unlockTime).getTime() / 1000);

    const tx = await vaultFactory.createVault(
      tokenAddress,
      unlockTimestamp,
      ethers.utils.parseEther(goalAmount),
      targetWallet,
      alternativeWallet
    );

    await tx.wait();
    alert('Cofre criado com sucesso!');
  }

  return (
    <div>
      <h2>Criar Novo Cofre</h2>
      <input type="text" placeholder="Endereço do Token" onChange={(e) => setTokenAddress(e.target.value)} />
      <input type="datetime-local" onChange={(e) => setUnlockTime(e.target.value)} />
      <input type="text" placeholder="Meta de Valor (em ETH)" onChange={(e) => setGoalAmount(e.target.value)} />
      <input type="text" placeholder="Carteira Alvo" onChange={(e) => setTargetWallet(e.target.value)} />
      <input type="text" placeholder="Carteira Alternativa" onChange={(e) => setAlternativeWallet(e.target.value)} />
      <button onClick={createVault}>Criar Cofre</button>
    </div>
  );
}

export default CreateVault;