import { Column, Model, Table } from 'sequelize-typescript'

@Table({ tableName: 'twitter_clients' })
export class TwitterClient extends Model {
  @Column({ primaryKey: true, autoIncrement: true })
    id!: number

  @Column
    name!: string

  @Column
    consumer_key!: string

  @Column
    consumer_secret!: string

  @Column
    access_token!: string

  @Column
    access_token_secret!: string

  @Column
    bearer_token!: string
}
