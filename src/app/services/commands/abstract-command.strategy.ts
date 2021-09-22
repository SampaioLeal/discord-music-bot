import { Message } from 'discord.js'
import QueueService from '@app/services/queue.service'
import { Null } from '@typings/generic.type'
import { makeCardMessage } from '@app/utils/card-messages.util'

abstract class AbstractCommandStrategy {
  abstract processMessage(message: Message): Promise<void>

  private queue: Null<QueueService> = null
  private message: Null<Message> = null

  protected getMessage() {
    if (!this.message) {
      throw new Error('Sem message setada')
    }
    return this.message
  }

  protected getQueue() {
    if (!this.queue) {
      throw new Error('Sem queue setada')
    }
    return this.queue
  }

  protected sendMessage(text: string) {
    const msg = makeCardMessage(text)
    this.getMessage().channel.send({ embeds: [msg] })
  }

  public setQueue(queue: QueueService) {
    this.queue = queue
  }

  public setMessage(message: Message) {
    this.message = message
  }
}

export default AbstractCommandStrategy
