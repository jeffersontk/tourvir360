// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import ormConfig from './config/orm.config';
import ormConfigProd from './config/orm.config.prod';
import { GroupSceneController } from './group-scene/group-scene.controller';
import { MediaController } from './media/media.controller';
import { SceneController } from './scene/scene.controller';
import { SpotController } from './spot/spot.controller';
import { GroupScene } from './group-scene/entities/group-scene.entity';
import { Scene } from './scene/entities/scene.entity';
import { Media } from './media/entities/media.entity';
import { Spot } from './spot/entities/spot.entity';
import { MediaService } from './media/service/media.service';
import { GroupSceneService } from './group-scene/service/group-scene.service';
import { SceneService } from './scene/service/scene.service';
import { SpotService } from './spot/service/spot.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [ormConfig],
      expandVariables: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory:
        process.env.NODE_ENV !== 'production' ? ormConfig : ormConfigProd,
    }),
    TypeOrmModule.forFeature([GroupScene, Scene, Media, Spot]),
  ],
  controllers: [AppController, GroupSceneController, SceneController, MediaController, SpotController],
  providers: [AppService, MediaService, GroupSceneService, SceneService, SpotService],
})
export class AppModule {}
