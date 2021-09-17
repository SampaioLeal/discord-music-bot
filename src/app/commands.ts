import { Message } from 'discord.js'
import { Logger } from '@logger'
import AbstractCommand from '@app/commandStrategy/abstractCommand'
import { Undefined } from '@typings/genericTypes'
import PlayStrategy from '@app/commandStrategy/playStrategy'
import JoinStrategy from '@app/commandStrategy/joinStrategy'
import NowPlayingStrategy from '@app/commandStrategy/nowPlayingStrategy'
import ForceSkipStrategy from '@app/commandStrategy/forceSkipStrategy'
import PauseStrategy from '@app/commandStrategy/pauseStrategy'
import ResumeStrategy from '@app/commandStrategy/resumeStrategy'

class Commands {
  private logger = new Logger(Commands.name)
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
      resume: new ResumeStrategy()
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

export default Commands
