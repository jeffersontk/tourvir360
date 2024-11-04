import { InjectRepository } from "@nestjs/typeorm";
import { Scene } from "../entities/scene.entity";
import { Repository } from "typeorm";
import { NotFoundException } from "@nestjs/common";
import { ReorderGroupSceneDto } from "src/group-scene/dtos";
import { Media } from "src/media/entities/media.entity";

export class SceneService {
    constructor(
        @InjectRepository (Scene) private readonly sceneRepository: Repository<Scene>,
    ) {}

    async findAll() {
        return await this.sceneRepository.find({
            relations: ["spots", "media"],
        });
    }

    async findById(id: number) {
        const scene = await this.sceneRepository.findOne({
            where: { id: id },
            relations: ["spots", "media"],
        })
        if (!scene) {
            throw new NotFoundException("Scene not found");
        }
        return scene;

    }

    async update(id: number, input: any) {
        const scene = await this.sceneRepository.findOneBy({ id });
        if (!scene) {
            throw new NotFoundException("Scene not found");
        }
        const data = await this.sceneRepository.save({
            ...scene,
            ...input,
            updatedAt: new Date(),
        });
        return data;
    }

    async delete(id: number) {
        const scene = await this.sceneRepository.findOneBy({ id });
        if (!scene) {
            throw new NotFoundException("Scene not found");
        }
        await this.sceneRepository.remove(scene);
        return true;
    }

    async reorderScene(input: ReorderGroupSceneDto[]) {
        const scenes = []
        for (const element of input) {
            const sceneErase = await this.sceneRepository.findOneBy({ id: element.id });
            if (!sceneErase) {
                throw new NotFoundException(`Scene with ID ${element.id} not found`);
            }
            sceneErase.order = null;
            await this.sceneRepository.save(sceneErase);
        }
        for (const element of input) {
            const scene = await this.sceneRepository.findOneBy({ id: element.id });
            scene.order = element.order;
            scene.updatedAt = new Date();
            scenes.push(scene);
        }
        const data = await this.sceneRepository.save(scenes);
        return data;
    }

    async sceneMediaUpdate(id: number, media: Media) {
        const scene = await this.sceneRepository.findOneBy({ id });
        if (!scene) {
            throw new NotFoundException("Scene not found");
        }
        scene.media = media;
        scene.updatedAt = new Date();
        const updatedScene = await this.sceneRepository.save(scene);
        return updatedScene;
    }
}