import * as Discord from 'discord.js'
import { Logger } from '@logger'
import { ClientEvents } from 'discord.js'

class Client {
  private client: Discord.Client
  private logger = new Logger(Client.name)
  private botIsReady = false
  private readonly DISCORD_TOKEN = process.env.DISCORD_TOKEN as string

  constructor() {
    this.client = new Discord.Client({
      intents: [
        Discord.Intents.FLAGS.GUILDS,
        Discord.Intents.FLAGS.GUILD_MESSAGES,
        Discord.Intents.FLAGS.GUILD_VOICE_STATES
      ]
    })

    this.client.once('ready', () => {
      this.logger.log('Ready!')
    })

    this.client.once('reconnecting', () => {
      this.logger.log('Reconnecting!')
    })

    this.client.once('disconnect', () => {
      this.logger.log('Disconnect!')
    })

    this.client.on('debug', (error) => {
      this.logger.verbose(error)
    })
  }

  addEventOn<KEYS extends keyof Discord.ClientEvents>(
    event: KEYS,
    cb: (...args: ClientEvents[KEYS]) => void
  ) {
    this.client.on(event, cb)
  }

  getClient() {
    return this.client
  }

  isReady() {
    return this.botIsReady
  }

  login(cb?: () => void) {
    this.client.login(this.DISCORD_TOKEN).then((msg) => {
      this.logger.debug(msg)
      this.logger.info(`Bot logado com sucesso!!!`)
      this.botIsReady = true
      cb?.()
    })
  }
}

export default Client
