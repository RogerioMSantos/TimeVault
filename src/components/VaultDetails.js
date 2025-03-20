import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TimeVault from "../artifacts/contracts/TimeVault.sol/TimeVault.json";

const VaultDetails = ({ provider, signer, vaultAddress }) => {
  const [vault, setVault] = useState(null);
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const fetchVaultDetails = async () => {
      try {
        const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, provider);
        const details = {
          owner: await vaultContract.owner(),
          unlockTime: await vaultContract.unlockTime(),
          goalAmount: await vaultContract.goalAmount(),
          targetWallet: await vaultContract.targetWallet(),
          alternativeWallet: await vaultContract.alternativeWallet(),
          goalMet: await vaultContract.goalMet(),
          totalDeposited: await vaultContract.totalDeposited(),
        };
        setVault(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes do vault:", error);
      }
    };

    if (vaultAddress && provider) {
      fetchVaultDetails();
    }
  }, [vaultAddress, provider]);

  const deposit = async () => {
    const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
    const tx = await vaultContract.deposit(ethers.utils.parseUnits(amount, 18));
    await tx.wait();
    alert("Depósito realizado com sucesso!");
  };

  const withdraw = async () => {
    const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
    const tx = await vaultContract.withdraw();
    await tx.wait();
    alert("Saque realizado com sucesso!");
  };

  if (!vault) return <div className="text-center mt-4">Carregando detalhes do vault...</div>;

  return (
    <div className="container mt-4 mb-4">
      <div className="card shadow-lg">
        <div className="card-header bg-success text-white text-center">
          <h4>Detalhes do Vault</h4>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Endereço do Vault:</strong> {vaultAddress}</li>
            <li className="list-group-item"><strong>Proprietário:</strong> {vault.owner}</li>
            <li className="list-group-item"><strong>Tempo de Desbloqueio:</strong> {new Date(vault.unlockTime * 1000).toLocaleString()}</li>
            <li className="list-group-item"><strong>Quantidade Alvo:</strong> {ethers.utils.formatUnits(vault.goalAmount, 18)} ETH</li>
            <li className="list-group-item"><strong>Carteira Alvo:</strong> {vault.targetWallet}</li>
            <li className="list-group-item"><strong>Carteira Alternativa:</strong> {vault.alternativeWallet}</li>
            <li className="list-group-item"><strong>Meta Alcançada:</strong> {vault.goalMet ? "Sim ✅" : "Não ❌"}</li>
            <li className="list-group-item"><strong>Total Depositado:</strong> {ethers.utils.formatUnits(vault.totalDeposited, 18)} ETH</li>
          </ul>

          <div className="mt-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Quantidade a depositar"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
              <button className="btn btn-primary" onClick={deposit}>Depositar</button>
            </div>
            <button className="btn btn-danger mt-3 w-100" onClick={withdraw}>Sacar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetails;
