import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'
import { makeCardNowPlaying } from '@utils/cardMessages'
import { Status } from '@enums/status'

class NowPlayingStrategy extends AbstractCommand {
  async processMessage(message: Message): Promise<void> {
    const status = this.getQueue().getStatus()
    if (status === Status.PLAYING) {
      const songData = this.getQueue().getCurrentSong()

      const logMessage = makeCardNowPlaying(songData)
      message.channel.send({ embeds: [logMessage] })
      return
    }
    message.channel.send('Nenhuma música tocando no momento')
  }
}

export default NowPlayingStrategy
