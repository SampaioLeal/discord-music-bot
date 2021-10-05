import AbstractCommand from '@app/services/commands/abstract-command.strategy'

class ForceSkipStrategy extends AbstractCommand {
  async processMessage() {
    const songList = this.getQueue().getListSong()
    this.getQueue().skip()
    const msg =
      songList.length > 0
        ? `:fast_forward: Próxima música - ${this.getQueue().getCurrentSong().name} :thumbsup:`
        : 'Não há mais músicas!'
    this.sendMessage(msg)
  }
}

export default ForceSkipStrategy
