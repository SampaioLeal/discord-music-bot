import 'dotenv/config'
import './app/utils/module-alias.util'
import ClientService from '@app/services/client.service'
import CommandsService from '@app/services/commands.service'

const client = new ClientService()
const commands = new CommandsService()

process.on('unhandledRejection', (error) => {
  console.error('Unhandled promise rejection:', error)
})

client.login(() => {
  client.addEventOn('messageCreate', async (message) => {
    commands.processMessage(message)
  })
})
