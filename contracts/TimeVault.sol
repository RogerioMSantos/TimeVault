// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

contract TimeVault {
    address public owner;
    address public targetWallet;
    address public alternativeWallet;
    uint256 public unlockTime;
    uint256 public goalAmount;
    bool public goalMet;
    uint256 public totalDeposited;
    
    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed receiver, uint256 amount);
    event GoalStatusUpdated(bool status);
    
    constructor(
        address _owner,
        uint256 _unlockTime,
        uint256 _goalAmount,
        address _targetWallet,
        address _alternativeWallet
    ) {
        owner = _owner;
        unlockTime = _unlockTime;
        goalAmount = _goalAmount;
        targetWallet = _targetWallet;
        alternativeWallet = _alternativeWallet;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    modifier onlyTargetWallet() {
        require(msg.sender == targetWallet, "Not the target wallet");
        _;
    }

    modifier goalMetCheck() {
        require(goalMet, "Goal not met");
        _;
    }

    modifier vaultUnlocked() {
        require(block.timestamp >= unlockTime, "Vault is still locked");
        _;
    }

    function deposit() external payable {
        require(block.timestamp < unlockTime, "Vault is unlocked");
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value);
    }
    
    function setGoalMet(bool status) external onlyOwner {
        goalMet = status;
        emit GoalStatusUpdated(status);
    }
    
    function withdraw() external goalMetCheck vaultUnlocked onlyTargetWallet {
        require(address(this).balance > 0, "No funds available");
        
        address recipient = goalMet ? targetWallet : (alternativeWallet != address(0) ? alternativeWallet : address(this));
        uint256 amount = address(this).balance;
        
        payable(recipient).transfer(amount);
        emit Withdrawn(recipient, amount);
    }

    function withdrawExcess() external onlyOwner vaultUnlocked {
        require(address(this).balance > 0, "No funds available");
        uint256 amount = address(this).balance;
        
        payable(owner).transfer(amount);
        emit Withdrawn(owner, amount);
    }
}
