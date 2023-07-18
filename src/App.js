import React, { useEffect, useState } from 'react';

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [rewards, setRewards] = useState([]);

  useEffect(() => {
    fetch('/transactions.json')
      .then(response => response.json())
      .then(data => setTransactions(data))
      .catch(error => console.error('Error fetching transaction data:', error));
  }, []);

  const calculateRewards = () => {
    const monthlyRewards = {};
    const totalRewards = {};

    transactions.forEach(transaction => {
      const { customerId, purchaseAmount, date } = transaction;
      const month = new Date(date).toLocaleString('en-US', { month: 'long' });

      const points = calculatePoints(purchaseAmount);

      if (!monthlyRewards[customerId]) {
        monthlyRewards[customerId] = {};
      }

      if (!totalRewards[customerId]) {
        totalRewards[customerId] = 0;
      }

      if (!monthlyRewards[customerId][month]) {
        monthlyRewards[customerId][month] = 0;
      }

      monthlyRewards[customerId][month] += points;
      totalRewards[customerId] += points;
    });

    setRewards({ monthlyRewards, totalRewards });
  };

  const calculatePoints = purchaseAmount => {
    let points = 0;

    if (purchaseAmount > 100) {
      points += 2 * (purchaseAmount - 100);
    }

    if (purchaseAmount > 50 && purchaseAmount <= 100) {
      points += purchaseAmount - 50;
    }

    return points;
  };

  return (
    <div>
      <button onClick={calculateRewards}>Calculate Rewards</button>

      <h2>Monthly Rewards</h2>
      <ul>
        {Object.entries(rewards.monthlyRewards || {}).map(([customerId, monthlyRewards]) => (
          <li key={customerId}>
            Customer ID: {customerId}
            <ul>
              {Object.entries(monthlyRewards).map(([month, points]) => (
                <li key={month}>
                  {month}: {points} points
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>

      <h2>Total Rewards</h2>
      <ul>
        {Object.entries(rewards.totalRewards || {}).map(([customerId, points]) => (
          <li key={customerId}>
            Customer ID: {customerId} - Total Points: {points}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
