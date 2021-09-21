import { Message } from 'discord.js'
import { Logger } from '@logger'
import AbstractCommand from '@app/services/commands/abstract-command.strategy'
import { Undefined } from '@typings/generic.type'
import PlayStrategy from '@app/services/commands/play.strategy'
import JoinStrategy from '@app/services/commands/join.strategy'
import NowPlayingStrategy from '@app/services/commands/now-playing.strategy'
import ForceSkipStrategy from '@app/services/commands/force-skip.strategy'
import PauseStrategy from '@app/services/commands/pause.strategy'
import ResumeStrategy from '@app/services/commands/resume.strategy'
import DisconnectStrategy from '@app/services/commands/disconnect.strategy'
import QueueStrategy from '@app/services/commands/queue.strategy'
import ClearStrategy from '@app/services/commands/clear.strategy'
import BomDiaStrategy from '@app/services/commands/bom-dia.strategy'

class CommandsService {
  private logger = new Logger(CommandsService.name)
  private command: Undefined<AbstractCommand>
  private prefix = process.env.BOT_DEFAULT_PREFIX as string

  processMessage(message: Message) {
    const { content } = message
    this.logger.debug(`Message content: ${content}`)
    if (!this.isValidateMessage(message)) return
    const commandMessage = this.getCommand(message, this.prefix)
    this.command = this.getCommandOrUndefined(commandMessage)

    try {
      this.execute(message)
    } catch (e) {
      this.logger.error(`Um error foi disparado: ${e}`)
    }
  }

  private execute(message: Message) {
    if (this.command) {
      this.command.processMessage(message)
    }
  }

  private getCommand(message: Message, prefix: string) {
    const command = message.content.split(' ')[0].replace(prefix, '')
    this.logger.info(`Comando encontrado: ${command}`)
    return command
  }

  private containPrefix(text: string) {
    const containPrefix = text.startsWith(this.prefix)
    if (!containPrefix) this.logger.info('Mensagem não contem o prefixo')
    return containPrefix
  }

  private getCommandOrUndefined(command: string) {
    const commands: Record<string, AbstractCommand> = {
      play: new PlayStrategy(),
      p: new PlayStrategy(),
      join: new JoinStrategy(),
      np: new NowPlayingStrategy(),
      fs: new ForceSkipStrategy(),
      pause: new PauseStrategy(),
      resume: new ResumeStrategy(),
      dc: new DisconnectStrategy(),
      q: new QueueStrategy(),
      clear: new ClearStrategy(),
      bomDia: new BomDiaStrategy()
    }

    if (commands[command]) {
      this.logger.log(`Strategy [ ${command} ] encontrado`)
      return commands[command]
    }

    this.logger.warn(`Nenhum strategy encontrado!`)
    return undefined
  }

  private isValidateMessage(message: Message) {
    this.logger.info('Validando mensagem...')
    const validate: boolean[] = []

    validate.push(this.containPrefix(message.content))
    validate.push(this.messagefOUser(message))

    return validate.every(Boolean)
  }

  private messagefOUser(message: Message) {
    return !message.author.bot
  }
}

export default CommandsService
