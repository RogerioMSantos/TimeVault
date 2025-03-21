import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import TimeVault from "../artifacts/contracts/TimeVault.sol/TimeVault.json";

const VaultDetails = ({ provider, signer, vaultAddress }) => {
  const [vault, setVault] = useState(null);
  const [amount, setAmount] = useState("");
  const [isValidAmount, setIsValidAmount] = useState(true);

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
          description: await vaultContract.description(),
          goalMet: await vaultContract.goalMet(),
          totalDeposited: await vaultContract.totalDeposited(),
          isWithdrawn: await vaultContract.isWithdrawn(),
        };
        setVault(details);
      } catch (error) {
        console.error("Erro ao buscar detalhes do vault:", error);
      }
    };

    if (vaultAddress && provider) {
      fetchVaultDetails();

      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, provider);

      const handleDeposit = () => fetchVaultDetails();
      const handleGoalStatusUpdated = () => fetchVaultDetails();
      const handleWithdraw = () => {
        fetchVaultDetails();
      };

      vaultContract.on("Deposited", handleDeposit);
      vaultContract.on("GoalStatusUpdated", handleGoalStatusUpdated);
      vaultContract.on("Withdrawn", handleWithdraw);

      return () => {
        vaultContract.off("Deposited", handleDeposit);
        vaultContract.off("GoalStatusUpdated", handleGoalStatusUpdated);
        vaultContract.off("Withdrawn", handleWithdraw);
      };
    }
  }, [vaultAddress, provider]);

  const validateAmount = (value) => {
    const isValid = !isNaN(value) && parseFloat(value) > 0;
    setIsValidAmount(isValid);
  };

  const handleAmountChange = (e) => {
    const value = e.target.value;
    setAmount(value);
    validateAmount(value);
  };

  const deposit = async () => {
    if (!isValidAmount) return;

    try {
      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
      const tx = await vaultContract.deposit({
        value: ethers.utils.parseUnits(amount, "ether"),
      });
      await tx.wait();
      alert("Depósito realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao depositar:", error);
      alert("Erro ao depositar: " + (error.data?.message || "Erro desconhecido"));
    }
  };

  const withdraw = async () => {
    try {
      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
      const tx = await vaultContract.withdraw();
      await tx.wait();
      alert("Saque realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao sacar:", error);
      alert("Erro ao sacar: " + (error.data?.message || "Erro desconhecido"));
    }
  };

  if (!vault) return <div className="text-center mt-4">Carregando detalhes do vault...</div>;

  return (
    <div className="container mb-4" style={{ maxWidth: "500px" }}>
      <div className="card shadow-lg">
        <div className={`card-header text-center ${vault.isWithdrawn ? "bg-danger" : "bg-success"} text-white`}>
          <h4>{vault.isWithdrawn ? "Vault Indisponível - Saque Realizado" : "Vault Habilitado"}</h4>
        </div>
        <div className="card-body">
          <ul className="list-group list-group-flush">
            <li className="list-group-item"><strong>Endereço do Vault:</strong> {vaultAddress}</li>
            <li className="list-group-item"><strong>Proprietário:</strong> {vault.owner}</li>
            <li className="list-group-item"><strong>Tempo de Desbloqueio:</strong> {new Date(vault.unlockTime * 1000).toLocaleString()}</li>
            <li className="list-group-item"><strong>Quantidade Alvo:</strong> {ethers.utils.formatUnits(vault.goalAmount, 18)} ETH</li>
            <li className="list-group-item"><strong>Descrição:</strong> {vault.description}</li>
            <li className="list-group-item"><strong>Carteira Alvo:</strong> {vault.targetWallet}</li>
            <li className="list-group-item"><strong>Carteira Alternativa:</strong> {vault.alternativeWallet}</li>
            <li className="list-group-item"><strong>Meta Alcançada:</strong> {vault.goalMet ? "Sim ✅" : "Não ❌"}</li>
            <li className="list-group-item"><strong>Total Depositado:</strong> {ethers.utils.formatUnits(vault.totalDeposited, 18)} ETH</li>
          </ul>

          <div className="mt-4">
            <div className="input-group">
              <input
                type="text"
                className={`form-control ${isValidAmount ? "" : "is-invalid"}`}
                placeholder="Quantidade a depositar"
                value={amount}
                disabled={vault.isWithdrawn}
                onChange={handleAmountChange}
              />
              <button className="btn btn-primary" onClick={deposit} disabled={vault.isWithdrawn || !isValidAmount}>Depositar</button>
              <div className="invalid-feedback">Por favor, insira um valor válido maior que zero.</div>
            </div>
            <button className="btn btn-danger mt-3 w-100" onClick={withdraw} disabled={vault.isWithdrawn}>Sacar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VaultDetails;
