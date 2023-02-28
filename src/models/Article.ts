import {Column, Model, Table} from "sequelize-typescript";

@Table({tableName: 'articles'})
export class Article extends Model {
    @Column({primaryKey: true, autoIncrement: true})
    id!: number;

    @Column
    title!: string;

    @Column
    url!: string;

    @Column
    provider!: string;

    @Column
    community!: string;
}