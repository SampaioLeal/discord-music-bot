import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { makeCardNowPlaying } from '@app/utils/card-messages.util'
import { StatusEnum } from '@app/enums/status.enum'

class NowPlayingStrategy extends AbstractCommand {
  async processMessage(message: Message): Promise<void> {
    const status = this.getQueue().getStatus()
    if (status === StatusEnum.PLAYING) {
      const songData = this.getQueue().getCurrentSong()

      const logMessage = makeCardNowPlaying(songData)
      message.channel.send({ embeds: [logMessage] })
      return
    }
    message.channel.send('Nenhuma música tocando no momento')
  }
}

export default NowPlayingStrategy
