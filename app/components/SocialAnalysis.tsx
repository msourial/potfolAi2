'use client';

import React, { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/router';

const SocialAnalysis = () => {
  const { login, authenticated, ready } = usePrivy();
  const [showModal, setShowModal] = useState(false);
  const router = useRouter(); // This should work if SocialAnalysis is used correctly

  const handleContinueBuilding = async () => {
    const randomPortfolio = {
      investments: [
        { asset: 'ETH', amount: 2, reason: 'Strong community interest in Ethereum.' },
        { asset: 'BTC', amount: 1, reason: 'Bitcoin is a widely recognized asset.' },
        { asset: 'LINK', amount: 5, reason: 'Chainlink has strong support on social media.' }
      ],
      totalInvestment: 10000
    };

    router.push({
      pathname: '/results',
      query: { portfolio: JSON.stringify(randomPortfolio) },
    });
  };

  return (
    <div>
      {/* Your component JSX */}
      <button onClick={handleContinueBuilding}>Start Building</button>
    </div>
  );
};

export default SocialAnalysis; 