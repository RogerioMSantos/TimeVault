import React, { useState } from 'react';
import { ethers } from 'ethers';
import VaultFactory from '../artifacts/contracts/VaultFactory.sol/VaultFactory.json';
import { factoryAddress } from '../App';

const CreateVault = ({ provider, signer }) => {
  const [token, setToken] = useState('');
  const [unlockTime, setUnlockTime] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [targetWallet, setTargetWallet] = useState('');
  const [alternativeWallet, setAlternativeWallet] = useState('');

  const createVault = async () => {
    const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, signer);

    const tx = await factory.createVault(
      token,
      Math.floor(new Date(unlockTime).getTime() / 1000), // Converte para timestamp Unix
      ethers.utils.parseUnits(goalAmount, 18), // Assumindo que o token tem 18 decimais
      targetWallet,
      alternativeWallet
    );
    await tx.wait();
    alert('Vault criado com sucesso!');
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Criar Novo Vault</h2>
        <div className="d-flex flex-column gap-3">
          <input type="text" className="form-control" placeholder="Endereço do Token" 
            value={token} onChange={(e) => setToken(e.target.value)} />
          
          <input type="datetime-local" className="form-control" placeholder="Tempo de Desbloqueio" 
            value={unlockTime} onChange={(e) => setUnlockTime(e.target.value)} />
          
          <input type="text" className="form-control" placeholder="Quantidade Alvo" 
            value={goalAmount} onChange={(e) => setGoalAmount(e.target.value)} />
          
          <input type="text" className="form-control" placeholder="Carteira Alvo" 
            value={targetWallet} onChange={(e) => setTargetWallet(e.target.value)} />
          
          <input type="text" className="form-control" placeholder="Carteira Alternativa" 
            value={alternativeWallet} onChange={(e) => setAlternativeWallet(e.target.value)} />
  
          <button className="btn btn-primary w-100" onClick={createVault}>Criar Vault</button>
        </div>
      </div>
    </div>
  );
};

export default CreateVault;