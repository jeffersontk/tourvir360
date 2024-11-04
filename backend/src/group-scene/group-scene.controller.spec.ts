import { Test, TestingModule } from '@nestjs/testing';
import { GroupSceneController } from './group-scene.controller';

describe('GroupSceneController', () => {
  let controller: GroupSceneController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GroupSceneController],
    }).compile();

    controller = module.get<GroupSceneController>(GroupSceneController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
