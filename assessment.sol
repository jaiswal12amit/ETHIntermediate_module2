// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event BillPaid(address indexed biller, uint256 amount); // Event to track bill payments

    constructor(uint initBalance) payable {
        owner = payable(msg.sender);
        balance = initBalance;
    }

    function getBalance() public view returns (uint256) {
        return balance;
    }

    function deposit(uint256 _amount) public payable {
        uint _previousBalance = balance;

        // Ensure only the owner can deposit
        require(msg.sender == owner, "You are not the owner of this account");

        // Perform deposit
        balance += _amount;

        // Check if the deposit was successful
        assert(balance == _previousBalance + _amount);

        // Emit deposit event
        emit Deposit(_amount);
    }

    // Custom error for insufficient balance
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

    function withdraw(uint256 _withdrawAmount) public {
        require(msg.sender == owner, "You are not the owner of this account");
        uint _previousBalance = balance;

        // Check if there is enough balance to withdraw
        if (balance < _withdrawAmount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _withdrawAmount
            });
        }

        // Withdraw the given amount
        balance -= _withdrawAmount;

        // Assert balance is correct after withdrawal
        assert(balance == (_previousBalance - _withdrawAmount));

        // Emit withdrawal event
        emit Withdraw(_withdrawAmount);
    }

    // Function to pay a bill
    function payBill(address payable _biller, uint256 _amount) public {
        require(msg.sender == owner, "Only the owner can pay bills");

        // Check if there's enough balance for the payment
        if (balance < _amount) {
            revert InsufficientBalance({
                balance: balance,
                withdrawAmount: _amount
            });
        }

        // Transfer the amount to the biller's address
        balance -= _amount;
        _biller.transfer(_amount);

        // Emit event to track the bill payment
        emit BillPaid(_biller, _amount);
    }
}
