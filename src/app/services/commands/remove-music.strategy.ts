import AbstractCommandStrategy from '@app/services/commands/abstract-command.strategy'
import { Message } from 'discord.js'
import { Logger } from '@logger'

class RemoveMusicStrategy extends AbstractCommandStrategy {
  private logger = new Logger(RemoveMusicStrategy.name)

  async processMessage(message: Message) {
    const songIndex = this.getSongIndex(message.content)
    if (songIndex === null) {
      this.logger.error(`Index de música não permitido`)
      this.sendMessage('Index da música está inválida')
      return
    }
    this.logger.info(`Removendo musica [ ${songIndex} ] da lista`)
    const removedMusic = this.getQueue().getListSong().splice(songIndex, 1)
    this.logger.info(`Música [ ${removedMusic[0].name} ] removida com sucesso`)
    this.sendMessage(`Música [ ${removedMusic[0].name} ] removida da lista`)
  }

  private getSongIndex(text: string) {
    const page = text.split(' ')[1]
    const pageInt = parseInt(page) || -1
    return pageInt > 0 ? pageInt : null
  }
}

export default RemoveMusicStrategy
