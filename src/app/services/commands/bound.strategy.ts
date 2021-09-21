import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'

class BoundStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    console.log(message.channel)
  }
}

export default BoundStrategy
