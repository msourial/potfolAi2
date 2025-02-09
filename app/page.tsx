"use client";

import Image from 'next/image';
import styles from './page.module.css';
import RiskAssessment from './components/RiskAssessment';
import PersonaSection from './components/PersonaSection';
import StockMarketSentiment from './components/StockMarketSentiment';
import SocialAnalysis from './components/SocialAnalysis';
import Agent from '../../src/components/Agent';

const HomePage = () => {
  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <SocialAnalysis />
    </div>
  );
};

export default HomePage;
