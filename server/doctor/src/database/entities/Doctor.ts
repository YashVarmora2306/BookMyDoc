import { CreateDateColumn } from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Doctor")
export class Doctor{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    firstName: string;

    @Column({
        type: "varchar",
        length: 100,
        nullable: false,
    })
    lastName: string;

    @Column({
        type: "varchar",
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        type: "varchar",
        nullable: false,
        select: false,
    })
    password: string;

    @Column({
        type: "varchar",
    })
    profilePicture: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    specialist: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    degree: string;

    @Column({
        type: "varchar",
        length: 100
    })
    experience: string;

    @Column({
        type: "text",
    })
    about: string;

    @Column({
        type: "boolean",
        default: true
    })
    available: boolean;

    @Column({
        type: "numeric",
    })
    fees: number;

    @Column({
        type: "jsonb",
    })
    address: object;

    @Column({
        type: "jsonb",
        default: {}
    })
    slots_booked: object;

    @CreateDateColumn({
        type: "timestamptz",
    })
    createdAt: Date;

    @CreateDateColumn({
        type: "timestamptz",
    })
    updatedAt: Date;
}