import AbstractCommandStrategy from '@app/services/commands/abstract-command.strategy'

class RepeatStrategy extends AbstractCommandStrategy {
  async processMessage() {
    this.getQueue().toggleRepeatMode()
    const msg = this.getQueue().getRepeatMode()
      ? 'Repetição ativada'
      : 'Repetição desativada'
    this.sendMessage(msg)
  }
}

export default RepeatStrategy
