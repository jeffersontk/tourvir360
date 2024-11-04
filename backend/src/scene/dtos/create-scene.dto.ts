import { ApiProperty } from "@nestjs/swagger";

export class CreateSceneDto {
    
    @ApiProperty()
    name: string;
}