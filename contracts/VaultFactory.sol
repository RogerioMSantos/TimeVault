// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./TimeVault.sol";

contract VaultFactory {
    event VaultCreated(address indexed owner, address vaultAddress);

    mapping(address => address[]) public vaults;
    
    function createVault(
        address token,
        uint256 unlockTime,
        uint256 goalAmount,
        address targetWallet,
        address alternativeWallet
    ) external {
        TimeVault newVault = new TimeVault(msg.sender, token, unlockTime, goalAmount, targetWallet, alternativeWallet);
        vaults[msg.sender].push(address(newVault));
        emit VaultCreated(msg.sender, address(newVault));
    }

    function getVaults(address owner) external view returns (address[] memory) {
        return vaults[owner];
    }
}
