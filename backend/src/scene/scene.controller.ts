import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UploadedFile, UseInterceptors} from '@nestjs/common';
import { Scene } from './entities/scene.entity';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdateSceneDto, ReorderSceneDto } from './dtos/index';
import { SceneService } from './service/scene.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/config/multer.config';
import { MediaService } from 'src/media/service/media.service';

@ApiTags('Scene')
@Controller('scenes')
export class SceneController {

    constructor(
        private readonly sceneService: SceneService,
        private readonly mediaService: MediaService
    ) { }

    @Get()
    @ApiOkResponse({ description: 'Success', type: Scene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get all scenes' })
    async findAll() {
        const scenes = await this.sceneService.findAll();
        return { success: true, count: scenes.length, data: scenes };
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Success', type: Scene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get scene by id' })
    @ApiParam({ name: 'id', type: Number })
    async findOne(@Param('id') id: number) {
        const scene = await this.sceneService.findById(id);
        return { success: true, data: scene };
    }

    @Post(":id/files")
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @ApiOkResponse({ description: 'Success', type: Scene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload file by Scene' })
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
        const scene = await this.sceneService.findById(id);
        const media = await this.mediaService.saveFile(file, scene);
        return { success: true, data: media };
    }

    @Patch(':id')
    @ApiOkResponse({ description: 'Success', type: Scene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: UpdateSceneDto })
    @ApiOperation({ summary: 'Update a scene' })
    @ApiParam({ name: 'id', type: Number })
    async update(@Param('id') id: number, @Body() input: UpdateSceneDto) {
        const scene = await this.sceneService.update(id, input);
        return { success: true, data: scene };
    }

    @Put('reorder')
    @ApiOkResponse({ description: 'Success', type: Scene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBody({ type: ReorderSceneDto })
    @ApiOperation({ summary: 'Reorder a scene' })
    async reorderScene(@Body() input: ReorderSceneDto[]) {
        const scenes = await this.sceneService.reorderScene(input);
        return { success: true, data: scenes };
        
    }

    @Delete(":id")
    @HttpCode(204)
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Delete a scene' })
    async remove(@Param('id') id: number) {
        return await this.sceneService.delete(id);
    }

}
