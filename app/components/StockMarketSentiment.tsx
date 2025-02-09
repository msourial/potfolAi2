"use client";

export default function StockMarketSentiment() {
  const usStockSentiment = "🐂 Bullish! Market is looking strong! 🚀";
  const cryptoSentiment = "🐻 Bearish. Crypto is down. 📉";
  const commoditiesSentiment = "Neutral 😐";
  const bondsSentiment = "Slightly Bullish 📈";

  return (
    <div>
      <h3 className="font-bold mb-2">US Stock Market Sentiment:</h3>
      <p>{usStockSentiment}</p>
      <h3 className="font-bold mb-2">Crypto Sentiment:</h3>
      <p>{cryptoSentiment}</p>
      <h3 className="font-bold mb-2">Commodities Sentiment:</h3>
      <p>{commoditiesSentiment}</p>
      <h3 className="font-bold mb-2">Bonds Sentiment:</h3>
      <p>{bondsSentiment}</p>
    </div>
  );
}
