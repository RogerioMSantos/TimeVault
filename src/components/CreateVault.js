import React, { useState } from "react";
import { ethers } from "ethers";
import VaultFactory from "../artifacts/contracts/VaultFactory.sol/VaultFactory.json";
import { factoryAddress } from "../App";

const CreateVault = ({ provider, signer, onSelectVault }) => {
  const [unlockTime, setUnlockTime] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [alternativeWallet, setAlternativeWallet] = useState("");
  const [vaultAddress, setVaultAddress] = useState("");

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!unlockTime)
      newErrors.unlockTime = "O tempo de desbloqueio é obrigatório.";

    if (unlockTime && new Date(unlockTime).getTime() < Date.now())
      newErrors.unlockTime = "O tempo de desbloqueio deve ser no futuro.";

    if (!goalAmount || isNaN(goalAmount) || parseFloat(goalAmount) <= 0)
      newErrors.goalAmount = "A quantidade alvo deve ser um número positivo.";

    if (!ethers.utils.isAddress(targetWallet))
      newErrors.targetWallet = "Endereço da carteira alvo inválido.";

    if (!ethers.utils.isAddress(alternativeWallet))
      newErrors.alternativeWallet = "Endereço da carteira alternativa inválido.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createVault = async () => {
    if (!validateForm()) return; // Bloqueia a execução se houver erros

    try {
      const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, signer);
      const tx = await factory.createVault(
        Math.floor(new Date(unlockTime).getTime() / 1000),
        ethers.utils.parseUnits(goalAmount, 18),
        targetWallet,
        alternativeWallet
      );

      await tx.wait();
      alert("Vault criado com sucesso!");
    } catch (error) {
      alert("Erro ao criar Vault: " + error.message);
    }
  };

  const viewVault = async () => {
    if (!ethers.utils.isAddress(vaultAddress)) {
      setErrors({ vaultAddress: "Endereço de Vault inválido." });
      return;
    }
    try {
      onSelectVault(vaultAddress);
    } catch (error) {
      alert("Erro ao buscar informações do Vault: " + error.message);
    }
  };

  return (
    <div className="container d-flex flex-column align-items-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Criar Novo Vault</h2>
        <div className="d-flex flex-column gap-3">
          <input
            type="datetime-local"
            className={`form-control ${errors.unlockTime ? "is-invalid" : ""}`}
            value={unlockTime}
            onChange={(e) => setUnlockTime(e.target.value)}
          />
          {errors.unlockTime && <div className="invalid-feedback">{errors.unlockTime}</div>}

          <input
            type="text"
            className={`form-control ${errors.goalAmount ? "is-invalid" : ""}`}
            placeholder="Quantidade Alvo"
            value={goalAmount}
            onChange={(e) => setGoalAmount(e.target.value)}
          />
          {errors.goalAmount && <div className="invalid-feedback">{errors.goalAmount}</div>}

          <input
            type="text"
            className={`form-control ${errors.targetWallet ? "is-invalid" : ""}`}
            placeholder="Carteira Alvo"
            value={targetWallet}
            onChange={(e) => setTargetWallet(e.target.value)}
          />
          {errors.targetWallet && <div className="invalid-feedback">{errors.targetWallet}</div>}

          <input
            type="text"
            className={`form-control ${errors.alternativeWallet ? "is-invalid" : ""}`}
            placeholder="Carteira Alternativa"
            value={alternativeWallet}
            onChange={(e) => setAlternativeWallet(e.target.value)}
          />
          {errors.alternativeWallet && <div className="invalid-feedback">{errors.alternativeWallet}</div>}

          <button className="btn btn-primary w-100" onClick={createVault}>Criar Vault</button>
        </div>
      </div>

      <div className="mt-4 card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Ver Vault</h2>
        <input
          type="text"
          className={`form-control ${errors.vaultAddress ? "is-invalid" : ""}`}
          placeholder="Endereço do Vault"
          value={vaultAddress}
          onChange={(e) => setVaultAddress(e.target.value)}
        />
        {errors.vaultAddress && <div className="invalid-feedback">{errors.vaultAddress}</div>}

        <button className="btn btn-secondary w-100 mt-2" onClick={viewVault}>Ver Vault</button>
      </div>
    </div>
  );
};

export default CreateVault;
