import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Message } from 'discord.js'

class BoundStrategy extends AbstractCommand {
  processMessage(message: Message): void {
    console.log(message.channel)
  }
}

export default BoundStrategy
