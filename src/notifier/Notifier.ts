import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import {NotifierProviderInterface} from "./NotifierProviderInterface";
import {database} from "../Database";

export class Notifier {
    private readonly providers: any;

    constructor(providers: NotifierProviderInterface[] = []) {
        this.providers = {};
        for (const provider of providers) {
            this.providers[provider.getClientName()] = provider;
        }
    }

    async notify(message: Message)
    {
        const users = await database.getAllNotificationChannels();
        for (const user of users) {
            const recipient: Recipient = {
                id: user.id,
                options: {
                    channel_id: user.channel_id
                }
            }

            await this.providers[user.platform].send(message, recipient);
        }
    }
}
