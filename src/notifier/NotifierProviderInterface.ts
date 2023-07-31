import { type Message } from '../types/Message'
import { type Recipient } from '../types/Recipient'
import { type Platforms } from '../enums/Platforms'

export interface NotifierProviderInterface {
  send: (message: Message, recipient: Recipient) => Promise<void>
  getClientName: () => Platforms
}
