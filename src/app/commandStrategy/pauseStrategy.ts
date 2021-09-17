import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'
import { Status } from '@enums/status'

class PauseStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    if (this.getQueue().getStatus() === Status.PLAYING) {
      this.getQueue().pause()
      message.channel.send('Musica pausada')
    }
  }
}

export default PauseStrategy
