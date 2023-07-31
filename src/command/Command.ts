import { type CommandStructure } from '../types/CommandStructure'
import { type CommandResult } from '../types/CommandResult'

export interface Command {
  name: string
  description: string
  usage?: string
  options?: undefined | Array<{ name: string, description: string, required: boolean }>

  run: (command: CommandStructure) => Promise<CommandResult>
}
