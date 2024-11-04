import { ApiProperty } from "@nestjs/swagger";
import { GroupScene } from "src/group-scene/entities/group-scene.entity";
import { Scene } from "src/scene/entities/scene.entity";
import { Spot } from "src/spot/entities/spot.entity";

export class CreateMediaDto {

    @ApiProperty()
    groupScene: GroupScene;

    @ApiProperty()
    scene: Scene;

    @ApiProperty()
    spot: Spot;
}