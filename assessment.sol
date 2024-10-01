// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Assessment {
    address payable public owner;
    uint256 public balance;
    uint256 public interestRate = 5; // 5% interest rate for fixed deposit
    uint256 public loanInterestRate = 10; // 10% interest rate for loans
    uint256 public loanBalance;

    struct FixedDeposit {
        uint256 amount;
        uint256 startTime;
        uint256 duration;
        bool withdrawn;
    }

    mapping(address => FixedDeposit) public deposits;
    mapping(address => uint256) public loans;

    event Deposit(uint256 amount);
    event Withdraw(uint256 amount);
    event BillPaid(address indexed biller, uint256 amount);
    event FixedDepositCreated(address indexed user, uint256 amount, uint256 duration);
    event FixedDepositWithdrawn(address indexed user, uint256 amountWithInterest);
    event LoanTaken(address indexed borrower, uint256 amount);
    event LoanRepaid(address indexed borrower, uint256 amount);

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

    // Function for users to create a fixed deposit
    function createFixedDeposit(uint256 _amount, uint256 _duration) public {
        require(balance >= _amount, "Not enough balance for fixed deposit");
        require(deposits[msg.sender].amount == 0, "Existing fixed deposit in place");

        balance -= _amount;
        deposits[msg.sender] = FixedDeposit({
            amount: _amount,
            startTime: block.timestamp,
            duration: _duration,
            withdrawn: false
        });

        emit FixedDepositCreated(msg.sender, _amount, _duration);
    }

    // Function to withdraw a fixed deposit with interest
    function withdrawFixedDeposit() public {
        FixedDeposit storage depositData = deposits[msg.sender];
        require(depositData.amount > 0, "No fixed deposit found");
        require(!depositData.withdrawn, "Deposit already withdrawn");
        require(block.timestamp >= depositData.startTime + depositData.duration, "Deposit duration not completed");

        uint256 interest = (depositData.amount * interestRate * depositData.duration) / (100 * 365 * 24 * 60 * 60);
        uint256 amountWithInterest = depositData.amount + interest;
        balance += amountWithInterest; // Update the contract balance

        depositData.withdrawn = true;
        emit FixedDepositWithdrawn(msg.sender, amountWithInterest);
    }

    // Function for users to take a loan
    function takeLoan(uint256 _amount) public {
        require(loans[msg.sender] == 0, "Existing loan in place");

        loans[msg.sender] = _amount;
        loanBalance += _amount;
        balance -= _amount;

        emit LoanTaken(msg.sender, _amount);
    }

    // Function to repay a loan
    function repayLoan() public payable {
        require(loans[msg.sender] > 0, "No loan to repay");

        uint256 loanAmount = loans[msg.sender];
        uint256 interest = (loanAmount * loanInterestRate) / 100;
        uint256 totalAmountToRepay = loanAmount + interest;

        require(msg.value >= totalAmountToRepay, "Not enough funds to repay the loan");

        loanBalance -= loanAmount;
        balance += totalAmountToRepay;
        loans[msg.sender] = 0;

        emit LoanRepaid(msg.sender, totalAmountToRepay);
    }
}
