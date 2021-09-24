import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { StatusEnum } from '@app/enums/status.enum'

class ResumeStrategy extends AbstractCommand {
  async processMessage() {
    if (this.getQueue().getStatus() === StatusEnum.MUSIC_PAUSED) {
      this.sendMessage('Voltando a tocar')
      this.getQueue().resume()
    }
  }
}

export default ResumeStrategy
