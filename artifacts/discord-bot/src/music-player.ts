import {
  Client,
  VoiceChannel,
  Collection,
  GuildMember,
  TextChannel,
} from "discord.js";
import { Lavalink } from "lavalink-client";

interface GuildMusicState {
  currentTrackTitle: string | null;
}

export class MusicPlayer {
  private client: Client;
  private lavalink: Lavalink;
  private guildStates: Collection<string, GuildMusicState> = new Collection();

  constructor(client: Client, lavalinkOptions: any) {
    this.client = client;
    this.lavalink = new Lavalink({
      ...lavalinkOptions,
      clientID: client.user?.id || "",
      clientName: "roblox-trader-bot",
      autoResume: true,
    });

    this.setupEventListeners();
  }

  private setupEventListeners() {
    this.lavalink.on("trackStart", (player, track) => {
      this.updateVoiceChannelStatus(player.guildId, track);
    });

    this.lavalink.on("trackEnd", (player) => {
      this.updateVoiceChannelStatus(player.guildId, null);
    });

    this.lavalink.on("queueEnd", (player) => {
      this.updateVoiceChannelStatus(player.guildId, null);
    });

    this.lavalink.on("trackError", (player) => {
      this.updateVoiceChannelStatus(player.guildId, null);
    });
  }

  /**
   * Updates the voice channel status with current track title
   * Prevents duplicate updates by tracking the last known track
   */
  private async updateVoiceChannelStatus(
    guildId: string,
    track: any | null
  ): Promise<void> {
    try {
      const guild = this.client.guilds.cache.get(guildId);
      if (!guild) return;

      // Get or create guild state
      let state = this.guildStates.get(guildId);
      if (!state) {
        state = { currentTrackTitle: null };
        this.guildStates.set(guildId, state);
      }

      // Determine new status
      const newStatus = track
        ? this.formatTrackTitle(track.info.title, track.info.author)
        : null;

      // Only update if status changed (prevent duplicates)
      if (state.currentTrackTitle === newStatus) {
        return;
      }

      // Update state
      state.currentTrackTitle = newStatus;

      // Get the voice channel
      const voiceChannels = guild.channels.cache.filter(
        (channel) => channel.isVoiceBased()
      );

      for (const [, channel] of voiceChannels) {
        if (channel.isVoiceBased() && channel instanceof VoiceChannel) {
          try {
            if (newStatus) {
              await channel.setStatus(newStatus);
            } else {
              await channel.setStatus("");
            }
          } catch (error) {
            console.error(
              `Failed to update status for channel ${channel.id}:`,
              error
            );
          }
        }
      }
    } catch (error) {
      console.error(`Error updating voice channel status for guild ${guildId}:`, error);
    }
  }

  /**
   * Formats track title and author into a status string
   */
  private formatTrackTitle(title: string, author: string): string {
    const maxLength = 100; // Discord voice status limit
    let fullTitle = `🎵 ${author} - ${title}`;

    if (fullTitle.length > maxLength) {
      const truncated = fullTitle.substring(0, maxLength - 3) + "...";
      return truncated;
    }

    return fullTitle;
  }

  /**
   * Play a track
   */
  async play(
    guildId: string,
    voiceChannel: VoiceChannel,
    track: any
  ): Promise<void> {
    try {
      const player = await this.lavalink.create({
        guild: guildId,
        voiceChannel: voiceChannel.id,
        textChannel: voiceChannel.guild.systemChannel?.id,
      });

      await player.play({ track });
    } catch (error) {
      console.error("Error playing track:", error);
      throw error;
    }
  }

  /**
   * Skip current track
   */
  async skip(guildId: string): Promise<void> {
    const player = this.lavalink.players.get(guildId);
    if (player) {
      await player.skip();
    }
  }

  /**
   * Stop playback and clear state
   */
  async stop(guildId: string): Promise<void> {
    const player = this.lavalink.players.get(guildId);
    if (player) {
      await player.stop();
      // Clear the tracked status for this guild
      const state = this.guildStates.get(guildId);
      if (state) {
        state.currentTrackTitle = null;
      }
    }
  }

  /**
   * Get current Lavalink instance
   */
  getLavalink(): Lavalink {
    return this.lavalink;
  }

  /**
   * Get player for guild
   */
  getPlayer(guildId: string) {
    return this.lavalink.players.get(guildId);
  }
}
