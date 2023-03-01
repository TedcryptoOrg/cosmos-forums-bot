import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import {NotifierProviderInterface} from "./NotifierProviderInterface";
import {notificationChannelManager} from "../services/notification/NotificationChannelManager";

export class Notifier {
    private readonly providers: any;

    constructor(providers: NotifierProviderInterface[] = []) {
        this.providers = {};
        for (const provider of providers) {
            if (!this.providers.hasOwnProperty(provider.getClientName())) {
                this.providers[provider.getClientName()] = [];
            }

            this.providers[provider.getClientName()].push(provider);
        }
    }

    async notify(message: Message)
    {
        if (Object.keys(this.providers).length === 0) {
            console.log('[Notifier] No providers configured. Skipping notification.');
            return;
        }

        // Send to all users
        const users = await notificationChannelManager.getAllNotificationChannelsForProviderAndCommunity(message.provider, message.community);
        console.log(`[Notifier] Sending message to ${users.length} users.`)
        for (const user of users) {
            const recipient: Recipient = {
                id: user.id,
                options: {
                    channel_id: user.channel_id
                }
            }
            if (!this.providers.hasOwnProperty(user.platform)) {
                console.log('[Notifier] No provider configured for platform "'+user.platform+'". Skipping notification.');
                continue;
            }

            for (const provider of this.providers[user.platform]) {
                try {
                    await provider.send(message, recipient);
                } catch (error) {
                    console.error(error);
                }
            }
        }
    }
}
