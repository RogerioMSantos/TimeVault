// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.19;

contract TimeVault {
    address public owner;
    address public targetWallet;
    address public alternativeWallet;
    string public description;
    uint256 public unlockTime;
    uint256 public goalAmount;
    bool public goalMet;
    uint256 public totalDeposited;
    bool private canWithdraw;

    event Deposited(address indexed sender, uint256 amount);
    event Withdrawn(address indexed receiver, uint256 amount);
    event GoalStatusUpdated(bool status);

    constructor(
        address _owner,
        uint256 _unlockTime,
        uint256 _goalAmount,
        address _targetWallet,
        address _alternativeWallet,
        string memory _description
    ) {
        owner = _owner;
        unlockTime = _unlockTime;
        goalAmount = _goalAmount;
        targetWallet = _targetWallet;
        alternativeWallet = _alternativeWallet;
        description = _description;
        canWithdraw = true;
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

    modifier vaultLocked() {
        require(block.timestamp < unlockTime, "Vault is unlocked");
        _;
    }

    modifier canWithdrawSafely() {
        require(canWithdraw, "A withdrawal is already in progress");
        canWithdraw = false;
        _;

        canWithdraw = true;
    }

    modifier hasFounds() {
        require(address(this).balance > 0, "No funds available");
        _;
    }

    function deposit() external payable {
        totalDeposited += msg.value;
        emit Deposited(msg.sender, msg.value);

        if (totalDeposited >= goalAmount) {
            setGoalMet(true);
        }
    }

    function setGoalMet(bool status) private {
        goalMet = status;
        emit GoalStatusUpdated(status);
    }

    function withdraw() external goalMetCheck vaultUnlocked onlyTargetWallet hasFounds canWithdrawSafely{
        uint256 amount = address(this).balance;
        totalDeposited = 0;

        payable(targetWallet).transfer(amount);
        emit Withdrawn(targetWallet, amount);
    }

    function withdrawExcess() external onlyOwner vaultUnlocked hasFounds canWithdrawSafely{
        uint256 amount = address(this).balance;
        totalDeposited = 0;

        payable(alternativeWallet).transfer(amount);
        emit Withdrawn(alternativeWallet, amount);
    }

    function withdrawExcessLocked() external onlyOwner vaultLocked hasFounds canWithdrawSafely{
        uint256 amount = address(this).balance;
        totalDeposited = 0;

        payable(alternativeWallet).transfer(amount / 2);
        emit Withdrawn(alternativeWallet, amount);
    }

    function isWithdrawn() external view returns (bool) {
        return
            goalMet &&
            block.timestamp >= unlockTime &&
            address(this).balance == 0;
    }
}
