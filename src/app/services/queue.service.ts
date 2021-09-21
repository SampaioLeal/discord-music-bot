import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  NoSubscriberBehavior,
  VoiceConnection
} from '@discordjs/voice'
import { Readable } from 'stream'
import ytdl from 'ytdl-core'
import { CurrentSongData, SongData } from '@typings/queue.type'
import { Null, Undefined } from '@typings/generic.type'
import { StatusEnum } from '@app/enums/status.enum'
import { Logger } from '@logger'

class QueueService {
  private static instance: QueueService
  private logger = new Logger(QueueService.name)

  private songs: SongData[]
  private player: AudioPlayer
  private stream: Null<Readable>
  private voiceChannel: Undefined<VoiceConnection>
  private status: StatusEnum
  private elapsedTime = 0
  private timeCounter: Undefined<NodeJS.Timer>

  private constructor() {
    this.status = StatusEnum.IDLE
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
    if (!QueueService.instance) {
      QueueService.instance = new QueueService()
    }
    return QueueService.instance
  }

  public getStatus() {
    return this.status
  }

  public setStatus(status: StatusEnum) {
    this.status = status
  }

  public setVoiceChannel(connection: VoiceConnection) {
    connection.subscribe(this.player)
    this.voiceChannel = connection
  }

  public disconnectVoice() {
    this.clearSongList()
    this.stop()
    if (this.voiceChannel) return this.voiceChannel.disconnect()
    this.status = StatusEnum.IDLE
  }

  public clearSongList() {
    this.songs = []
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
    this.stop()
    this.songs.shift()

    this.status = StatusEnum.WAITING_MUSIC
    this.stream = null

    this.play()
  }

  play() {
    if (this.status !== StatusEnum.PLAYING) {
      if (this.songs.length) {
        this.resetTime()
        const currentSong = this.songs[0]
        const stream = ytdl(currentSong.url, {
          filter: 'audioonly',
          quality: 'highestaudio',
          highWaterMark: 1048576 * 32
        })
        const resource = createAudioResource(stream)

        this.stream = stream
        this.player.play(resource)
        this.status = StatusEnum.PLAYING
        this.timeCounter = setInterval(() => {
          if (currentSong.duration > this.elapsedTime) {
            this.elapsedTime++
          }
        }, 1000)

        stream.once('error', (d) => {
          this.logger.error(d, d.stack)
          this.resetTime()
          this.skip()
        })
      } else {
        this.logger.info('A fila está vazia!')
      }
    }
  }

  stop() {
    this.status = StatusEnum.WAITING_MUSIC
    this.stream?.destroy()
    this.player.stop()
  }

  pause() {
    this.status = StatusEnum.MUSIC_PAUSED
    this.player.pause()
  }

  resume() {
    this.status = StatusEnum.PLAYING
    this.player.unpause()
  }

  clearSongInQueue() {
    this.songs.splice(1)
  }

  private resetTime() {
    this.elapsedTime = 0
    if (this.timeCounter) clearInterval(this.timeCounter)
  }
}

export default QueueService
