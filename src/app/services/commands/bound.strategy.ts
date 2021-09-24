import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'

class BoundStrategy extends AbstractCommand {
  // TODO: falta completar esse comando
  async processMessage(message: Message) {
    console.log(message.channel)
  }
}

export default BoundStrategy
