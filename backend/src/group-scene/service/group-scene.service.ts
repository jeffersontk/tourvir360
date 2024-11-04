import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "src/media/entities/media.entity";
import { CreateSceneDto } from "src/scene/dtos/index";
import { Scene } from "src/scene/entities/scene.entity";
import { CreateSpotDto } from "src/spot/dtos";
import { Spot } from "src/spot/entities/spot.entity";
import { Repository } from "typeorm";
import { CreateGroupSceneDto, ReorderGroupSceneDto } from "../dtos/index";
import { GroupScene } from "../entities/group-scene.entity";


export class GroupSceneService {

    constructor(
        @InjectRepository(GroupScene) private readonly groupSceneRepository: Repository<GroupScene>,
        @InjectRepository(Scene) private readonly sceneRepository: Repository<Scene>,
        @InjectRepository(Spot) private readonly spotRepository: Repository<Spot>,
    ) { }

    async findAll() {
        return await this.groupSceneRepository.find({
            relations: ["scenes", "media", "scenes.spots", "scenes.spots.media", "scenes.media.groupScene"],
        });
    }

    async findOne(id: number) {
        const groupScene = await this.groupSceneRepository.findOne({
            where: { id: id },
            relations: ["scenes", "media", "scenes.spots", "scenes.spots.media", "scenes.media.groupScene"],
        });
        if (!groupScene) {
            throw new NotFoundException("GroupScene not found");
        }
        return groupScene;
    }

    async createGroupScene(input: CreateGroupSceneDto) {
        return await this.groupSceneRepository.save({
            ...input,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
    }

    async createSceneByGroupScene(id: number, input: CreateSceneDto) {
        const groupScene = await this.groupSceneRepository.findOneBy({ id });
        if (groupScene == null) {
            throw new NotFoundException("GroupScene not found");
        }
        const scene = await this.sceneRepository.save({
            ...input,
            groupScene: groupScene,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return scene;
    }

    async createSpotByGroupSceneByScene(idGroupScene: number, idScene: number, input: CreateSpotDto) {
        const groupScene = await this.groupSceneRepository.findOneBy({ id: idGroupScene });
        if (groupScene == null) {
            throw new NotFoundException("GroupScene not found");
        }
        const scene = await this.sceneRepository.findOneBy({ id: idScene });
        if (scene == null) {
            throw new NotFoundException("Scene not found");
        }
        const spot = await this.spotRepository.save({
            ...input,
            groupScene: groupScene,
            scene: scene,
            createdAt: new Date(),
            updatedAt: new Date(),
        })
        return spot;
    }

    async update(id: number, input: CreateGroupSceneDto) {
        const groupScene = await this.groupSceneRepository.findOneBy({ id });
        if (!groupScene) {
            throw new NotFoundException("GroupScene not found");
        }
        const data = await this.groupSceneRepository.save({
            ...groupScene,
            ...input,
            updatedAt: new Date(),
        });
        return data;
    }

    async delete(id: number) {
        const groupScene = await this.groupSceneRepository.findOneBy({ id });
        if (!groupScene) {
            throw new NotFoundException("GroupScene not found");
        }
        await this.groupSceneRepository.remove(groupScene);
        return true;
    }

    async groupSceneMediaUpdate(id: number, media: Media) {
        const groupScene = await this.groupSceneRepository.findOneBy({ id });
        if (!groupScene) {
            throw new NotFoundException("GroupScene not found");
        }
        groupScene.media = media;
        groupScene.updatedAt = new Date();
        const updatedGroupScene = await this.groupSceneRepository.save(groupScene);
        return updatedGroupScene;
    }

    // TODO: Remover o método abaixo, gerado um saveFile para todas as Entidades em media.service.ts
    // async saveFileGroupScene(file: Express.Multer.File, groupScene: GroupScene) {
    //     try {
    //         const media = new Media();
    //         media.name = file.filename;
    //         media.contentLength = file.size;
    //         media.type = file.mimetype;
    //         media.path = `${process.env.BASE_URL}/media/${file.filename}`;
    //         media.createdAt = new Date();
    //         media.updatedAt = new Date();
    //         media.groupScene = groupScene;
    //         const savedMedia = await this.mediaRepository.save(media);
    //         await this.groupSceneMediaUpdate(groupScene.id, savedMedia);
    //         return savedMedia;
    //     } catch (error) {
    //         throw new BadRequestException(error.message);
    //     }
    // }

    async reorderGroupScene(input: ReorderGroupSceneDto[]) {
        const groupScenes = [];
        for (const element of input) {
            const groupSceneErase = await this.groupSceneRepository.findOneBy({ id: element.id });
            if (!groupSceneErase) {
                throw new NotFoundException(`GroupScene with ID ${element.id} not found`);
            }
            groupSceneErase.order = null;
            await this.groupSceneRepository.save(groupSceneErase);
        }
        for (const element of input) {
            const groupScene = await this.groupSceneRepository.findOneBy({ id: element.id });
            groupScene.order = element.order;
            groupScene.updatedAt = new Date();
            groupScenes.push(groupScene);
        }
        const data = await this.groupSceneRepository.save(groupScenes);
        return data;
    }
    

}