import { Logger } from '@nestjs/common'

export class AppLogger {

  private static logger = new Logger('AI-Service')

  static log(message: string) {
    this.logger.log(message)
  }

  static error(message: string, trace?: any) {
    this.logger.error(message, trace)
  }

  static warn(message: string) {
    this.logger.warn(message)
  }

  static debug(message: string) {
    this.logger.debug(message)
  }

}
