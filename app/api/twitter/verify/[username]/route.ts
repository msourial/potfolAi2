import { NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(
  request: Request,
  { params }: { params: { username: string } }
) {
  try {
    console.log('Verifying username:', params.username); // Debug log

    const username = params.username;
    const TWITTER_BEARER_TOKEN = process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN;

    if (!TWITTER_BEARER_TOKEN) {
      throw new Error('Twitter Bearer Token is not configured');
    }

    // Get user data
    const userResponse = await axios.get(
      `https://api.twitter.com/2/users/by/username/${username}`,
      {
        headers: {
          'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
        },
        params: {
          'user.fields': 'public_metrics,created_at,description,verified'
        }
      }
    );

    console.log('Twitter API response:', userResponse.data); // Debug log

    if (userResponse.data.data) {
      // Get user's recent tweets
      const userId = userResponse.data.data.id;
      const tweetsResponse = await axios.get(
        `https://api.twitter.com/2/users/${userId}/tweets`,
        {
          headers: {
            'Authorization': `Bearer ${TWITTER_BEARER_TOKEN}`,
          },
          params: {
            max_results: 10,
            'tweet.fields': 'public_metrics,created_at,context_annotations'
          }
        }
      );

      const userData = {
        ...userResponse.data.data,
        recentTweets: tweetsResponse.data.data || []
      };

      // Calculate risk metrics
      const accountAge = Math.floor(
        (Date.now() - new Date(userData.created_at).getTime()) / (1000 * 60 * 60 * 24)
      );

      const riskMetrics = {
        riskScore: calculateRiskScore(userData, accountAge),
        metrics: {
          accountAge,
          engagementRate: calculateEngagementRate(userData),
          followerCount: userData.public_metrics.followers_count,
          tweetCount: userData.public_metrics.tweet_count,
          isVerified: userData.verified || false
        }
      };

      return NextResponse.json({
        success: true,
        userData,
        riskMetrics,
        message: 'Twitter account verified successfully'
      });
    }

    return NextResponse.json({
      success: false,
      message: 'Twitter account not found'
    });

  } catch (error: any) {
    console.error('Twitter API error:', error.response?.data || error);
    return NextResponse.json({
      success: false,
      message: error.response?.data?.errors?.[0]?.message || 'Failed to verify Twitter account'
    }, { status: 500 });
  }
}

function calculateRiskScore(userData: any, accountAge: number): number {
  let score = 50;

  // Account age factors
  if (accountAge > 365) score -= 15;
  if (accountAge < 30) score += 25;

  // Follower factors
  if (userData.public_metrics.followers_count > 1000) score -= 10;
  if (userData.public_metrics.followers_count === 0) score += 20;

  // Tweet activity factors
  if (userData.public_metrics.tweet_count > 100) score -= 5;
  if (userData.public_metrics.tweet_count === 0) score += 15;

  // Verification status
  if (userData.verified) score -= 20;

  return Math.max(0, Math.min(100, score));
}

function calculateEngagementRate(userData: any): number {
  const { followers_count } = userData.public_metrics;
  if (!followers_count) return 0;

  const totalEngagements = userData.recentTweets?.reduce((acc: number, tweet: any) => {
    const metrics = tweet.public_metrics;
    return acc + (metrics.retweet_count + metrics.like_count + metrics.reply_count);
  }, 0) || 0;

  return totalEngagements / (followers_count * Math.min(userData.recentTweets?.length || 1, 1));
} 