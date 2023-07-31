import { type Platforms } from '../enums/Platforms'

export interface ClientInterface {
  start: () => Promise<void>
  getName: () => Platforms
}
