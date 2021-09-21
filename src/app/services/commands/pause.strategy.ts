import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { StatusEnum } from '@app/enums/status.enum'

class PauseStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    if (this.getQueue().getStatus() === StatusEnum.PLAYING) {
      this.getQueue().pause()
      message.channel.send('Musica pausada')
    }
  }
}

export default PauseStrategy
