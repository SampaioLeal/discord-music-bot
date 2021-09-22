import { Guild, Message } from 'discord.js'
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
import QueueService from '@app/services/queue.service'

class CommandsService {
  private static instance: CommandsService
  private logger = new Logger(CommandsService.name)
  private command: Undefined<AbstractCommand>
  private prefix = process.env.BOT_DEFAULT_PREFIX as string
  private message: Message
  private listQueue: Map<string, QueueService> = new Map<string, QueueService>()

  private constructor(message: Message) {
    this.message = message
  }

  public static getInstance(message: Message) {
    if (!CommandsService.instance) {
      CommandsService.instance = new CommandsService(message)
    }
    CommandsService.instance.message = message
    return CommandsService.instance
  }

  processMessage() {
    const message = this.message
    const { content } = message
    this.logger.debug(JSON.stringify(message))
    this.logger.info(`Conteudo da mensagem: ${content}`)
    if (!this.isValidateMessage()) return
    const commandMessage = this.getCommand(this.prefix)
    this.command = this.getStrategyOrUndefined(commandMessage)
    this.executeCommand()
  }

  private executeCommand() {
    if (this.command) {
      this.command.processMessage(this.message)
    }
  }

  private getCommand(prefix: string) {
    const command = this.message.content.split(' ')[0].replace(prefix, '')
    this.logger.info(`Comando encontrado: ${command}`)
    return command
  }

  private containPrefix(text: string) {
    const containPrefix = text.startsWith(this.prefix)
    if (!containPrefix) this.logger.info('Mensagem não contem o prefixo')
    return containPrefix
  }

  private getStrategyOrUndefined(command: string) {
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
    const strategy = commands[command]
    if (strategy) {
      this.logger.log(`Strategy [ ${command} ] encontrado`)
      strategy.setQueue(this.getQueueByGuild())
      return strategy
    }

    this.logger.warn(`Nenhum strategy encontrado!`)
    return undefined
  }

  private getQueueByGuild() {
    const guild = this.message.guild
    if (!guild) {
      throw new Error('Não uma guild vinculada a mensagem')
    }
    this.logger.debug(JSON.stringify(guild))
    this.logger.info(`buscando pela queue da guild: ${guild.name}`)

    return this.getOrCreateQueueByGuildId(guild)
  }

  private getOrCreateQueueByGuildId(guild: Guild) {
    const guildId = guild.id
    let queue = this.listQueue.get(guildId)
    if (!queue) {
      this.logger.info(
        `Nenhuma queue encontrada, criado uma nova com guildId: ${guildId}`
      )
      queue = new QueueService(guild)
      this.listQueue.set(guildId, queue)
    }
    return queue
  }

  private isValidateMessage() {
    const message = this.message
    this.logger.info('Validando mensagem...')
    const validate: boolean[] = []

    validate.push(this.containPrefix(message.content))
    validate.push(this.isMessageOfUser())

    return validate.every(Boolean)
  }

  private isMessageOfUser() {
    return !this.message.author.bot
  }
}

export default CommandsService
