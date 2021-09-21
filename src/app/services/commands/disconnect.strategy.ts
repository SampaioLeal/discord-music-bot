import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'

class DisconnectStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    this.getQueue().disconnectVoice()
    this.getQueue().setStatus(StatusEnum.IDLE)
  }
}

export default DisconnectStrategy
