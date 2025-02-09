"use client";

import Image from 'next/image';
import styles from './page.module.css';
import RiskAssessment from './components/RiskAssessment';
import PersonaSection from './components/PersonaSection';
import SocialAnalysis from '@/components/SocialAnalysis';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24 relative">
      {/* Privy Wallet Connection (Top Right) */}
      <div className="absolute top-4 right-4">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => {
            // Simulate wallet connection (replace with Privy SDK integration)
            alert("Connecting to wallet... (Placeholder)");
          }}
        >
          Connect Wallet
        </button>
      </div>

      {/* Hero Section */}
      <section className="w-full max-w-4xl text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">portfolAI</h1>
        <p className="text-lg md:text-xl mb-8">Invest Like Me: Discover Your Investment Persona & Get Smart Trading Insights.</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Find Your Investment Style
        </button>
      </section>

      {/* Risk Assessment Module */}
      <section className="w-full max-w-4xl mb-16">
        <SocialAnalysis />
      </section>

      {/* Market Sentiment Section */}
      <section className="w-full max-w-4xl mb-16">
        <h2>Market Sentiment Bot</h2>
        <p>
          US Stock Market Sentiment: [Placeholder - Stockbot Data] <br />
          Crypto Sentiment: [Placeholder - Data from Gaia] <br />
          Commodities Sentiment: [Placeholder - Data from Gaia] <br />
          Bonds Sentiment: [Placeholder - Data from Gaia]
        </p>
      </section>

      {/* Invest Like Me - Persona Section */}
      <section className="w-full max-w-4xl mb-16">
        <PersonaSection />
      </section>

      {/* Integrations with External Services (Placeholder) */}
      <section className="w-full max-w-4xl mb-16">
        <h2>Integrations</h2>
        <p>Privy Wallet and IBKR API integrations.</p>
      </section>

      {/* Footer */}
      <footer className="w-full max-w-4xl text-center py-8 border-t border-gray-200">
        <p>&copy; 2024 portfolAI. All rights reserved.</p>
      </footer>
    </main>
  );
}
