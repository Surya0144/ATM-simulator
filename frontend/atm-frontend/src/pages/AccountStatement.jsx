import React, { useState, useEffect } from "react";
import { getAccountStatement } from "../services/api";
import "../styles/AccountStatement.css";
import GoBackButton from "../components/GoBackButton";

const AccountStatement = () => {
  const [transactions, setTransactions] = useState([]);
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
  });
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 10;

  const fetchData = async () => {
    const data = await getAccountStatement({ ...filters, page, limit });
    setTransactions(data.transactions);
    setTotal(data.total);
  };

  useEffect(() => {
    fetchData();
  }, [filters, page]);

  const handleExportCSV = () => {
    const rows = [
      ["Type", "Amount", "Timestamp"],
      ...transactions.map((t) => [
        t.type,
        t.amount,
        new Date(t.timestamp).toLocaleString(),
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "account_statement.csv";
    a.click();
  };

  return (
    <div className="statement-container">
      <h2>Account Statement</h2>

      <div className="filters">
        <select
          onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))}
          value={filters.type}
        >
          <option value="">All Types</option>
          <option value="deposit">Deposit</option>
          <option value="withdrawal">Withdrawal</option>
        </select>

        <input
          type="date"
          onChange={(e) =>
            setFilters((f) => ({ ...f, startDate: e.target.value }))
          }
        />
        <input
          type="date"
          onChange={(e) =>
            setFilters((f) => ({ ...f, endDate: e.target.value }))
          }
        />

        <button onClick={handleExportCSV}>Export to CSV</button>
      </div>

      <table className="statement-table">
        <thead>
          <tr>
            <th>Type</th>
            <th>Amount (₹)</th>
            <th>Timestamp</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((txn, index) => (
            <tr key={index}>
              <td>{txn.type}</td>
              <td>{txn.amount}</td>
              <td>{new Date(txn.timestamp).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Prev
        </button>
        <span>Page {page}</span>
        <button
          disabled={page * limit >= total}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      <GoBackButton />
    </div>
  );
};

export default AccountStatement;
