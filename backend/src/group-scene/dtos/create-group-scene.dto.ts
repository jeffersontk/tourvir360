import { ApiProperty } from "@nestjs/swagger";

export class CreateGroupSceneDto {

    @ApiProperty()
    name: string;
}