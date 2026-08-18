import dotenv from 'dotenv';
dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required environment variable: ${name}`);
  return v;
}

export const DISCORD_TOKEN = required('DISCORD_TOKEN');
export const CLIENT_ID = process.env.CLIENT_ID || '';
export const PREFIX = process.env.PREFIX || '!';
export const LAVALINK_HOST = process.env.LAVALINK_HOST || 'localhost';
export const LAVALINK_PORT = Number(process.env.LAVALINK_PORT || '2333');
export const LAVALINK_PASSWORD = process.env.LAVALINK_PASSWORD || 'youshallnotpass';
export const PORT = Number(process.env.PORT || '3000');
export const DATABASE_URL = process.env.DATABASE_URL || process.env.MONGO_URI || '';
