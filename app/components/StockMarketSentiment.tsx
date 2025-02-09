"use client";

import { useState, useEffect } from 'react';

export default function StockMarketSentiment() {
  const [sentiment, setSentiment] = useState<string>('Loading...');

  useEffect(() => {
    const fetchStockData = async () => {
      try {
        const response = await fetch('/api/stockbot', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: "What's the current market sentiment for US stocks?"
          })
        });
        
        const data = await response.json();
        setSentiment(data.response);
      } catch (error) {
        console.error('Error fetching stock data:', error);
        setSentiment('Error loading market sentiment');
      }
    };

    fetchStockData();
  }, []);

  return (
    <div>
      <h3 className="font-bold mb-2">US Stock Market Sentiment:</h3>
      <p>{sentiment}</p>
    </div>
  );
} 