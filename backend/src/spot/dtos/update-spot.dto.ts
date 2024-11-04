import { ApiProperty } from "@nestjs/swagger";

export class UpdateSpotDto {

    @ApiProperty()
    name: string;

    @ApiProperty()
    position_x: number;

    @ApiProperty()
    position_y: number;

    @ApiProperty()
    position_z: number;

    @ApiProperty()
    description: string;
}