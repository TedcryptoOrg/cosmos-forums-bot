import { type Platforms } from '../enums/Platforms'

export interface CommandStructure {
  command: string
  arguments: string[]
  platform: Platforms
  channelId?: string | null | void
  userId?: string | null | void
}
