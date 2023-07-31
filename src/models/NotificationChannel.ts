import { Column, Default, Model, Table } from 'sequelize-typescript'

@Table({ tableName: 'notification_channels' })
export class NotificationChannel extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
    id!: number

  @Column
    user_id!: string

  @Column
    channel_id!: string

  @Column
    platform!: string

  @Column
    provider!: string

  @Column
    community!: string

  @Default(0)
  @Column
    error_counter!: number

  @Column
    last_error?: string
}
