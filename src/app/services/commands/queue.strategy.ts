import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { makeCardSongList } from '@app/utils/card-messages.util'

class QueueStrategy extends AbstractCommand {
  async processMessage(message: Message) {
    const songlist = [...this.getQueue().getListSong()]
    if (songlist.length) {
      const page = this.getPage(message.content)
      message.channel.send({
        embeds: [makeCardSongList(songlist, page)]
      })
    } else {
      this.sendMessage('Não há músicas')
    }
  }

  private getPage(text: string) {
    const page = text.split(' ')[1]
    const pageInt = parseInt(page) || 0
    return pageInt > 0 ? pageInt - 1 : 0
  }
}

export default QueueStrategy
