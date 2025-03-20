import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import VaultFactory from "../artifacts/contracts/VaultFactory.sol/VaultFactory.json";
import { factoryAddress } from "../App";

const VaultList = ({ provider, account, onSelectVault }) => {
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    const fetchVaults = async () => {
      try {
        const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, provider);
        const userVaults = await factory.getVaults(account);
        setVaults(userVaults);
      } catch (error) {
        console.error("Erro ao buscar vaults:", error);
      }
    };

    if (provider && account) {
      fetchVaults();

      const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, provider);
      factory.on("VaultCreated", (owner, vaultAddress) => {
        if (owner.toLowerCase() === account.toLowerCase()) {
          // console.log(`Novo Vault criado: ${vaultAddress}`);
          fetchVaults(); // Atualiza a interface ao detectar um novo vault
        }
      });

      return () => {
        factory.removeAllListeners("VaultCreated");
      };
    }
  }, [account, provider]);

  return (
    <div className="container" style={{ maxWidth: "400px" }}>
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white text-center">
          <h4>Meus Vaults</h4>
        </div>
        <div className="card-body">
          {vaults.length > 0 ? (
            <div className="list-group overflow-auto" style={{ maxHeight: "500px" }}>
              {vaults.map((vault, index) => (
                <button
                  key={index}
                  className="list-group-item list-group-item-action d-flex flex-column"
                  onClick={() => onSelectVault(vault.vaultAddress)}
                >
                  <p><strong>Meta:</strong> {ethers.utils.formatEther(vault.goalAmount)} ETH</p>
                  <p><strong>Desbloqueio:</strong> {new Date(vault.unlockTime * 1000).toLocaleString()}</p>
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted text-center">Nenhum vault encontrado.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default VaultList;
