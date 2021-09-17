import { Message } from 'discord.js'
import { joinVoiceChannel } from '@discordjs/voice'
import { Logger } from '@logger'
import { Status } from '@enums/status'
import Queue from '@app/queue'

abstract class AbstractCommand {
  abstract processMessage(message: Message): Promise<void>

  private _logger = new Logger(AbstractCommand.name)
  private queue = Queue.getInstance()

  protected getQueue = () => this.queue

  protected joinChannel(message: Message) {
    if (this.queue.getStatus() !== Status.IDLE) {
      this._logger.warn('Já está em um canal')
      return
    }

    const userVoiceChannel = message.member?.voice.channel
    if (!userVoiceChannel) {
      this._logger.error('Usuário não está em nenhum canal')
      message.channel.send('É necessário está em um canal de voz')
      return
    }
    const guild = userVoiceChannel.guild

    this._logger.info(`Entrando no canal: ${userVoiceChannel.name}`)
    const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    this.queue.setVoiceChannel(connection)
    this.queue.setStatus(Status.WAITING_MUSIC)
  }
}

export default AbstractCommand
