import winston from 'winston'
import { format } from 'date-fns'

const { combine, timestamp, printf, colorize } = winston.format

const colors = {
  trace: 'magenta',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  debug: 'blue',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  error: 'red',
  yellow: 'yellow',
  blue: 'blue',
  green: 'green',
  red: 'red',
  grey: 'grey',
  gray: 'gray',
  cyan: 'cyan',
  black: 'black',
  white: 'white',
  magenta: 'magenta'
}

export class Logger {
  private logger: winston.Logger
  private readonly formatPadLogger = false

  constructor() {
    this.logger = winston.createLogger({
      transports: [
        new winston.transports.Console({
          level: process.env.LOGGER_LEVEL || 'debug',
          format: combine(timestamp(), this.consoleFormat())
        })
      ],
      exitOnError: false
    })
  }

  private consoleFormat() {
    return printf(({ level, message, timestamp }) => {
      const tempLevel = level as keyof typeof colors
      const formatTime = format(new Date(timestamp), 'dd/MM/yyyy HH:mm:ss')
      const buildMessage: string[] = []
      buildMessage.push(this.formatText('grey', formatTime, 0))
      buildMessage.push(this.formatText(tempLevel, tempLevel, 5))
      buildMessage.push('::')
      buildMessage.push(`${this.formatText(tempLevel, message, 0)}`)
      return buildMessage.join(' ')
    })
  }

  private formatText(
    color: keyof typeof colors,
    message: string,
    pad: number
  ): string {
    const colorizer = colorize({ colors }).colorize
    return colorizer(color, this.addPad(message, pad))
  }

  private addPad(text: string, pad: number): string {
    if (pad) {
      if (!this.formatPadLogger) return this.addBracket(text)
      const spacePad = new Array(pad + 1).join(' ')
      const nPad = -1 * pad
      return this.addBracket((spacePad + text).slice(nPad))
    }
    return text
  }

  private addBracket(text: string) {
    return `[ ${text} ]`
  }

  debug(message: unknown): void {
    this.logger.debug(message)
  }

  error(message: unknown, stack?: unknown): void {
    this.logger.error(message)
    if (stack) this.logger.error(stack)
  }

  verbose(message: unknown): void {
    this.logger.verbose(message)
  }

  warn(message: unknown): void {
    this.logger.warn(message)
  }

  info(message: unknown): void {
    this.logger.info(message)
  }

  log(msg: unknown): void {
    this.info(msg)
  }
}
