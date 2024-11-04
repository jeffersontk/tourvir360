import { ApiProperty } from "@nestjs/swagger";
import { Media } from "src/media/entities/media.entity";
import { Scene } from "src/scene/entities/scene.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Spot {

    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column('float')
    position_x: number;

    @ApiProperty()
    @Column('float')
    position_y: number;

    @ApiProperty()
    @Column('float')
    position_z: number;

    @ApiProperty()
    @Column()
    description: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Scene, scene => scene.spots, {
        onDelete: "CASCADE",
    })
    scene: Scene;

    @ApiProperty()
    @Column()
    sceneId: number;

    @OneToOne(() => Media, media => media.spot)
    @JoinColumn()
    media: Media;
}