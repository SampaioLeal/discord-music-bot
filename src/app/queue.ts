import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnection
} from '@discordjs/voice'
import { Readable } from 'stream'
import ytdl from 'ytdl-core'
import { CurrentSongData, SongData } from '@typings/queue'
import { Undefined } from '@typings/genericTypes'
import { Status } from '@enums/status'
import { Logger } from '@logger'

class Queue {
  private static instance: Queue
  private logger = new Logger(Queue.name)

  private songs: SongData[]
  private player: AudioPlayer
  private stream: Readable | null
  private voiceChannel: Undefined<VoiceConnection>
  private status: Status
  private elapsedTime = 0

  private constructor() {
    this.status = Status.IDLE
    this.stream = null
    this.songs = []
    this.player = createAudioPlayer({
      behaviors: {
        noSubscriber: NoSubscriberBehavior.Pause
      }
    })

    this.player.on('stateChange', (oldState, newState) => {
      if (oldState.status === 'playing' && newState.status === 'idle') {
        this.skip()
      }
    })
  }

  public static getInstance() {
    if (!Queue.instance) {
      Queue.instance = new Queue()
    }
    return Queue.instance
  }

  public getStatus() {
    return this.status
  }

  public setStatus(status: Status) {
    this.status = status
  }

  public setVoiceChannel(connection: VoiceConnection) {
    connection.subscribe(this.player)
    this.voiceChannel = connection
  }

  public disconnectVoice() {
    if (this.voiceChannel) return this.voiceChannel.disconnect()
  }

  public getCurrentSong(): CurrentSongData {
    return {
      ...this.songs[0],
      elapsedTime: this.elapsedTime
    }
  }

  public getListSong() {
    return this.songs
  }

  addSong(song: SongData) {
    this.logger.info(`Adicionando musica: ${song.name}`)
    this.songs.push(song)
  }

  skip() {
    this.logger.info('Pulando para a proxima música')
    this.stream?.destroy()
    this.player.stop()
    this.songs.shift()

    this.status = Status.WAITING_MUSIC
    this.stream = null

    this.play()
  }

  play() {
    if (this.status === Status.MUSIC_PAUSED) {
      this.status = Status.PLAYING
      this.player.unpause()
      return
    }
    if (this.status !== Status.PLAYING) {
      if (this.songs.length) {
        this.elapsedTime = 0
        const currentSong = this.songs[0]
        const stream = ytdl(currentSong.url, { filter: 'audioonly' })
        const resource = createAudioResource(stream)

        this.stream = stream
        this.player.play(resource)
        this.status = Status.PLAYING
        const interval = setInterval(() => {
          if (currentSong.duration > this.elapsedTime) {
            this.elapsedTime++
          }
        }, 1000)

        stream.once('error', (d) => {
          clearInterval(interval)
          this.skip()
        })
      } else {
        this.logger.info('Queue is empty!')
      }
    }
  }

  pause() {
    this.status = Status.MUSIC_PAUSED
    this.player.pause()
  }

  resume() {
    this.status = Status.PLAYING
    this.player.unpause()
  }
}

export default Queue
