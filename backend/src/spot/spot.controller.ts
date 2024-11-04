import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { Spot } from './entities/spot.entity';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateSpotDto } from './dtos/index';
import { SpotService } from './service/spot.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/config/multer.config';
import { MediaService } from 'src/media/service/media.service';

@ApiTags('Spot')
@Controller('spots')
export class SpotController {

    constructor(
        private readonly spotService: SpotService,
        private readonly mediaService: MediaService
    ) {}

    @Get()
    @ApiOkResponse({ description: 'Success', type: Spot })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get all spots' })
    async findAll() {
        const spots = await this.spotService.findAll();
        return { success: true, count: spots.length, data: spots };
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Success', type: Spot })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get all spots' })
    @ApiParam({ name: 'id', type: Number })
    async findById(@Param('id') id: number) {
        const spot = await this.spotService.findById(id);
        return { success: true, data: spot };
    }

    @Post(":id/files")
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @ApiOkResponse({ description: 'Success', type: Spot })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload file by Spot' })
    @ApiParam({ name: 'id', type: Number })
    @ApiBody({
        schema: {
            type: "object",
            properties: {
                file: {
                    type: 'string',
                    format: 'binary'
                },
            },
        },
    })
    async uploadMediaGroupSceneById(
        @Param('id') id: number,
        @UploadedFile() file: Express.Multer.File,
    ) {
        const spot = await this.spotService.findById(id);
        const media = await this.mediaService.saveFile(file, spot);
        return { success: true, data: media };
    }

    @Patch(':id')
    @ApiOkResponse({ description: 'Success', type: Spot })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Update a spot' })
    @ApiBody({ type: UpdateSpotDto })
    @ApiParam({ name: 'id', type: Number })
    async update(@Param('id') id: number, @Body() input: UpdateSpotDto) {
        const spot = await this.spotService.update(id, input);
        return { success: true, data: spot };
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Delete a spot' })
    async remove(@Param('id') id: number) {
        return await this.spotService.delete(id);
    }
}
