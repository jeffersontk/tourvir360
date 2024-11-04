import { ApiProperty } from "@nestjs/swagger";

export class ReorderSceneDto {
    
    @ApiProperty()
    id: number;

    @ApiProperty()
    order: number;
}