interface Portfolio {
  assets: { name: string; allocation: number }[];
  totalInvestment: number;
}

const buildPortfolio = (socialData: any, walletData: any): Portfolio => {
  const portfolio: Portfolio = { assets: [], totalInvestment: 0 };

  // Example logic based on social engagement
  if (socialData.twitter.verified) {
    portfolio.assets.push({ name: 'Twitter Stocks', allocation: 20 });
  }

  if (walletData.tokens.includes('ETH')) {
    portfolio.assets.push({ name: 'Ethereum', allocation: 30 });
  }

  // Add more logic based on your criteria
  portfolio.totalInvestment = portfolio.assets.reduce((total, asset) => total + asset.allocation, 0);

  return portfolio;
};

export default buildPortfolio; 