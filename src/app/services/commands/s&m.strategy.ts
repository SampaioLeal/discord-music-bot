import PlayStrategy from './play.strategy'
import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import ChannelService from '../channel.service'

class SEMStrategy extends AbstractCommand {
  private channelService = new ChannelService()
  async processMessage(message: Message) {
    this.channelService.setQueue(this.getQueue())
    this.channelService.joinChannel(message)
    const ff = new PlayStrategy()
    ff.setQueue(this.getQueue())
    this.getQueue().clearSongList()
    const logMessage = await ff.playMusic(
      'Sampaio de todas as idades: :sob:',
      'https://www.youtube.com/watch?v=Z0XkhYzjg1g&ab_channel=DeizeTigrona',
      message.author
    )
    message.channel.send(logMessage)
  }
}

export default SEMStrategy
