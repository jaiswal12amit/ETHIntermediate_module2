import { useState, useEffect } from "react";
import { ethers } from "ethers";
import atm_abi from "../artifacts/contracts/Assessment.sol/Assessment.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [atm, setATM] = useState(undefined);
  const [balance, setBalance] = useState(undefined);
  const [billerAddress, setBillerAddress] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(null);

  const [depositAmount, setDepositAmount] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [loanStatus, setLoanStatus] = useState(null);
  const [fixedDepositPeriod, setFixedDepositPeriod] = useState("");
  const [fixedDepositAmount, setFixedDepositAmount] = useState("");
  const [fdStatus, setFdStatus] = useState(null);

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
      setAccount(account[0]);
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
      setBalance(ethers.utils.formatEther(await atm.getBalance())); // Convert balance to ETH
    }
  };

  const deposit = async (amount) => {
    if (atm) {
      let tx = await atm.deposit(ethers.utils.parseEther(amount.toString())); // Convert amount to wei
      await tx.wait();
      getBalance(); // Update balance after deposit
    }
  };

  const withdraw = async (amount) => {
    if (atm) {
      let tx = await atm.withdraw(ethers.utils.parseEther(amount.toString())); // Convert amount to wei
      await tx.wait();
      getBalance(); // Update balance after withdrawal
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

  // Updated Payment Logic
  const sendPayment = async (amount) => {
    if (!ethers.utils.isAddress(billerAddress)) {
      alert("Invalid Ethereum address");
      return;
    }

    if (amount <= 0) {
      alert("Enter a valid amount");
      return;
    }

    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();

    try {
      const tx = await signer.sendTransaction({
        to: billerAddress,
        value: ethers.utils.parseEther(amount.toString()), // convert amount to wei
      });
      await tx.wait(); // wait for transaction confirmation
      setPaymentStatus("Payment successful");

      // Re-fetch the balance after payment
      const newBalance = await signer.getBalance(); // get balance in wei
      setBalance(ethers.utils.formatEther(newBalance)); // convert balance from wei to ether
    } catch (error) {
      console.error("Transaction failed:", error);
      setPaymentStatus("Payment failed");
    }
  };

  const handleBillerAddressChange = (e) => {
    setBillerAddress(e.target.value);
  };

  const askAmountAndPayBill = async () => {
    const amount = prompt("Enter the amount to pay:");
    if (amount !== null && !isNaN(amount) && amount > 0) {
      await sendPayment(parseFloat(amount));
    } else {
      alert("Please enter a valid amount.");
    }
  };

  // Updated Loan Logic
  const handleLoan = async () => {
    if (!loanAmount) {
      alert("Please enter a valid loan amount.");
      return;
    }

    try {
      const tx = await atm.takeLoan(ethers.utils.parseEther(loanAmount)); // Convert amount to wei
      await tx.wait();
      setLoanStatus("Loan taken successfully");
      getBalance(); // Update balance after taking the loan
    } catch (error) {
      setLoanStatus("Loan request failed");
      console.error(error);
    }
  };
  // Updated Fixed Deposit Logic
const handleFixedDeposit = async () => {
  if (!fixedDepositAmount || !fixedDepositPeriod) {
    alert("Please enter a valid amount and period for the fixed deposit.");
    return;
  }

  try {
    const tx = await atm.makeFixedDeposit(
      ethers.utils.parseEther(fixedDepositAmount), // Convert amount to wei
      fixedDepositPeriod
    );
    await tx.wait();
    setFdStatus("Fixed deposit made successfully");
    getBalance(); // Update balance after fixed deposit
  } catch (error) {
    setFdStatus("Fixed deposit failed");
    console.error(error);
  }
};


  const initUser = () => {
    if (!ethWallet) {
      return <p>Please install MetaMask in order to use this ATM.</p>;
    }

    if (!account) {
      return (
        <button className="btn-primary" onClick={connectAccount}>
          Connect MetaMask Wallet
        </button>
      );
    }

    if (balance === undefined) {
      getBalance();
    }

    return (
      <div className="card">
        <p><strong>Account:</strong> {account}</p>
        <p><strong>Balance:</strong> {balance} ETH</p>
        <div className="button-group">
          <button className="btn-secondary" onClick={() => deposit(1)}>Deposit 1 ETH</button>
          <button className="btn-secondary" onClick={() => withdraw(1)}>Withdraw 1 ETH</button>
        </div>
        <div className="button-group">
          <button className="btn-secondary" onClick={() => deposit(10)}>Deposit 10 ETH</button>
          <button className="btn-secondary" onClick={() => withdraw(10)}>Withdraw 10 ETH</button>
        </div>
        <div className="button-group">
          <button className="btn-secondary" onClick={askAmountAndDeposit}>Deposit Custom Amount</button>
          <button className="btn-secondary" onClick={askAmountAndWithdraw}>Withdraw Custom Amount</button>
        </div>

        <div className="payment-section">
          <h3>Pay Your Bills</h3>
          <input
            type="text"
            className="input"
            placeholder="Enter biller address"
            value={billerAddress}
            onChange={handleBillerAddressChange}
          />
          <button className="btn-primary" onClick={askAmountAndPayBill}>Pay Bill</button>
        </div>

        {paymentStatus && <p className="status">{paymentStatus}</p>}

        {/* Fixed Deposit Section */}
        <div className="fixed-deposit-section">
          <h3>Fixed Deposit</h3>
          <input
            type="number"
            className="input"
            placeholder="Deposit Amount"
            value={fixedDepositAmount}
            onChange={(e) => setFixedDepositAmount(e.target.value)}
          />
          <input
            type="number"
            className="input"
            placeholder="Deposit Period (in days)"
            value={fixedDepositPeriod}
            onChange={(e) => setFixedDepositPeriod(e.target.value)}
          />
          <button className="btn-primary" onClick={handleFixedDeposit}>Make Fixed Deposit</button>
        </div>
        {fdStatus && <p className="status">{fdStatus}</p>}

        {/* Loan Section */}
        <div className="loan-section">
          <h3>Take a Loan</h3>
          <input
            type="number"
            className="input"
            placeholder="Loan Amount"
            value={loanAmount}
            onChange={(e) => setLoanAmount(e.target.value)}
          />
          <button className="btn-primary" onClick={handleLoan}>Take Loan</button>
        </div>
        {loanStatus && <p className="status">{loanStatus}</p>}
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
          background-color: #f0f4f8;
          color: #333;
          padding: 40px;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        header h1 {
          font-size: 2.5rem;
          color: #0070f3;
        }
        .card {
          background: #fff;
          padding: 30px;
          margin: 20px auto;
          border-radius: 8px;
          max-width: 600px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }
        .button-group {
          margin: 20px 0;
        }
        .btn-primary {
          background-color: #0070f3;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin: 10px;
        }
        .btn-primary:hover {
          background-color: #005bb5;
        }
        .btn-secondary {
          background-color: #333;
          color: white;
          padding: 10px 20px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin: 10px;
        }
        .btn-secondary:hover {
          background-color: #555;
        }
        .input {
          padding: 10px;
          border: 2px solid #ddd;
          border-radius: 5px;
          width: 80%;
          margin-bottom: 10px;
        }
        .payment-section {
          margin: 30px 0;
        }
        .fixed-deposit-section, .loan-section {
          margin: 30px 0;
        }
        .status {
          color: green;
          font-weight: bold;
          margin-top: 20px;
        }
      `}</style>
    </main>
  );
}
