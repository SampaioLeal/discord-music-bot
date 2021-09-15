import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  getVoiceConnection,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import { Readable } from 'stream';
import ytdl from 'ytdl-core';

interface QueueOptions {
  guildId: string;
  channelId: string;
}

interface Song {
  name: string;
  url: string;
}

export class Queue {
  guildId: string;
  channelId: string;
  songs: { name: string; url: string }[];
  playing: boolean;
  player: AudioPlayer;
  stream: Readable | null;

  constructor(options: QueueOptions) {
    this.stream = null;
    this.songs = [];
    this.playing = false;
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause,
      },
    });

    this.guildId = options.guildId;
    this.channelId = options.channelId;
  }

  get currentSong() {
    return this.songs[0];
  }

  push(song: Song) {
    this.songs.push(song);
    if (!this.playing) this.play();
  }

  skip() {
    this.stream?.destroy();
    this.player.stop();
    this.songs.shift();

    this.playing = false;
    this.stream = null;

    this.play();
  }

  disconnect() {
    const connection = getVoiceConnection(this.guildId);
    connection?.destroy();
  }

  // TODO: enviar mensagem de join: ":thumbsup: Joined g10 and bound to #canal"
  // TODO: enviar mensagem de tocando musga: "Playing :notes: Cristiano Ronaldo "Ambição" - Now!"
  play() {
    if (!this.playing && this.songs.length) {
      const stream = ytdl(this.currentSong.url, { filter: 'audioonly' });
      const resource = createAudioResource(stream);

      this.stream = stream;
      this.player.play(resource);

      this.player.once('stateChange', (oldState, newState) => {
        if (oldState.status === 'playing' && newState.status === 'idle') {
          this.skip();
        }
      });

      this.playing = true;

      stream.once('error', () => {
        this.skip();
      });
    }
  }
}
