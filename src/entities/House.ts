import { Entity, Column, PrimaryGeneratedColumn, BaseEntity, CreateDateColumn, ManyToOne } from "typeorm";
import { User } from "./index";

@Entity()
export class House extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    name: string

    @Column({
        type: 'text',
        nullable: false,
    })
    description: string

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
    })
    address: string

    // @Column({
    //     type: 'point',
    //     nullable: false,
    // })
    // point: number

    @Column({
        type: 'char',
        nullable: false,
    })
    kind: string

    @Column({
        nullable: false,
    })
    roomCount: number

    @Column({
        nullable: false,
    })
    toiletCount: number

    @Column({
        nullable: false,
    })
    area: number

    @Column({
        nullable: false,
    })
    maxPeople: number

    @Column({
        type: 'char',
        nullable: false,
    })
    sex: string

    @Column({
        type: 'date',
        nullable: false,
    })
    startDate: Date

    @Column({
        type: 'date',
        nullable: false,
    })
    endDate: Date

    @Column({
        nullable: false,
    })
    ended: boolean

    @Column({
        nullable: true,
    })
    deposit: number

    @Column({
        nullable: false,
    })
    monthlyRent: number

    @CreateDateColumn()
    createdDate: Date

    @ManyToOne(() => User, (user: User) => user.houses)
    user: User
}