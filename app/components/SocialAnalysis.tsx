'use client';

import React, { useState, useCallback } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { toast } from 'react-hot-toast';
import Image from 'next/image';

interface SocialInput {
  value: string;
  isVerified: boolean;
  isLoading: boolean;
}

interface SocialState {
  twitter: SocialInput;
  discord: SocialInput;
  telegram: SocialInput;
  wallet: boolean;
}

const SocialAnalysis = () => {
  const { login, authenticated, ready } = usePrivy();
  const [showModal, setShowModal] = useState(false);
  const [socials, setSocials] = useState<SocialState>({
    twitter: { value: '', isVerified: false, isLoading: false },
    discord: { value: '', isVerified: false, isLoading: false },
    telegram: { value: '', isVerified: false, isLoading: false },
    wallet: false
  });

  // Check if at least one verification is complete
  const hasMinimumVerification = () => {
    return authenticated || 
           socials.twitter.isVerified || 
           socials.discord.isVerified || 
           socials.telegram.isVerified;
  };

  const handleWalletConnect = useCallback(async () => {
    try {
      if (!ready) {
        toast.error('Wallet connection not ready');
        return;
      }
      await login();
      setSocials(prev => ({ ...prev, wallet: true }));
      toast.success('Wallet connected successfully!');
    } catch (error) {
      console.error('Wallet connection error:', error);
      toast.error('Failed to connect wallet');
    }
  }, [login, ready]);

  const updateSocialValue = (platform: keyof Omit<SocialState, 'wallet'>, value: string) => {
    setSocials(prev => ({
      ...prev,
      [platform]: { ...prev[platform], value }
    }));
  };

  const verifySocial = useCallback(async (platform: keyof Omit<SocialState, 'wallet'>) => {
    if (!socials[platform].value) {
      toast.error(`Please enter a ${platform} username`);
      return;
    }

    setSocials(prev => ({
      ...prev,
      [platform]: { ...prev[platform], isLoading: true }
    }));

    try {
      if (platform === 'twitter') {
        const username = socials.twitter.value.replace('@', '');
        console.log('Verifying Twitter username:', username); // Debug log

        const response = await fetch(`/api/twitter/verify/${username}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        console.log('Twitter verification result:', result); // Debug log
        
        if (result.success) {
          toast.success('Twitter verified!');
          setSocials(prev => ({
            ...prev,
            twitter: { ...prev.twitter, isVerified: true, isLoading: false }
          }));
        } else {
          toast.error(result.message || 'Verification failed');
        }
      }
    } catch (error) {
      console.error(`${platform} verification error:`, error);
      toast.error(`Failed to verify ${platform}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSocials(prev => ({
        ...prev,
        [platform]: { ...prev[platform], isLoading: false }
      }));
    }
  }, [socials]);

  const handleContinueAnalysis = () => {
    if (!hasMinimumVerification()) {
      toast.error('Please verify at least one account or connect wallet to continue');
      return;
    }
    
    // Create analysis summary
    const verifiedAccounts = [
      authenticated && 'Wallet',
      socials.twitter.isVerified && 'Twitter',
      socials.discord.isVerified && 'Discord',
      socials.telegram.isVerified && 'Telegram'
    ].filter(Boolean);

    toast.success(`Analyzing with: ${verifiedAccounts.join(', ')}`);
    setShowModal(false);
    // Continue with analysis using verified accounts
  };

  const AnalysisModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-[400px] max-w-[90vw] space-y-6">
        <h2 className="text-xl font-bold text-center">Connect Accounts to Analyze</h2>
        <p className="text-sm text-gray-500 text-center">
          Connect at least one account or wallet to continue
        </p>
        
        {/* Wallet Connection */}
        <button
          onClick={handleWalletConnect}
          disabled={!ready}
          className={`w-full rounded-lg py-3 font-medium transition-colors flex items-center justify-center gap-2
            ${authenticated 
              ? 'bg-green-500 text-white' 
              : !ready 
                ? 'bg-gray-300 cursor-not-allowed'
                : 'bg-purple-600 text-white hover:bg-purple-700'}`}
        >
          <Image src="/icons/privy-logo.svg" alt="Wallet" width={20} height={20} />
          {authenticated ? '✓ Wallet Connected' : !ready ? 'Loading...' : 'Connect Wallet'}
        </button>

        {/* Social Inputs */}
        <div className="space-y-4">
          {/* Twitter */}
          <div>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
              <Image src="/icons/twitter-x.svg" alt="Twitter" width={20} height={20} />
              <input
                type="text"
                value={socials.twitter.value}
                onChange={e => updateSocialValue('twitter', e.target.value)}
                placeholder="@username"
                className="flex-1 outline-none text-black bg-transparent"
              />
              <button
                onClick={() => verifySocial('twitter')}
                disabled={socials.twitter.isLoading || socials.twitter.isVerified}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  socials.twitter.isVerified
                    ? 'bg-green-500 text-white'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {socials.twitter.isLoading ? '...' : socials.twitter.isVerified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Discord */}
          <div>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
              <Image src="/icons/discord.svg" alt="Discord" width={20} height={20} />
              <input
                type="text"
                value={socials.discord.value}
                onChange={e => updateSocialValue('discord', e.target.value)}
                placeholder="username#0000"
                className="flex-1 outline-none text-black bg-transparent"
              />
              <button
                onClick={() => verifySocial('discord')}
                disabled={socials.discord.isLoading || socials.discord.isVerified}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  socials.discord.isVerified
                    ? 'bg-green-500 text-white'
                    : 'bg-indigo-600 text-white hover:bg-indigo-700'
                }`}
              >
                {socials.discord.isLoading ? '...' : socials.discord.isVerified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
          </div>

          {/* Telegram */}
          <div>
            <div className="flex items-center gap-3 p-3 border rounded-lg bg-white">
              <Image src="/icons/telegram.svg" alt="Telegram" width={20} height={20} />
              <input
                type="text"
                value={socials.telegram.value}
                onChange={e => updateSocialValue('telegram', e.target.value)}
                placeholder="@username"
                className="flex-1 outline-none text-black bg-transparent"
              />
              <button
                onClick={() => verifySocial('telegram')}
                disabled={socials.telegram.isLoading || socials.telegram.isVerified}
                className={`px-4 py-1.5 rounded-lg text-sm font-medium ${
                  socials.telegram.isVerified
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
              >
                {socials.telegram.isLoading ? '...' : socials.telegram.isVerified ? '✓ Verified' : 'Verify'}
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleContinueAnalysis}
            className={`px-4 py-2 rounded-lg transition-colors ${
              hasMinimumVerification()
                ? 'bg-green-500 text-white hover:bg-green-600'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continue Analysis
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Start Risk Analysis
      </button>
      {showModal && <AnalysisModal />}
    </div>
  );
};

export default SocialAnalysis; 