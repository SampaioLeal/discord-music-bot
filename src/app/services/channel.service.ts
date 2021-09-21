import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'
import { joinVoiceChannel } from '@discordjs/voice'
import { Logger } from '@logger'
import QueueService from '@app/services/queue.service'

class ChannelService {
  private logger = new Logger(ChannelService.name)
  private queue = QueueService.getInstance()

  joinChannel(message: Message) {
    if (this.queue.getStatus() !== StatusEnum.IDLE) {
      this.logger.warn('Já está em um canal')
      return
    }

    const userVoiceChannel = message.member?.voice.channel
    if (!userVoiceChannel) {
      this.logger.error('Usuário não está em nenhum canal')
      message.channel.send('É necessário está em um canal de voz')
      return
    }
    const guild = userVoiceChannel.guild

    this.logger.info(`Entrando no canal: ${userVoiceChannel.name}`)
    const connection = joinVoiceChannel({
      channelId: userVoiceChannel.id,
      guildId: guild.id,
      adapterCreator: guild.voiceAdapterCreator
    })

    this.queue.setVoiceChannel(connection)
    this.queue.setStatus(StatusEnum.WAITING_MUSIC)
  }
}

export default ChannelService
