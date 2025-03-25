// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import "./TimeVault.sol";

contract VaultFactory {
    event VaultCreated(address indexed owner, Vault vaultAddress);

    mapping(address => Vault[]) private vaults;

    struct Vault {
        address owner;
        uint256 unlockTime;
        uint256 goalAmount;
        address targetWallet;
        address alternativeWallet;
        address vaultAddress;
        string description;
    }

    function createVault(
        uint256 unlockTime,
        uint256 goalAmount,
        address targetWallet,
        address alternativeWallet,
        string memory description
    ) external {
        TimeVault newVault = new TimeVault(
            msg.sender,
            unlockTime,
            goalAmount,
            targetWallet,
            alternativeWallet,
            description
        );

        Vault memory vault = Vault({
            vaultAddress: address(newVault),
            owner: msg.sender,
            unlockTime: unlockTime,
            goalAmount: goalAmount,
            targetWallet: targetWallet,
            alternativeWallet: alternativeWallet,
            description: description
        });

        vaults[msg.sender].push(vault);
        emit VaultCreated(msg.sender, vault);
    }

    function getVaults(address owner) external view returns (Vault[] memory) {
        return vaults[owner];
    }
}
