import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'

class ResumeStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    if (this.getQueue().getStatus() === StatusEnum.MUSIC_PAUSED) {
      message.channel.send('Voltando a tocar')
      this.getQueue().resume()
    }
  }
}

export default ResumeStrategy
