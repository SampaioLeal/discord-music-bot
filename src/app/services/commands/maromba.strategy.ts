import PlayStrategy from '@app/services/commands/play.strategy'
import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '@app/services/channel.service'

class MarombaStrategy extends AbstractCommand {
  private channelService = new ChannelService()

  async processMessage(message: Message) {
    this.channelService.setQueue(this.getQueue())
    this.channelService.joinChannel(message)
    const ff = new PlayStrategy()
    ff.setQueue(this.getQueue())
    this.getQueue().clearSongList()
    const logMessage = await ff.playMusic(
      'NOVE DA MATINA O DIA TA PRA COMEÇAR, VEM MONSTRO VEM MONSTRO',
      'https://www.youtube.com/watch?v=6L6-bim6qic&ab_channel=BondedaStronda',
      message.author
    )
    message.channel.send(logMessage)
  }
}
export default MarombaStrategy
