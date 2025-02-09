import axios from 'axios';
import { API_KEYS } from './api-config';

interface VerificationResponse {
  success: boolean;
  message: string;
  userData?: any;
}

// Initialize Twitter API client with your token
const twitterClient = axios.create({
  baseURL: 'https://api.twitter.com/2',
  headers: {
    'Authorization': 'Bearer AAAAAAAAAAAAAAAAAAAAAMiJywEAAAAALGS0QMh2W2Pfh89waQ3WuW9t0gE%3DaRN8kUVJ7AFU5XhZHBwpObD48pNxHwD5GVTx9o0P79Cp4pDc7a',
    'Content-Type': 'application/json',
  }
});

// Twitter/X Verification
export const verifyTwitterAccount = async (username: string): Promise<VerificationResponse> => {
  try {
    // Remove @ if present in username
    const cleanUsername = username.replace('@', '');
    
    // Get user data
    const response = await twitterClient.get(`/users/by/username/${cleanUsername}`, {
      params: {
        'user.fields': 'public_metrics,created_at,description,verified'
      }
    });

    if (response.data.data) {
      // Get user's recent tweets
      const userId = response.data.data.id;
      const tweetsResponse = await twitterClient.get(`/users/${userId}/tweets`, {
        params: {
          max_results: 10,
          'tweet.fields': 'public_metrics,created_at,context_annotations'
        }
      });

      const userData = {
        ...response.data.data,
        recentTweets: tweetsResponse.data.data || []
      };

      // Calculate risk metrics
      const riskMetrics = calculateTwitterRiskMetrics(userData);

      return {
        success: true,
        message: 'Twitter account verified successfully',
        userData: userData,
        riskMetrics: riskMetrics
      };
    }
    
    return {
      success: false,
      message: 'Twitter account not found'
    };
  } catch (error: any) {
    console.error('Twitter verification error:', error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.errors?.[0]?.message || 'Failed to verify Twitter account'
    };
  }
};

// Helper function to calculate risk metrics
const calculateTwitterRiskMetrics = (userData: any) => {
  const {
    public_metrics,
    created_at,
    verified,
    recentTweets
  } = userData;

  // Account age in days
  const accountAge = Math.floor((Date.now() - new Date(created_at).getTime()) / (1000 * 60 * 60 * 24));
  
  // Engagement rate
  const engagementRate = recentTweets.reduce((acc: number, tweet: any) => {
    const metrics = tweet.public_metrics;
    return acc + (
      (metrics.retweet_count + metrics.like_count + metrics.reply_count) / 
      public_metrics.followers_count
    );
  }, 0) / recentTweets.length;

  // Calculate risk score (0-100, lower is better)
  let riskScore = 50; // Base score

  // Adjust based on metrics
  if (verified) riskScore -= 20;
  if (accountAge > 365) riskScore -= 15;
  if (public_metrics.followers_count > 1000) riskScore -= 10;
  if (engagementRate > 0.01) riskScore -= 5;

  // Add risk if suspicious patterns found
  if (public_metrics.followers_count === 0) riskScore += 20;
  if (recentTweets.length === 0) riskScore += 15;
  if (accountAge < 30) riskScore += 25;

  return {
    riskScore: Math.max(0, Math.min(100, riskScore)),
    metrics: {
      accountAge,
      engagementRate,
      followerCount: public_metrics.followers_count,
      tweetCount: public_metrics.tweet_count,
      isVerified: verified
    },
    riskLevel: riskScore < 30 ? 'Low' : riskScore < 70 ? 'Medium' : 'High'
  };
};

// Test the implementation
const testTwitterVerification = async () => {
  try {
    const result = await verifyTwitterAccount('elonmusk'); // Test with a known account
    console.log('Verification result:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Test failed:', error);
  }
};

// Uncomment to test
// testTwitterVerification();

export default verifyTwitterAccount;

// Discord Verification
export const verifyDiscordAccount = async (username: string): Promise<VerificationResponse> => {
  try {
    // Discord requires OAuth2 for user verification
    const response = await axios.get(
      `${DISCORD_API_BASE}/users/@me`,
      {
        headers: {
          'Authorization': `Bot ${API_KEYS.DISCORD}`
        }
      }
    );

    if (response.data) {
      return {
        success: true,
        message: 'Discord account verified successfully',
        userData: response.data
      };
    }

    return {
      success: false,
      message: 'Discord account not found'
    };
  } catch (error) {
    console.error('Discord verification error:', error);
    return {
      success: false,
      message: 'Failed to verify Discord account'
    };
  }
};

// Telegram Verification
export const verifyTelegramAccount = async (username: string): Promise<VerificationResponse> => {
  try {
    // Telegram Bot API to verify user
    const response = await axios.get(
      `https://api.telegram.org/bot${API_KEYS.TELEGRAM}/getChat`,
      {
        params: {
          chat_id: `@${username.replace('@', '')}`
        }
      }
    );

    if (response.data.ok) {
      return {
        success: true,
        message: 'Telegram account verified successfully',
        userData: response.data.result
      };
    }

    return {
      success: false,
      message: 'Telegram account not found'
    };
  } catch (error) {
    console.error('Telegram verification error:', error);
    return {
      success: false,
      message: 'Failed to verify Telegram account'
    };
  }
}; 