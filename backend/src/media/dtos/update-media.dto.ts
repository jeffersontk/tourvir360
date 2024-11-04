import { ApiProperty } from "@nestjs/swagger";

export class UpdateMediaDto {

    @ApiProperty()
    name: string;
    
    @ApiProperty()
    type: string;
    
    @ApiProperty()
    path: string;
}