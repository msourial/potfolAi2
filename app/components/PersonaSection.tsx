"use client";

import React from 'react';

const PersonaSection: React.FC = () => {
  return (
    <section className="persona-section">
      <h2>Invest Like Me - Persona Section</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {/* Warren Buffett Persona */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Warren Buffett</h3>
          <p className="text-gray-700 mb-4">Long-term value investor</p>
          <p className="text-gray-600 mb-2">Allocation: 70% equities (blue-chip stocks/dividend ETFs), 15% bonds, 10% commodities (split between agriculture and precious metals), 5% cash.</p>
          <p className="text-gray-700 italic mb-4">"Patience & Proven Strategies."</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invest Like Warren
          </button>
        </div>

        {/* Elon Musk Persona */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Elon Musk</h3>
          <p className="text-gray-700 mb-4">Disruptive, tech-focused growth investor</p>
          <p className="text-gray-600 mb-2">Allocation: 50% tech equities, 20% cryptocurrencies, 10% tech-related commodities (e.g., lithium ETFs), 15% alternative investments, minimal bonds.</p>
          <p className="text-gray-700 italic mb-4">"Bet on the Future."</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invest Like Elon
          </button>
        </div>

        {/* To the Moon GenZ Persona */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">To the Moon GenZ</h3>
          <p className="text-gray-700 mb-4">High-risk, meme-driven speculator</p>
          <p className="text-gray-600 mb-2">Allocation: 30% trending/meme stocks, 40% cryptocurrencies (including meme coins), 10% safe commodities, 15% alternative speculative assets (NFTs/gaming stocks), 5% cash.</p>
          <p className="text-gray-700 italic mb-4">"Sky’s the Limit – Ride the Wave!"</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invest Like GenZ
          </button>
        </div>

        {/* Jim Cramer Persona */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-2">Jim Cramer</h3>
          <p className="text-gray-700 mb-4">Active, momentum trader</p>
          <p className="text-gray-600 mb-2">Allocation: 60% blue-chip/momentum equities, 10% bonds, 10% commodities (precious metals/energy), 10% cryptocurrencies, 10% cash.</p>
          <p className="text-gray-700 italic mb-4">"Bold Moves with a Safety Net."</p>
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
            Invest Like Jim
          </button>
        </div>
      </div>
    </section>
  );
};

export default PersonaSection;
