import { CreateDateColumn } from "typeorm";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity("Appointment")
export class Appointment{
    @PrimaryGeneratedColumn("uuid")
    id: string;

    @Column({
        type: "uuid",
        nullable: false
    })
    userId: string;

    @Column({
        type: "uuid",
        nullable: false
    })
    doctorId: string;

    @Column({
        type: "date",
        nullable: false
    })
    slotDate: string;

    @Column({
        type: "time",
        nullable: false
    })
    slotTime: string;
    
    @Column({
        type: "jsonb",
        nullable: false
    })
    userData: object;

    @Column({
        type: "jsonb",
        nullable: false
    })
    doctorData: object;

    @Column({
        type: "decimal",
        precision: 10,
        scale: 2,
        nullable: false
    })
    amount: number;

    @Column({
        type: "bigint",
        nullable: false
    })
    date: number;

    @Column({
        type: "boolean",
        default: false
    })
    cancelled: boolean;

    @Column({
        type: "boolean",
        default: false
    })
    payment: boolean;

    @Column({
        type: "boolean",
        default: false
    })
    isCompleted: boolean;

    @CreateDateColumn({
        type: "timestamptz",
    })
    createdAt: Date;

    @CreateDateColumn({
        type: "timestamptz",
    })
    updatedAt: Date;
}