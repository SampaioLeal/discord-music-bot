interface Queue {
  guildId: string;
  channelId: string;
  songs: { name: string; url: string }[];
  playing: boolean;
  player: import('@discordjs/voice').AudioPlayer;
  stream: import('stream').Readable | null;
}
