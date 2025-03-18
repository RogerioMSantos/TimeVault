import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import VaultFactory from '../artifacts/contracts/VaultFactory.sol/VaultFactory.json';
import { factoryAddress } from '../App';

const VaultList = ({ provider, signer, account }) => {
  const [vaults, setVaults] = useState([]);

  useEffect(() => {
    const fetchVaults = async () => {
      const factory = new ethers.Contract(factoryAddress, VaultFactory.abi, provider);
      const userVaults = await factory.getVaults(account);
      setVaults(userVaults);
    };

    fetchVaults();
  }, [account, provider]);

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card p-4 shadow-lg" style={{ maxWidth: "400px", width: "100%" }}>
        <h2 className="text-center mb-3">Meus Vaults</h2>
        {vaults.length > 0 ? (
          <ul className="list-group list-group-flush overflow-auto" style={{ maxHeight: "300px" }}>
            {vaults.map((vault, index) => (
              <li key={index} className="list-group-item">{vault}</li>
            ))}
          </ul>
        ) : (
          <p className="text-muted text-center">Nenhum vault encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default VaultList;