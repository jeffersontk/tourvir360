import { Body, Controller, Delete, Get, HttpCode, Param, Patch, Post, Put, UploadedFile, UseInterceptors } from '@nestjs/common';
import { GroupScene } from './entities/group-scene.entity';
import { ApiBadRequestResponse, ApiBody, ApiConsumes, ApiCreatedResponse, ApiForbiddenResponse, ApiNotFoundResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { CreateGroupSceneDto, ReorderGroupSceneDto, UpdateGroupSceneDto } from './dtos/index';
import { CreateSceneDto } from 'src/scene/dtos';
import { CreateSpotDto } from '../spot/dtos/index';
import { GroupSceneService } from './service/group-scene.service';
import { FileInterceptor } from '@nestjs/platform-express';
import multerConfig from 'src/config/multer.config';
import { MediaService } from 'src/media/service/media.service';


@ApiTags('GroupScene')
@Controller('group-scenes')
export class GroupSceneController {

    constructor(
        private readonly groupSceneService: GroupSceneService,
        private readonly mediaService: MediaService
    ) { }

    @Get()
    @ApiOkResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get all groupScenes' })
    async findAll() {
        const groupScenes = await this.groupSceneService.findAll();
        return { success: true, count: groupScenes.length, data: groupScenes };
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Get one groupScene by id' })
    @ApiParam({ name: 'id', type: Number })
    async findOne(@Param('id') id: number) {
        const groupScene = await this.groupSceneService.findOne(id);
        return { success: true, data: groupScene };
    }


    @Post()
    @ApiCreatedResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Create groupScene' })
    @ApiBody({ type: CreateGroupSceneDto })
    async create(@Body() input: CreateGroupSceneDto) {
        const groupScene = await this.groupSceneService.createGroupScene(input);
        return { success: true, data: groupScene };
    }

    @Post(":id/files")
    @UseInterceptors(FileInterceptor('file', multerConfig))
    @ApiOkResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiBadRequestResponse({ description: "Bad request" })
    @ApiConsumes('multipart/form-data')
    @ApiOperation({ summary: 'Upload file by groupScene' })
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
        const groupScene = await this.groupSceneService.findOne(id);
        const media = await this.mediaService.saveFile(file, groupScene);
        return { success: true, data: media };
    }

    @Post(':id/scenes')
    @ApiCreatedResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Create scene by groupScene' })
    @ApiBody({ type: CreateSceneDto })
    @ApiParam({ name: 'id', type: Number })
    async createSceneByGroupScene(@Param('id') id: number, @Body() input: CreateSceneDto) {
        const scene = await this.groupSceneService.createSceneByGroupScene(id, input);
        return { success: true, data: scene };
    }

    @Post(':idGroupScene/scenes/:idScene/spot')
    @ApiCreatedResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Create spot by groupScene and scene' })
    @ApiBody({ type: CreateSpotDto })
    async createSpotByScene(@Param('idGroupScene') idGroupScene: number,@Param('idScene') idScene: number, @Body() input: CreateSpotDto) {
        const spot = await this.groupSceneService.createSpotByGroupSceneByScene(idGroupScene, idScene, input);
        return { success: true, data: spot };
    }

    @Patch(':id')
    @ApiOkResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Update groupScene by id' })
    @ApiBody({ type: UpdateGroupSceneDto })
    @ApiParam({ name: 'id', type: Number })
    async update(@Param('id') id: number, @Body() input: UpdateGroupSceneDto) {
        const groupScene = await this.groupSceneService.update(id, input);
        return { success: true, data: groupScene };
    }

    @Put('reorder')
    @ApiOkResponse({ description: 'Success', type: GroupScene })
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Reorder groupScene' })
    @ApiBody({ type: ReorderGroupSceneDto })
    async reorderGroupScene(@Body() input: ReorderGroupSceneDto[]) {
        const groupScene = await this.groupSceneService.reorderGroupScene(input);
        return { success: true, data: groupScene };
    }


    @Delete(":id")
    @HttpCode(204)
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Delete groupScene by id' })
    async remove(@Param('id') id: number) {
        return await this.groupSceneService.delete(id);
    }
}

