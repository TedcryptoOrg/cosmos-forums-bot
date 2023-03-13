import {Message} from "../types/Message";
import {Recipient} from "../types/Recipient";
import {NotifierProviderInterface} from "./NotifierProviderInterface";
import {notificationChannelManager} from "../services/notification/NotificationChannelManager";

export class Notifier {
    private readonly providers: {[key: string]: NotifierProviderInterface[]};

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
        const notificationChannels = await notificationChannelManager.getAllNotificationChannelsForProviderAndCommunity(message.provider, message.community);
        console.log(`[Notifier] Sending message to ${notificationChannels.length} users.`)
        for (const notificationChannel of notificationChannels) {
            const recipient: Recipient = {
                id: notificationChannel.id,
                options: {
                    channel_id: notificationChannel.channel_id
                }
            }
            if (!this.providers.hasOwnProperty(notificationChannel.platform)) {
                console.log('[Notifier] No provider configured for platform "'+notificationChannel.platform+'". Skipping notification.');
                continue;
            }

            for (const provider of this.providers[notificationChannel.platform]) {
                try {
                    await provider.send(message, recipient);
                } catch (error) {
                    await notificationChannelManager.setError(notificationChannel, String(error))
                    console.error(error);
                }
            }
        }
    }
}
