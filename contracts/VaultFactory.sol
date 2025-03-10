// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TimeVault is ERC20{
    address public owner;
    address public token;
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
        address _token,
        uint256 _unlockTime,
        uint256 _goalAmount,
        address _targetWallet,
        address _alternativeWallet
    ) ERC20("TimeVault", "TV") {
        owner = _owner;
        token = _token;
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

    modifier goalmet() {
        require(goalMet, "Goal not met");
        _;
    }

    modifier vaultUnlocked() {
        require(block.timestamp >= unlockTime, "Vault is still locked");
        require(totalDeposited >= goalAmount, "Goal not met");
        _;
    }

    function deposit(uint256 amount) external payable {
        require(block.timestamp < unlockTime, "Vault is unlocked");
        IERC20(token).transferFrom(msg.sender, address(this), amount);
        totalDeposited += amount;
        emit Deposited(msg.sender, amount);
    }
    
    function setGoalMet(bool status) external onlyOwner {
        goalMet = status;
        emit GoalStatusUpdated(status);
    }
    
    function withdraw() external goalmet() vaultUnlocked() onlyTargetWallet(){
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No funds available");

        address recipient = goalMet ? targetWallet : (alternativeWallet != address(0) ? alternativeWallet : address(this));
        IERC20(token).transfer(recipient, balance);
        emit Withdrawn(recipient, balance);
    }

    function withdrawExcess() external onlyOwner {
        require(block.timestamp >= unlockTime, "Vault is still locked");
        uint256 balance = IERC20(token).balanceOf(address(this));
        require(balance > 0, "No funds available");

        IERC20(token).transfer(owner, balance);
        emit Withdrawn(owner, balance);
    }
}

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
        emit VaultCreated(msg.sender, address(newVault));
    }

    function getVaults(address owner) external view returns (address[] memory) {
        return vaults[owner];
    }
}
