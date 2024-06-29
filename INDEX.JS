import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);

  const contractAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
  const atmABI = atm_abi.abi;

  const getWallet = async () => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({ method: "eth_accounts" });
      handleAccount(account);
    }
  };

  const handleAccount = (account) => {
    if (account) {
      console.log("Account connected: ", account);
      setAccount(account);
    } else {
      console.log("No account found");
    }
  };

  const connectAccount = async () => {
    if (!ethWallet) {
      alert("MetaMask wallet is required to connect");
      return;
    }

    const accounts = await ethWallet.request({ method: "eth_requestAccounts" });
    handleAccount(accounts);

    // once wallet is set we can get a reference to our deployed contract
    getATMContract();
  };

  const getATMContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const atmContract = new ethers.Contract(contractAddress, atmABI, signer);

    setATM(atmContract);
  };

  const getBalance = async () => {
    if (atm) {
      setBalance((await atm.getBalance()).toNumber());
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(amount);
      await tx.wait();
      getBalance();
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(amount);
      await tx.wait();
      getBalance();
    }
  };

  const askAmountAndDeposit = async () => {
    const amount = prompt("Enter the amount to deposit:");
    if (amount !== null && !isNaN(amount) && amount > 0) {
      await deposit(parseFloat(amount));
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const askAmountAndWithdraw = async () => {
    const amount = prompt("Enter the amount to withdraw:");
    if (amount !== null && !isNaN(amount) && amount > 0) {
      await withdraw(parseFloat(amount));
    } else {
      alert("Please enter a valid amount.");
    }
  };

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this ATM.</p>;
    }

    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return (
        <button onClick={connectAccount}>Please connect your Metamask wallet</button>
      );
    }

    if (balance == undefined) {
      getBalance();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <p>Your Balance: {balance}</p>
        <button onClick={() => deposit(1)}>Deposit 1 ETH</button>
        <button onClick={() => withdraw(1)}>Withdraw 1 ETH</button>
        <button onClick={() => deposit(10)}>Deposit 10 ETH</button>
        <button onClick={() => withdraw(10)}>Withdraw 10 ETH</button>
        <button onClick={askAmountAndDeposit}>Deposit Custom Amount</button>
        <button onClick={askAmountAndWithdraw}>Withdraw Custom Amount</button>
      </div>
    );
  };

  useEffect(() => {
    getWallet();
  }, []);

  return (
    <main className="container">
      <header>
        <h1>Welcome to the Decentralized Transaction Service</h1>
      </header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center;
          background-color: green;
          color: white;
          padding: 40px;
          font-family: Arial, sans-serif;
        }
        header {
          margin-bottom: 20px;
        }
        button {
          margin: 10px;
          padding: 10px 20px;
          border: none;
          background-color: #0070f3;
          color: white;
          cursor: pointer;
          border-radius: 5px;
          transition: background-color 0.3s ease;
        }
        button:hover {
          background-color: #005bb5;
        }
        p {
          font-size: 18px;
        }
      `}</style>
    </main>
  );
}
