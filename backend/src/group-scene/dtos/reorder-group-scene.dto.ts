import { ApiProperty } from "@nestjs/swagger"

export class ReorderGroupSceneDto {

    @ApiProperty()
    id: number

    @ApiProperty()
    order: number
}