import { Sequelize } from 'sequelize-typescript'
import path from 'path'

// @ts-expect-error We dont have a type for this
export const sequelize = new Sequelize({
  dialect: process.env.DB_DIALECT,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  models: path.join(__dirname, '/models')
})
