import { Repository } from "typeorm";
import { Spot } from "../entities/spot.entity";
import { NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Media } from "src/media/entities/media.entity";

export class SpotService {
    constructor(
        @InjectRepository (Spot) private readonly spotRepository: Repository<Spot>,
    )
    {}
    async findAll() {
        return await this.spotRepository.find({
            relations: ["media", "scene"],
        });
    }

    async findById(id: number) {
        const spot = await this.spotRepository.findOne({
            where: { id: id },
            relations: ["media", "scene"],
        })
        if (!spot) {
            throw new NotFoundException("Spot not found");
        }
        return spot;
    }

    async update(id: number, input: any) {
        const spot = await this.spotRepository.findOneBy({ id });
        if (!spot) {
            throw new NotFoundException("Spot not found");
        }
        const data = await this.spotRepository.save({
            ...spot,
            ...input,
            updatedAt: new Date(),
        });
        return data;
    }

    async delete(id: number) {
        const spot = await this.spotRepository.findOneBy({ id });
        if (!spot) {
            throw new NotFoundException("Spot not found");
        }
        await this.spotRepository.remove(spot);
        return true;
    }

    async spotMediaUpdate(id: number, media: Media) {
        const spot = await this.spotRepository.findOneBy({ id });
        if (!spot) {
            throw new NotFoundException("Spot not found");
        }
        spot.media = media;
        spot.updatedAt = new Date();
        const savedSpot = await this.spotRepository.save(spot);
        return savedSpot;
    }
}