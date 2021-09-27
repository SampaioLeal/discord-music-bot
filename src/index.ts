import 'dotenv/config'
import './app/utils/module-alias.util'
import ClientService from '@app/services/client.service'
import CommandsService from '@app/services/commands.service'
import { Logger } from '@logger'

const client = new ClientService()
const logger = new Logger('App')

process.on('unhandledRejection', (error: any) => {
  logger.error('Ocorreu um erro:', error.stack)
})

client.login(() => {
  client.addEventOn('messageCreate', async (message) => {
    const commands = CommandsService.getInstance(message)
    commands.processMessage()
  })
})
