import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'

class ClearStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    this.getQueue().clearSongInQueue()
  }
}

export default ClearStrategy
