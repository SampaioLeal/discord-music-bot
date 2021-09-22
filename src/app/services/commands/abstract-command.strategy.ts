import { Message } from 'discord.js'
import QueueService from '@app/services/queue.service'
import { Null } from '@typings/generic.type'

abstract class AbstractCommandStrategy {
  abstract processMessage(message: Message): Promise<void>

  private queue: Null<QueueService> = null

  protected getQueue() {
    if (!this.queue) {
      throw new Error('Sem queue setada')
    }
    return this.queue
  }

  public setQueue(queue: QueueService) {
    this.queue = queue
  }
}

export default AbstractCommandStrategy
