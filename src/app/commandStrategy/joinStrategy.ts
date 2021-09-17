import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'
import { Logger } from '@logger'

class JoinStrategy extends AbstractCommand {
  logger = new Logger(JoinStrategy.name)

  async processMessage(message: Message) {
    this.logger.info('Acessando informações do canal')
    this.joinChannel(message)
  }
}

export default JoinStrategy
