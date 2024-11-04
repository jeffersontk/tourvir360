import { ApiProperty } from "@nestjs/swagger";
import { Media } from "src/media/entities/media.entity";
import { Scene } from "src/scene/entities/scene.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, OneToMany, OneToOne, PrimaryGeneratedColumn, Unique, UpdateDateColumn } from "typeorm";

@Entity()
@Unique('order', ['order'])
export class GroupScene {

    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    name: string;
    
    @ApiProperty()
    @Column({unique: true, nullable: true})
    @Generated('increment')
    order: number;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty()
    @OneToMany(() => Scene, scene => scene.groupScene)
    scenes: Scene[];

    @ApiProperty()
    @OneToOne(() => Media, media => media.groupScene)
    @JoinColumn()
    media: Media;
}