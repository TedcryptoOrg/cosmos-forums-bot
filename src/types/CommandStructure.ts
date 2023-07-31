import { type Platforms } from '../enums/Platforms'

export interface CommandStructure {
  command: string
  arguments: string[]
  platform: Platforms
  channelId?: string | null | undefined
  userId?: string | null | undefined
}
