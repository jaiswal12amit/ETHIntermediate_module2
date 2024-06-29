# Digital Decentralized Transaction Service

The Digital Decentralized Transaction Service (DDTS) is a dApp that enables secure and efficient financial transactions on the Ethereum blockchain. By integrating with MetaMask, it allows users to deposit and withdraw funds directly through smart contracts. The user interface prompts users to connect their MetaMask wallet, displays their Ethereum account and balance, and provides options for depositing and withdrawing fixed or custom amounts.

## Features

- **Decentralized**: Operates on the Ethereum blockchain without a central authority.
- **User Control**: Users manage their own funds via MetaMask.
- **Transparent & Secure**: Transactions are transparent and secure, recorded on an immutable blockchain ledger.
- **Efficient**: Smart contracts automate and streamline transactions, reducing costs.
- **Accessible**: Easy to use with a simple interface and MetaMask integration.

## Technology Used

- **React**: Front-end framework for building user interfaces.
- **Ethers.js**: Library for interacting with the Ethereum blockchain.
- **MetaMask**: Ethereum wallet for managing user accounts and transactions.
- **Solidity**: Smart contract programming language.

## Functionality

- **`getWallet`**: Initializes the MetaMask wallet connection if available.
- **`handleAccount`**: Handles the retrieved Ethereum accounts from MetaMask.
- **`connectAccount`**: Initiates the connection process with MetaMask and retrieves user accounts.
- **`getATMContract`**: Retrieves and sets up the deployed ATM smart contract using ethers.js.

## User Interface

- **`initUser`**: Manages the user interface based on the wallet connection status, displaying account information, balances, and transaction buttons.

## Dependencies

- **React**: Front-end framework for building the user interface.
- **ethers.js**: JavaScript library

## Overview 

This README provides an overview of the functionality and references external resources for deeper exploration. Adjustments can be made based on specific project details or additional functionalities.
