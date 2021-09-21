import { Message } from 'discord.js'
import QueueService from '@app/services/queue.service'

abstract class AbstractCommandStrategy {
  abstract processMessage(message: Message): Promise<void>

  private queue = QueueService.getInstance()

  protected getQueue = () => this.queue
}

export default AbstractCommandStrategy
