import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'
import { Status } from '@enums/status'

class ResumeStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    if (this.getQueue().getStatus() === Status.MUSIC_PAUSED) {
      message.channel.send('Voltando a tocar')
      this.getQueue().resume()
    }
  }
}

export default ResumeStrategy
