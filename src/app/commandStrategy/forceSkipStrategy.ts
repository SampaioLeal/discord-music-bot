import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'

class ForceSkipStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    const songList = this.getQueue().getListSong()
    if (songList.length > 1) {
      this.getQueue().skip()
      message.channel.send(':fast_forward: Próxima música :thumbsup:')
    }
  }
}

export default ForceSkipStrategy
