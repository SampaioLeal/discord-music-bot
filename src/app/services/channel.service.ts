import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'
import { joinVoiceChannel } from '@discordjs/voice'
import { Logger } from '@logger'
import QueueService from '@app/services/queue.service'
import { Null } from '@typings/generic.type'

class ChannelService {
  private logger = new Logger(ChannelService.name)
  private queue: Null<QueueService> = null

  joinChannel(message: Message) {
    const queue = this.getQueueOrThrow()
    if (queue.getStatus() !== StatusEnum.IDLE) {
      this.logger.warn('Já está em um canal')
      return false
    }

    const userVoiceChannel = message.member?.voice.channel
    if (!userVoiceChannel) {
      this.logger.error('Usuário não está em nenhum canal')
      message.channel.send('É necessário está em um canal de voz')
      throw new Error('É necessário está em um canal de voz')
    }
    const guild = queue.getGuild()

    this.logger.info(`Entrando no canal: ${userVoiceChannel.name}`)
    const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    queue.setVoiceChannel(connection)
    queue.setStatus(StatusEnum.WAITING_MUSIC)

    return true
  }

  setQueue(queue: QueueService) {
    this.queue = queue
  }

  private getQueueOrThrow() {
    if (!this.queue) {
      throw new Error('Não possui queue')
    }
    return this.queue
  }
}

export default ChannelService
