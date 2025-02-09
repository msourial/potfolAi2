export const TWITTER_API_BASE = 'https://api.twitter.com/2';
export const DISCORD_API_BASE = 'https://discord.com/api/v10';
export const TELEGRAM_API_BASE = 'https://api.telegram.org/bot';

export const API_KEYS = {
  TWITTER: process.env.NEXT_PUBLIC_TWITTER_BEARER_TOKEN,
  DISCORD: process.env.NEXT_PUBLIC_DISCORD_TOKEN,
  TELEGRAM: process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN,
  GITHUB: process.env.NEXT_PUBLIC_GITHUB_TOKEN
}; 