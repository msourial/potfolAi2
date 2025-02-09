"use client";

import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import { verifyTwitterAccount, verifyDiscordAccount, verifyTelegramAccount } from '../utils/social-verification';
import { toast } from 'react-hot-toast';
import { usePrivy } from '@privy-io/react-auth';
import Image from 'next/image';
import TwitterRiskMetrics from './TwitterRiskMetrics';

interface AutoRiskProfile {
  walletRisk: number;
  socialRisk: number;
  overallRisk: number;
  recommendations: string[];
  alerts: string[];
}

interface SocialConnections {
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  twitterVerified?: boolean;
  twitterData?: any;
  twitterRisk?: any;
}

const RiskAssessment: React.FC = () => {
  const { login, authenticated, user, ready } = usePrivy();
  const [loading, setLoading] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string>('');
  const [riskProfile, setRiskProfile] = useState<AutoRiskProfile | null>(null);
  const [socialConnections, setSocialConnections] = useState<SocialConnections>({
    twitter: '',
    discord: '',
    telegram: '',
    twitterVerified: false,
    twitterData: null,
    twitterRisk: null
  });
  const [showSocialModal, setShowSocialModal] = useState(false);

  const connectAndAnalyze = async () => {
    setLoading(true);
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      const address = accounts[0];
      setWalletAddress(address);

      // Include social connections in analysis
      const [walletRisk, socialRisk] = await Promise.all([
        analyzeWalletRisk(address),
        analyzeSocialRisk(address, socialConnections)
      ]);

      const profile = generateRiskProfile(walletRisk, socialRisk);
      setRiskProfile(profile);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const analyzeWalletRisk = async (address: string) => {
    // Analyze on-chain data
    const riskFactors = await Promise.all([
      checkLiquidityExposure(address),
      checkRugPullExposure(address),
      checkScamInteractions(address),
      checkTradingBehavior(address),
      checkGasEfficiency(address)
    ]);

    return calculateWalletRiskScore(riskFactors);
  };

  const analyzeSocialRisk = async (address: string, connections: SocialConnections) => {
    // Analyze social signals
    const signals = await Promise.all([
      checkTwitterMentions(address, connections.twitter),
      checkDiscordActivity(address, connections.discord),
      checkTelegramSignals(address, connections.telegram),
      checkGithubActivity(address, connections.github)
    ]);

    return calculateSocialRiskScore(signals);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, platform: keyof SocialConnections) => {
    e.preventDefault();
    const value = e.target.value;
    setSocialConnections(prev => ({
      ...prev,
      [platform]: value
    }));
  };

  const verifyTwitter = async () => {
    if (!socialConnections.twitter) {
      toast.error('Please enter a Twitter username');
      return;
    }

    setLoading(true);
    try {
      const username = socialConnections.twitter.replace('@', '');
      const response = await fetch(`/api/twitter/verify/${username}`);
      const result = await response.json();

      if (result.success) {
        toast.success('Twitter account verified!');
        setSocialConnections(prev => ({
          ...prev,
          twitterVerified: true,
          twitterData: result.userData,
          twitterRisk: result.riskMetrics
        }));
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Twitter verification error:', error);
      toast.error('Failed to verify Twitter account');
    } finally {
      setLoading(false);
    }
  };

  const verifyDiscord = async (username?: string) => {
    if (!username) return;
    
    const result = await verifyDiscordAccount(username);
    if (result.success) {
      toast.success(result.message);
      setSocialConnections(prev => ({
        ...prev,
        discord: username,
        discordVerified: true,
        discordData: result.userData
      }));
    } else {
      toast.error(result.message);
    }
  };

  const verifyTelegram = async (username?: string) => {
    if (!username) return;
    
    const result = await verifyTelegramAccount(username);
    if (result.success) {
      toast.success(result.message);
      setSocialConnections(prev => ({
        ...prev,
        telegram: username,
        telegramVerified: true,
        telegramData: result.userData
      }));
    } else {
      toast.error(result.message);
    }
  };

  const SocialConnectionModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96 max-w-[90%]">
        <h3 className="text-xl font-bold mb-4">Connect Accounts to Analyze</h3>
        
        {/* Wallet Connection */}
        <div className="mb-6">
          <button
            onClick={login}
            className="w-full flex items-center justify-center gap-2 bg-purple-600 text-white px-4 py-3 rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Image
              src="/icons/privy-logo.svg"
              alt="Privy"
              width={24}
              height={24}
              className="rounded-full"
            />
            {authenticated ? 'Wallet Connected' : 'Connect Wallet'}
          </button>
        </div>

        {/* Twitter/X Connection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Twitter/X Username</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/icons/twitter-x.svg"
                  alt="Twitter/X"
                  width={20}
                  height={20}
                />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border rounded bg-white text-black outline-none"
                placeholder="@username"
                value={socialConnections.twitter}
                onChange={(e) => handleInputChange(e, 'twitter')}
                maxLength={15}
              />
            </div>
            <button 
              className={`px-4 py-2 rounded flex items-center gap-2 ${
                socialConnections.twitterVerified 
                  ? 'bg-green-500 text-white' 
                  : 'bg-black text-white'
              }`}
              onClick={verifyTwitter}
              disabled={loading || !socialConnections.twitter}
            >
              {loading ? 'Verifying...' : socialConnections.twitterVerified ? '✓ Verified' : 'Verify'}
            </button>
          </div>
        </div>

        {/* Discord Connection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Discord Username</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/icons/discord.svg"
                  alt="Discord"
                  width={20}
                  height={20}
                />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border rounded bg-white text-black outline-none"
                placeholder="username#0000"
                value={socialConnections.discord}
                onChange={(e) => handleInputChange(e, 'discord')}
                maxLength={37}
              />
            </div>
            <button 
              className="bg-indigo-600 text-white px-4 py-2 rounded"
              disabled={loading || !socialConnections.discord}
            >
              Verify
            </button>
          </div>
        </div>

        {/* Telegram Connection */}
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Telegram Username</label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
                <Image
                  src="/icons/telegram.svg"
                  alt="Telegram"
                  width={20}
                  height={20}
                />
              </div>
              <input
                type="text"
                className="w-full pl-10 pr-3 py-2 border rounded bg-white text-black outline-none"
                placeholder="@username"
                value={socialConnections.telegram}
                onChange={(e) => handleInputChange(e, 'telegram')}
                maxLength={32}
              />
            </div>
            <button 
              className="bg-blue-500 text-white px-4 py-2 rounded"
              disabled={loading || !socialConnections.telegram}
            >
              Verify
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-2 mt-6">
          <button
            className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300 transition-colors"
            onClick={() => setShowSocialModal(false)}
          >
            Skip
          </button>
          <button
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"
            onClick={() => {
              if (!authenticated) {
                toast.error('Please connect your wallet first');
                return;
              }
              setShowSocialModal(false);
              connectAndAnalyze();
            }}
          >
            Continue Analysis
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-4">
      {!walletAddress ? (
        <div className="space-y-4">
          <button
            onClick={() => setShowSocialModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Start Risk Analysis
          </button>
        </div>
      ) : loading ? (
        <div className="animate-pulse">
          Analyzing your risk profile...
        </div>
      ) : riskProfile && (
        <div className="risk-dashboard">
          {/* Risk Score Display */}
          <div className="text-2xl font-bold mb-4">
            Risk Score: {riskProfile.overallRisk}/100
            <span className={`ml-2 ${getRiskColorClass(riskProfile.overallRisk)}`}>
              {getRiskLabel(riskProfile.overallRisk)}
            </span>
          </div>

          {/* Urgent Alerts */}
          {riskProfile.alerts.length > 0 && (
            <div className="bg-red-100 p-4 rounded mb-4">
              <h3 className="font-bold">⚠️ Risk Alerts</h3>
              <ul>
                {riskProfile.alerts.map((alert, i) => (
                  <li key={i}>{alert}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            {riskProfile.recommendations.map((rec, i) => (
              <button
                key={i}
                className="bg-green-500 text-white p-2 rounded"
                onClick={() => implementRecommendation(rec)}
              >
                {rec}
              </button>
            ))}
          </div>
        </div>
      )}

      {showSocialModal && <SocialConnectionModal />}

      {socialConnections.twitterVerified && socialConnections.twitterRisk && (
        <TwitterRiskMetrics riskMetrics={socialConnections.twitterRisk} />
      )}
    </div>
  );
};

// Risk Analysis Helper Functions
const checkLiquidityExposure = async (address: string) => {
  // Check exposure to low liquidity pools
  const response = await axios.get(`/api/defi/liquidity/${address}`);
  return response.data;
};

const checkRugPullExposure = async (address: string) => {
  // Check interaction with known rug pulls or high-risk protocols
  const response = await axios.get(`/api/security/rugpull/${address}`);
  return response.data;
};

const checkScamInteractions = async (address: string) => {
  // Check interactions with known scam contracts
  const response = await axios.get(`/api/security/scam/${address}`);
  return response.data;
};

const checkTradingBehavior = async (address: string) => {
  // Analyze trading patterns and risk behavior
  const response = await axios.get(`/api/trading/behavior/${address}`);
  return response.data;
};

const checkGasEfficiency = async (address: string) => {
  // Check if user is losing money on gas
  const response = await axios.get(`/api/gas/efficiency/${address}`);
  return response.data;
};

const calculateWalletRiskScore = (factors: any[]) => {
  // Implement risk scoring algorithm
  return factors.reduce((acc, factor) => acc + factor.riskWeight, 0);
};

const calculateSocialRiskScore = (signals: any[]) => {
  // Implement social signal scoring
  return signals.reduce((acc, signal) => acc + signal.riskWeight, 0);
};

const generateRiskProfile = (walletRisk: number, socialRisk: number): AutoRiskProfile => {
  const overallRisk = (walletRisk * 0.7) + (socialRisk * 0.3);
  
  return {
    walletRisk,
    socialRisk,
    overallRisk,
    recommendations: generateRecommendations(walletRisk, socialRisk),
    alerts: generateAlerts(walletRisk, socialRisk)
  };
};

// Social Analysis Functions
const checkTwitterMentions = async (address: string, username?: string) => {
  try {
    // For now, return a default low-risk score until Twitter API is set up
    return {
      riskWeight: 0.2,
      mentions: [],
      sentiment: 'neutral'
    };
  } catch (error) {
    console.error('Twitter analysis error:', error);
    return { riskWeight: 0.5 }; // Default medium risk on error
  }
};

const checkDiscordActivity = async (address: string, username?: string) => {
  try {
    // Default Discord activity check
    return {
      riskWeight: 0.1,
      activity: 'normal'
    };
  } catch (error) {
    console.error('Discord analysis error:', error);
    return { riskWeight: 0.3 };
  }
};

const checkTelegramSignals = async (address: string, username?: string) => {
  try {
    // Default Telegram signal check
    return {
      riskWeight: 0.1,
      signals: []
    };
  } catch (error) {
    console.error('Telegram analysis error:', error);
    return { riskWeight: 0.3 };
  }
};

const checkGithubActivity = async (address: string, username?: string) => {
  try {
    // Default Github activity check
    return {
      riskWeight: 0.1,
      activity: 'normal'
    };
  } catch (error) {
    console.error('Github analysis error:', error);
    return { riskWeight: 0.2 };
  }
};

// Helper function to get risk color
const getRiskColorClass = (risk: number): string => {
  if (risk < 30) return 'text-green-500';
  if (risk < 70) return 'text-yellow-500';
  return 'text-red-500';
};

// Helper function to get risk label
const getRiskLabel = (risk: number): string => {
  if (risk < 30) return 'Low Risk';
  if (risk < 70) return 'Medium Risk';
  return 'High Risk';
};

// Helper function to generate recommendations
const generateRecommendations = (walletRisk: number, socialRisk: number): string[] => {
  const recommendations: string[] = [];
  
  if (walletRisk > 50) {
    recommendations.push('Diversify your portfolio');
    recommendations.push('Review high-risk protocols');
  }
  
  if (socialRisk > 50) {
    recommendations.push('Enable 2FA on all accounts');
    recommendations.push('Review social media security');
  }
  
  return recommendations;
};

// Helper function to generate alerts
const generateAlerts = (walletRisk: number, socialRisk: number): string[] => {
  const alerts: string[] = [];
  
  if (walletRisk > 70) {
    alerts.push('⚠️ High wallet risk detected');
  }
  
  if (socialRisk > 70) {
    alerts.push('⚠️ Suspicious social activity detected');
  }
  
  return alerts;
};

// Helper function to implement recommendations
const implementRecommendation = (recommendation: string) => {
  console.log(`Implementing recommendation: ${recommendation}`);
  // Add implementation logic here
};

export default RiskAssessment;
