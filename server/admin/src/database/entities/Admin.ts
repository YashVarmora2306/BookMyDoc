import { CreateDateColumn } from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Admin")
export class Admin{
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

    @CreateDateColumn({
        type: "timestamptz",
    })
    createdAt: Date;

    @CreateDateColumn({
        type: "timestamptz",
    })
    updatedAt: Date;
}