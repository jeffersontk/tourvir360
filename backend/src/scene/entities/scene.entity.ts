import { ApiProperty } from "@nestjs/swagger";
import { GroupScene } from "src/group-scene/entities/group-scene.entity";
import { Media } from "src/media/entities/media.entity";
import { Spot } from "src/spot/entities/spot.entity";
import { Column, CreateDateColumn, Entity, Generated, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Scene {

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

    @ManyToOne(() => GroupScene, groupScene => groupScene.scenes, {
        onDelete: "CASCADE",})
    groupScene: GroupScene;

    @ApiProperty()
    @Column()
    groupSceneId: number;

    @OneToOne(() => Media, media => media.scene)
    @JoinColumn()
    media: Media;

    @OneToMany(() => Spot, spot => spot.scene)
    spots: Spot[];
}