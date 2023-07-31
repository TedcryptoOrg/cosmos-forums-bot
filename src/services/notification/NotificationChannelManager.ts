import { NotificationChannel } from '../../models/NotificationChannel'

class NotificationChannelManager {
  async getNotificationChannel (channel_id: string, platform: string, provider: string, community: string): Promise<NotificationChannel | null> {
    return await NotificationChannel.findOne({
      where: {
        channel_id,
        platform,
        provider,
        community
      }
    })
  }

  async createNotificationChannel (user_id: string, channel_id: string, platform: string, provider: string, community: string) {
    await NotificationChannel.create({
      user_id,
      channel_id,
      platform,
      provider,
      community
    })
  }

  async getAllNotificationChannelsForProviderAndCommunity (provider: string, community: string) {
    return await NotificationChannel.findAll({
      where: {
        provider,
        community
      }
    })
  }

  async setError (notificationChannel: NotificationChannel, error: string) {
    notificationChannel.error_counter = notificationChannel.error_counter + 1
    notificationChannel.last_error = error

    await notificationChannel.save()
  }
}

export const notificationChannelManager = new NotificationChannelManager()
