import React, { useState } from "react";
import { ethers } from "ethers";
import VaultFactory from "../artifacts/contracts/VaultFactory.sol/VaultFactory.json";
import { factoryAddress } from "../App";

const CreateVault = ({ provider, signer }) => {
  const [unlockTime, setUnlockTime] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [targetWallet, setTargetWallet] = useState("");
  const [alternativeWallet, setAlternativeWallet] = useState("");

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

  return (
    <div className="container d-flex justify-content-center align-items-center">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%", height: "350px" }}>
        <h2 className="text-center mb-3">Criar Novo Vault</h2>
        <div className="d-flex flex-column gap-3">

          <div>
            <input
              type="datetime-local"
              className={`form-control ${errors.unlockTime ? "is-invalid" : ""}`}
              value={unlockTime}
              onChange={(e) => setUnlockTime(e.target.value)}
            />
            {errors.unlockTime && <div className="invalid-feedback">{errors.unlockTime}</div>}
          </div>

          <div>
            <input
              type="text"
              className={`form-control ${errors.goalAmount ? "is-invalid" : ""}`}
              placeholder="Quantidade Alvo"
              value={goalAmount}
              onChange={(e) => setGoalAmount(e.target.value)}
            />
            {errors.goalAmount && <div className="invalid-feedback">{errors.goalAmount}</div>}
          </div>

          <div>
            <input
              type="text"
              className={`form-control ${errors.targetWallet ? "is-invalid" : ""}`}
              placeholder="Carteira Alvo"
              value={targetWallet}
              onChange={(e) => setTargetWallet(e.target.value)}
            />
            {errors.targetWallet && <div className="invalid-feedback">{errors.targetWallet}</div>}
          </div>

          <div>
            <input
              type="text"
              className={`form-control ${errors.alternativeWallet ? "is-invalid" : ""}`}
              placeholder="Carteira Alternativa"
              value={alternativeWallet}
              onChange={(e) => setAlternativeWallet(e.target.value)}
            />
            {errors.alternativeWallet && <div className="invalid-feedback">{errors.alternativeWallet}</div>}
          </div>

          <button className="btn btn-primary w-100" onClick={createVault}>Criar Vault</button>
        </div>
      </div>
    </div>
  );
};

export default CreateVault;
