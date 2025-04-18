import React, { useEffect, useState } from "react";
import { fetchMiniStatement } from "../services/api";
import "../styles/MiniStatement.css";
import GoBackButton from "../components/GoBackButton";

const MiniStatement = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchMiniStatement();
        setTransactions(data.transactions);
      } catch (err) {
        console.error("Error fetching mini statement", err);
      }
    };

    getData();
  }, []);

  return (
    <div className="mini-container">
      <GoBackButton />
      <h2>Mini Statement</h2>
      <div className="mini-box">
        {transactions.length === 0 ? (
          <p>No recent transactions found.</p>
        ) : (
          <ul>
            {transactions.map((txn, index) => (
              <li key={index}>
                <span className={`type ${txn.type}`}>
                  {txn.type.toUpperCase()}
                </span>
                ₹{txn.amount} —{" "}
                <span className="timestamp">
                  {new Date(txn.timestamp).toLocaleString()}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default MiniStatement;
