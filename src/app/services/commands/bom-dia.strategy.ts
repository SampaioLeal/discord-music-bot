import PlayStrategy from '@app/services/commands/play.strategy'
import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '@app/services/channel.service'

class BomDiaStrategy extends AbstractCommand {
  private channelService = new ChannelService()

  async processMessage(message: Message) {
    this.channelService.joinChannel(message)
    const ff = new PlayStrategy()
    this.getQueue().clearSongList()
    const logMessage = await ff.playMusic(
      'Bom dia',
      'https://www.youtube.com/watch?v=OcPzYcanx38',
      message.author
    )

    message.channel.send(logMessage)
  }
}

export default BomDiaStrategy
