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
          description: await vaultContract.description(),
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

      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, provider);

      // Escutando eventos
      const handleDeposit = (sender, amount) => {
        // console.log(`Depósito detectado: ${amount.toString()} wei de ${sender}`);
        fetchVaultDetails(); // Atualiza os dados do vault
      };

      const handleGoalStatusUpdated = (status) => {
        // console.log(`Status da meta atualizado: ${status}`);
        fetchVaultDetails(); // Atualiza os dados do vault
      };

      vaultContract.on("Deposited", handleDeposit);
      vaultContract.on("GoalStatusUpdated", handleGoalStatusUpdated);

      return () => {
        vaultContract.off("Deposited", handleDeposit);
        vaultContract.off("GoalStatusUpdated", handleGoalStatusUpdated);
      };
    }
  }, [vaultAddress, provider]);

  const deposit = async () => {
    try {
      const vaultContract = new ethers.Contract(vaultAddress, TimeVault.abi, signer);
      const tx = await vaultContract.deposit({
        value: ethers.utils.parseUnits(amount, "ether"),
      });
      await tx.wait();
      alert("Depósito realizado com sucesso!");
    } catch (error) {
      console.error("Erro ao depositar:", error);

      let errorMessage = "Erro desconhecido ao tentar depositar.";

      if (error?.data?.message) {
        const match = error.data.message.match(/'(.+?)'/);
        errorMessage = match ? match[1] : error.data.message;
      } else if (error?.message) {
        const match = error.message.match(/'(.+?)'/);
        errorMessage = match ? match[1] : error.message;
      }

      alert(`Erro ao depositar: ${errorMessage}`);
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

      let errorMessage = "Erro desconhecido ao tentar sacar.";

      if (error?.data?.message) {
        const match = error.data.message.match(/'(.+?)'/);
        errorMessage = match ? match[1] : error.data.message;
      } else if (error?.message) {
        const match = error.message.match(/'(.+?)'/);
        errorMessage = match ? match[1] : error.message;
      }

      alert(`Erro ao sacar: ${errorMessage}`);
    }
  };

  if (!vault) return <div className="text-center mt-4">Carregando detalhes do vault...</div>;

  return (
    <div className="container mb-4" style={{ maxWidth: "500px" }}>
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
