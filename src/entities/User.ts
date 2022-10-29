import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, CreateDateColumn, OneToMany } from 'typeorm';
import { House } from './index';

@Entity()
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({
        type: 'varchar',
        length: 10,
        nullable: false,
    })
    name: string

    @Column({
        type: 'varchar',
        length: 30,
        nullable: false,
        unique: true,
    })
    email: string

    @Column({
        type: 'varchar',
        length: 20,
        nullable: false,
    })
    password: string

    @Column({
        type: 'char',
        nullable: false
    })
    sex: string

    @Column({
        type: 'date',
        nullable: false,
    })
    birthday: Date

    @Column({
        type: 'varchar',
        length: 20,
        nullable: false,
    })
    phoneNumber: string

    @Column({
        type: 'text',
        nullable: true,
    })
    introduction: string

    @Column({
        type: 'varchar',
        nullable: false,
        default: 'uploads/images/profile/default_profile_image.jpeg',
    })
    profileImagePath: string

    @Column({
        type: 'varchar',
        nullable: false,
    })
    salt: string

    @CreateDateColumn()
    createdDate: Date

    @OneToMany(() => House, (house: House) => house.user)
    houses: House[]
}