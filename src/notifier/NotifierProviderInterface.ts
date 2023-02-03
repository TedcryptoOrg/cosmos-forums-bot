import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import {Platforms} from "../enums/Platforms";

export interface NotifierProviderInterface {
    send(message: Message, recipient: Recipient): Promise<void>;
    getClientName(): Platforms;
}