import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GroupScene } from 'src/group-scene/entities/group-scene.entity';
import { Media } from 'src/media/entities/media.entity';
import { Scene } from 'src/scene/entities/scene.entity';
import { Spot } from 'src/spot/entities/spot.entity';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: 'postgres',
        host: '****.postgres.database.azure.com',
        port: 5432,
        username: '****',
        password: '****',
        database: 'postgres',
        entities: [Scene, GroupScene, Media, Spot],
        ssl: true,
        synchronize: true,
        logging: process.env.DATABASE_LOGGING === 'true',
    }),
);
