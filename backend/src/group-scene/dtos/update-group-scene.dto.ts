import { ApiProperty } from "@nestjs/swagger";

export class UpdateGroupSceneDto {

    @ApiProperty()
    name: string;
}