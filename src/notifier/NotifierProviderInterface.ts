import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";

export interface NotifierProviderInterface {
    send(message: Message, recipient: Recipient): Promise<void>;
}