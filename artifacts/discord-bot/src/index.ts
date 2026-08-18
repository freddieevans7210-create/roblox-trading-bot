import { Client, GatewayIntentBits } from 'discord.js';
import {
  DISCORD_TOKEN,
  LAVALINK_HOST,
  LAVALINK_PORT,
  LAVALINK_PASSWORD,
  PREFIX,
  PORT,
} from './config';
import { MusicPlayer } from './music-player';

async function main() {
  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits.DirectMessages,
      GatewayIntentBits.GuildVoiceStates,
    ],
  });

  client.once('ready', () => {
    console.log(`Logged in as ${client.user?.tag}`);
  });

  client.on('error', (err) => console.error('Client error', err));

  // Initialize music player (Lavalink)
  let musicPlayer: MusicPlayer | null = null;
  try {
    musicPlayer = new MusicPlayer(client, {
      host: LAVALINK_HOST,
      port: LAVALINK_PORT,
      password: LAVALINK_PASSWORD,
    });
    console.log('MusicPlayer initialized');
  } catch (err) {
    console.warn('Failed to initialize MusicPlayer (Lavalink may be unavailable):', err);
  }

  // Simple ping command (for smoke test)
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(PREFIX)) return;
    const [cmd, ...args] = message.content.slice(PREFIX.length).trim().split(/\s+/);
    if (cmd === 'ping') {
      await message.reply('Pong!');
    }
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log('Shutting down...');
    try {
      if (musicPlayer) {
        // no explicit destroy API; let process exit
      }
      await client.destroy();
    } catch (err) {
      console.error('Error during shutdown', err);
    } finally {
      process.exit(0);
    }
  };

  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);

  // Login
  try {
    await client.login(DISCORD_TOKEN);
  } catch (err) {
    console.error('Failed to login. Check DISCORD_TOKEN:', err);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal error during startup:', err);
  process.exit(1);
});
