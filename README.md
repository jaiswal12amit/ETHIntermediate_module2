# Decentralized Transaction Service

This project is a decentralized financial application (DApp) built using Solidity, Ethereum smart contracts, and React. It provides basic financial functionalities such as deposits, bill payments, fixed deposits, and loans. The project allows users to interact with Ethereum blockchain via MetaMask to perform these transactions in a decentralized manner.

## Features

- **Deposit**: Deposit funds into the smart contract.
- **Withdraw**: Withdraw funds from the smart contract.
- **Bill Payment**: Send payments to billers from your account.
- **Fixed Deposit**: Create fixed deposits that generate interest over time.
- **Loan**: Take a loan from the contract and repay it with interest.

## Smart Contract Details

The contract is written in Solidity and offers the following functionalities:

### Key Functions:

- **deposit(uint256 _amount)**: Allows the contract owner to deposit funds into the contract.
- **withdraw(uint256 _withdrawAmount)**: Allows the contract owner to withdraw funds from the contract.
- **payBill(address payable _biller, uint256 _amount)**: Enables the owner to pay a bill to a specified address.
- **createFixedDeposit(uint256 _amount, uint256 _duration)**: Users can create a fixed deposit that earns interest over a set period.
- **withdrawFixedDeposit()**: Allows users to withdraw their fixed deposit plus interest after the duration has passed.
- **takeLoan(uint256 _amount)**: Users can take a loan, which must be repaid with interest.
- **repayLoan()**: Users can repay their loan with interest.

### Events:

- **Deposit(uint256 amount)**: Emitted when the owner deposits funds.
- **Withdraw(uint256 amount)**: Emitted when the owner withdraws funds.
- **BillPaid(address indexed biller, uint256 amount)**: Emitted when a bill is paid.
- **FixedDepositCreated(address indexed user, uint256 amount, uint256 duration)**: Emitted when a fixed deposit is created.
- **FixedDepositWithdrawn(address indexed user, uint256 amountWithInterest)**: Emitted when a fixed deposit is withdrawn with interest.
- **LoanTaken(address indexed borrower, uint256 amount)**: Emitted when a loan is taken.
- **LoanRepaid(address indexed borrower, uint256 amount)**: Emitted when a loan is repaid.

## Tech Stack

- **Solidity**: Smart contracts are written in Solidity.
- **Ethereum**: Interacting with the Ethereum blockchain.
- **MetaMask**: For managing user accounts and signing transactions.
- **React**: Front-end interface for users to interact with the smart contract.
- **Ethers.js**: To interact with Ethereum blockchain from the frontend.

## Installation

### Prerequisites

Before you begin, make sure you have:

- Node.js installed
- MetaMask extension installed in your browser
- An Ethereum test network (like Goerli or Ganache)

### Steps

1. **Clone the repository**:
   ```bash
   git clone https://github.com/jaiswal12amit/ETHIntermediate_module2.git
   cd your-repository
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up a local Ethereum network**:
   You can use Ganache or any other test network for local development.

4. **Compile and Deploy Smart Contract**:
   Ensure that your Ethereum network is running and deploy the smart contract using Hardhat or Truffle:
   
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. **Start the Frontend**:
   ```bash
   npm run dev
   ```

6. **Connect MetaMask**:
   - Open MetaMask and configure it to connect to your local Ethereum network.
   - Import accounts with sufficient test Ether to interact with the contract.

## Usage

1. **Connect MetaMask**: Click on "Connect MetaMask Wallet" to connect your wallet to the DApp.
   
2. **Deposit Funds**: Enter an amount and click "Deposit" to add funds to your account.

3. **Withdraw Funds**: Click on "Withdraw" to take funds from your account.

4. **Pay a Bill**: Enter the biller’s address and amount, and click "Pay Bill".

5. **Fixed Deposit**: Enter a deposit amount and duration to create a fixed deposit.

6. **Take Loan**: Enter a loan amount to take out a loan.

7. **Repay Loan**: Repay the loan with interest.

## Smart Contract Details

The smart contract can be found in `contracts/Assessment.sol`. It includes functionality for balance management, bill payments, fixed deposits, and loans.

### Contract Variables:

- **owner**: The address of the contract owner.
- **balance**: The total balance in the contract.
- **interestRate**: Interest rate applied to fixed deposits.
- **loanInterestRate**: Interest rate applied to loans.
- **loanBalance**: Total outstanding loan balance.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature/fooBar`).
3. Commit your changes (`git commit -am 'Add some fooBar'`).
4. Push to the branch (`git push origin feature/fooBar`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
