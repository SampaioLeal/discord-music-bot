import PlayStrategy from '@app/services/commands/play.strategy'
import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '@app/services/channel.service'

class BemTeViStrategy extends AbstractCommand {
  private channelService = new ChannelService()

  async processMessage(message: Message) {
    this.channelService.setQueue(this.getQueue())
    this.channelService.joinChannel(message)
    const ff = new PlayStrategy()
    ff.setQueue(this.getQueue())
    this.getQueue().clearSongList()
    const logMessage = await ff.playMusic(
      'Olha o bem-te-vi!',
      'https://www.youtube.com/watch?v=UA1AgGF8sLQ',
      message.author
    )

    message.channel.send(logMessage)
  }
}

export default BemTeViStrategy
