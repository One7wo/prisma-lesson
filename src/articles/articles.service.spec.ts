import { Test, TestingModule } from '@nestjs/testing';
import { ArticlesService } from './articles.service';
import {PrismaService} from "../prisma/prisma.service";

describe('ArticlesService', () => {
  let service: ArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ArticlesService, PrismaService],
    }).compile();

    service = module.get<ArticlesService, ArticlesService>(ArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
