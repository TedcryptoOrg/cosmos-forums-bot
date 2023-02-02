import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import {NotifierProviderInterface} from "./NotifierProviderInterface";

export class Notifier {
    private readonly providers: NotifierProviderInterface[] = [];

    constructor(providers: NotifierProviderInterface[] = []) {
        this.providers = providers;
    }

    async notify(message: Message, recipient: Recipient) {
        for (const provider of this.providers) {
            await provider.send(message, recipient);
        }
    }
}
