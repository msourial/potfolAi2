import React from 'react';
import { useRouter } from 'next/router';

const Results = () => {
  const router = useRouter();
  const { portfolio } = router.query;

  const parsedPortfolio = portfolio ? JSON.parse(portfolio as string) : null;

  return (
    <div>
      <h1>Portfolio Results</h1>
      {parsedPortfolio ? (
        <div>
          <h2>Total Investment: ${parsedPortfolio.totalInvestment}</h2>
          <ul>
            {parsedPortfolio.investments.map((investment: any, index: number) => (
              <li key={index}>
                {investment.amount} {investment.asset} - {investment.reason}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p>No portfolio data available.</p>
      )}
    </div>
  );
};

export default Results; 