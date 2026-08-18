# Roblox Trader Bot - Music Player

A Discord bot with integrated Lavalink music player that updates voice channel status with the currently playing song.

## Features

✨ **Voice Channel Status Updates**
- Automatically updates the voice channel status to display the currently playing song
- Prevents duplicate updates by tracking the last known track
- Displays song title in format: `🎵 Artist - Song Title`

🎵 **Music Commands**
- `/play <query>` - Play a song from YouTube
- `/skip` - Skip to the next track
- `/stop` - Stop playback and clear the queue

🚀 **Lavalink Integration**
- Full Lavalink support for high-quality music playback
- Auto-resume capability
- Error handling and recovery

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Lavalink

Make sure you have a running Lavalink server. You can run it locally or use a hosted instance:

```bash
# Option 1: Local Lavalink (requires Java)
# Download from: https://github.com/lavalink-devs/Lavalink/releases

# Option 2: Use a public Lavalink node or host your own
```

### 3. Configure Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

**Required Variables:**
- `DISCORD_TOKEN` - Your Discord bot token
- `CLIENT_ID` - Your Discord application ID
- `LAVALINK_HOST` - Lavalink server host (default: localhost)
- `LAVALINK_PORT` - Lavalink server port (default: 2333)
- `LAVALINK_PASSWORD` - Lavalink server password

### 4. Get Discord Bot Token

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and click "Add Bot"
4. Copy the token to your `.env` file
5. Enable these intents:
   - Guilds
   - Guild Messages
   - Message Content
   - Direct Messages
   - Guild Voice States

### 5. Run the Bot

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm run build
npm start
```

## How It Works

### Voice Channel Status Updates

The bot automatically updates the voice channel status when:
- A track starts playing → Shows `🎵 Artist - Song Title`
- A track ends or queue finishes → Clears status
- An error occurs → Clears status

**Duplicate Prevention:**
- The bot tracks the last known track title per guild
- Status is only updated if the track actually changes
- This prevents unnecessary API calls and status flickering

### Example Flow

```
User: /play Never Gonna Give You Up
Bot: ✅ Now playing: Rick Astley - Never Gonna Give You Up
[Voice channel status updates to: 🎵 Rick Astley - Never Gonna Give You Up]

User: /skip
Bot: ⏭️ Skipped to the next track!
[Voice channel status updates to new song]

User: /stop
Bot: ⏹️ Music stopped and queue cleared!
[Voice channel status clears]
```

## Architecture

### MusicPlayer Class

Main class that handles:
- Lavalink connection and player management
- Event listeners for track changes
- Voice channel status updates
- Duplicate prevention logic

### Commands

Each command is in its own file:
- `commands/play.ts` - Search and play music
- `commands/skip.ts` - Skip current track
- `commands/stop.ts` - Stop playback

### Event Flow

```
trackStart event → Check if title changed → Update voice status if different
trackEnd event → Clear status (title changed to null)
queueEnd event → Clear status
trackError event → Clear status
```

## Troubleshooting

### Bot won't connect to voice channel
- Make sure bot has "Connect" permission in voice channels
- Check Lavalink server is running and accessible

### Status not updating
- Check bot has "Manage Channel" permission
- Verify Lavalink connection is established
- Check console for error messages

### Duplicate status updates
- This is prevented by the `GuildMusicState` tracking
- If you see duplicates, check for race conditions in event handling

## Dependencies

- `discord.js` - Discord API library
- `lavalink-client` - Lavalink client library
- `dotenv` - Environment variable management
- `typescript` - TypeScript compiler
