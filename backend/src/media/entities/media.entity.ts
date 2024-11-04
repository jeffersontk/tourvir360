import { ApiProperty } from "@nestjs/swagger";
import { GroupScene } from "src/group-scene/entities/group-scene.entity";
import { Scene } from "src/scene/entities/scene.entity";
import { Spot } from "src/spot/entities/spot.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Media {

    @ApiProperty()
    @PrimaryGeneratedColumn('increment')
    id: number;

    @ApiProperty()
    @Column()
    name: string;

    @ApiProperty()
    @Column()
    type: string;

    @ApiProperty()
    @Column()
    contentLength: number;

    @ApiProperty()
    @Column()
    path: string;

    @ApiProperty()
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty()
    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => GroupScene, groupScene => groupScene.media, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    groupScene: GroupScene;

    @OneToOne(() => Scene, scene => scene.media, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    scene: Scene;

    @OneToOne(() => Spot, spot => spot.media, {
        onDelete: "CASCADE",
    })
    @JoinColumn()
    spot: Spot;
}