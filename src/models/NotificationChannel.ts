import { Column, Default, Model, Table } from 'sequelize-typescript'
import { DataTypes } from 'sequelize'

@Table({ tableName: 'notification_channels' })
export class NotificationChannel extends Model {
  @Column({ primaryKey: true, autoIncrement: true, type: DataTypes.INTEGER })
    id!: number

  @Column({ type: DataTypes.STRING })
    user_id!: string

  @Column({ type: DataTypes.STRING })
    channel_id!: string

  @Column({ type: DataTypes.STRING })
    platform!: string

  @Column({ type: DataTypes.STRING })
    provider!: string

  @Column({ type: DataTypes.STRING })
    community!: string

  @Default(0)
  @Column({ type: DataTypes.INTEGER })
    error_counter!: number

  @Column({ type: DataTypes.STRING })
    last_error?: string
}
