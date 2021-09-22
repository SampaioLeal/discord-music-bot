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
    this.channelService.joinChannel(message)
  }
}

export default JoinStrategy
