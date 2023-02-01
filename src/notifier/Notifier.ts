import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import TelegramProvider from "./provider/TelegramProvider";
import {NotifierProviderInterface} from "./NotifierProviderInterface";

class Notifier {
    private providers: NotifierProviderInterface[] = [];

    constructor() {
        this.providers.push(new TelegramProvider());
    }

    async notify(message: Message, recipient: Recipient) {
        for (const provider of this.providers) {
            await provider.send(message, recipient);
        }
    }
}

export const notifier = new Notifier();
