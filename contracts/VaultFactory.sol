// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TimeVault.sol";

contract VaultFactory {
    event VaultCreated(address indexed owner, address vaultAddress);

    mapping(address => Vault[]) private vaults;

    struct Vault {
        address owner;
        uint256 unlockTime;
        uint256 goalAmount;
        address targetWallet;
        address alternativeWallet;
    }
    
    function createVault(
        uint256 unlockTime,
        uint256 goalAmount,
        address targetWallet,
        address alternativeWallet
    ) external {
        TimeVault newVault = new TimeVault(msg.sender, unlockTime, goalAmount, targetWallet, alternativeWallet);
        vaults[msg.sender].push(
            Vault({
                owner: msg.sender,
                unlockTime: unlockTime,
                goalAmount: goalAmount,
                targetWallet: targetWallet,
                alternativeWallet: alternativeWallet
            })
        );
        emit VaultCreated(msg.sender, address(newVault));
    }

    function getVaults(address owner) external view returns (Vault[] memory) {
        return vaults[owner];
    }
}
