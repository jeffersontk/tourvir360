import { Controller, Delete, Get, HttpCode, Param, Res } from '@nestjs/common';
import { ApiForbiddenResponse, ApiNotFoundResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MediaService } from './service/media.service';

@ApiTags('Files')
@Controller('files')
export class MediaController {

    constructor(
        private readonly mediaService: MediaService
    ) { }

    @Delete(':id')
    @HttpCode(204)
    @ApiNotFoundResponse({ description: 'Not found' })
    @ApiForbiddenResponse({ description: 'Forbidden' })
    @ApiOperation({ summary: 'Delete media by id' })
    async remove(@Param('id') id: number) {
        return await this.mediaService.delete(id);
    }

    @Get(':path')
    async getFile(@Param("path") image, @Res() res): Promise<any> {
        res.sendFile(image, { root: './upload/files' });
    }
}
