import {NotificationChannel} from '../../models/NotificationChannel';

class NotificationChannelManager {
    async getNotificationChannel(channel_id: string, platform: string, provider: string, community: string): Promise<NotificationChannel | null> {
        return NotificationChannel.findOne({
            where: {
                channel_id: channel_id,
                platform: platform,
                provider: provider,
                community: community
            }
        });
    }

    async createNotificationChannel(user_id: string, channel_id: string, platform: string, provider: string, community: string) {
        await NotificationChannel.create({
            user_id: user_id,
            channel_id: channel_id,
            platform: platform,
            provider: provider,
            community: community
        });
    }

    async getAllNotificationChannelsForProviderAndCommunity(provider: string, community: string) {
        return await NotificationChannel.findAll({
            where: {
                provider: provider,
                community: community
            }
        });
    }
}

export const notificationChannelManager = new NotificationChannelManager();