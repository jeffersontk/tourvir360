import { ApiProperty } from "@nestjs/swagger";

export class UpdateSceneDto {

    @ApiProperty()
    name: string;
}