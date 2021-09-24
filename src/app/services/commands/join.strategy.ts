import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { Logger } from '@logger'
import ChannelService from '@app/services/channel.service'

class JoinStrategy extends AbstractCommand {
  private logger = new Logger(JoinStrategy.name)
  private channelService = new ChannelService()

  async processMessage(message: Message) {
    this.logger.info('Acessando informações do canal')
    this.channelService.setQueue(this.getQueue())
    const isJoin = this.channelService.joinChannel(message)
    const channelName = message.member?.voice.channel?.name
    const msg = isJoin
      ? `Entrando no canal: ${channelName}`
      : `Já estou no canal: ${channelName}`
    this.sendMessage(msg)
  }
}

export default JoinStrategy
