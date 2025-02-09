import React from 'react';

const PortfolioDisplay = ({ portfolio }) => {
  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">Your Investment Portfolio 💰</h2>
      <ul>
        {portfolio.assets.map(asset => (
          <li key={asset.name} className="mb-2">
            {asset.name === 'Stocks' && '📈 Stocks: '}
            {asset.name === 'Bonds' && '🏦 Bonds: '}
            {asset.name === 'Crypto' && '₿ Crypto: '}
            {asset.name === 'Real Estate' && '🏠 Real Estate: '}
            {asset.name === 'Cash' && '💵 Cash: '}
            {asset.allocation}% -  {asset.allocation > 50 ? 'Strong Position!' : asset.allocation > 25 ? 'Diversified!' : 'Consider diversifying!'}
          </li>
        ))}
      </ul>
      <p className="mt-4">Total Investment: <span className="font-semibold">${portfolio.totalInvestment.toLocaleString()}</span></p>
    </div>
  );
};

export default PortfolioDisplay;
