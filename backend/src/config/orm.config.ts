import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { GroupScene } from 'src/group-scene/entities/group-scene.entity';
import { Media } from 'src/media/entities/media.entity';
import { Scene } from 'src/scene/entities/scene.entity';
import { Spot } from 'src/spot/entities/spot.entity';

export default registerAs(
    'orm.config',
    (): TypeOrmModuleOptions => ({
        type: process.env.DATABASE_TYPE as 'mysql' | 'postgres',
        host: process.env.DATABASE_HOST,
        port: +process.env.DATABASE_PORT,
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PASSWORD,
        database: process.env.DATABASE_NAME,
        entities: [Scene, GroupScene, Media, Spot],
        ssl: true,
        synchronize: true,
        logging: process.env.DATABASE_LOGGING === 'true',
    }),
);