import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from '../entities/media.entity';
import { Scene } from 'src/scene/entities/scene.entity';
import { GroupScene } from 'src/group-scene/entities/group-scene.entity';
import { Spot } from 'src/spot/entities/spot.entity';
import { SceneService } from 'src/scene/service/scene.service';
import { GroupSceneService } from 'src/group-scene/service/group-scene.service';
import { SpotService } from 'src/spot/service/spot.service';
import { Repository } from 'typeorm';

@Injectable()
export class MediaService {
    constructor(
        @InjectRepository(Media) private mediaRepository: Repository<Media>,
        private readonly sceneService: SceneService,
        private readonly groupSceneService: GroupSceneService,
        private readonly spotService: SpotService,
    ) { }

    async findById(id: number) {
        const media = await this.mediaRepository.findOne({
            where: { id: id },
            relations: ["scene", "spot", "groupScene"],
        });
        if (!media) {
            throw new NotFoundException();
        }
        return media;
    }

    async delete(id: number) {
        const media = await this.mediaRepository.findOne({
            where: { id: id },
            relations: ["scene", "spot", "groupScene"],
        });
        if (!media) {
            throw new NotFoundException();
        }
        const relationsDelete = media.groupScene || media.scene || media.spot;
        switch (relationsDelete) {
            case media.groupScene:
                await this.groupSceneService.groupSceneMediaUpdate(media.groupScene.id, null);
                break;
            case media.scene:
                await this.sceneService.sceneMediaUpdate(media.scene.id, null);
                break;
            case media.spot:
                await this.spotService.spotMediaUpdate(media.spot.id, null);
                break;
            default:
                break;
        }
        await this.mediaRepository.remove(media);
        return true;
    }

    async saveFile(file: Express.Multer.File, entity: Scene | GroupScene | Spot) {
        try {
            const media = new Media();
            media.name = file.filename;
            media.contentLength = file.size;
            media.type = file.mimetype;
            media.path = `${process.env.BASE_URL}/files/${file.filename}`;
            media.createdAt = new Date();
            media.updatedAt = new Date();
            if (entity instanceof GroupScene) {
                media.groupScene = entity;
            } else if (entity instanceof Scene) {
                media.scene = entity;
            } else if (entity instanceof Spot) {
                media.spot = entity;
            }
            const savedMedia = await this.mediaRepository.save(media);
            await this.updateEntityRelations(entity, savedMedia);
            return savedMedia;
        } catch (error) {
            throw new BadRequestException(error.message);
        }
    }

    async updateEntityRelations(entity: Scene | GroupScene | Spot, media: Media) {
        if (entity instanceof GroupScene) {
            await this.groupSceneService.groupSceneMediaUpdate(entity.id, media);
        } else if (entity instanceof Scene) {
            await this.sceneService.sceneMediaUpdate(entity.id, media);
        } else if (entity instanceof Spot) {
            await this.spotService.spotMediaUpdate(entity.id, media);
        }
    }
}
