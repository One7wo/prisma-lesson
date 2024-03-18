import {Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, NotFoundException} from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { CreateArticleDto } from './dto/create-article.dto';
import { UpdateArticleDto } from './dto/update-article.dto';
import {ArticleEntity} from "./entities/article.entity";
import { ApiTags, ApiCreatedResponse, ApiOkResponse } from '@nestjs/swagger';

@Controller('articles')
@ApiTags('articles')
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  @ApiCreatedResponse({type: ArticleEntity})
  public async create(@Body() createArticleDto: CreateArticleDto) {
    return new ArticleEntity(await this.articlesService.create(createArticleDto));
  }

  @Get('drafts')
  @ApiOkResponse({type: ArticleEntity, isArray:  true})
  public async findDrafts() {
    const drafts = await this.articlesService.findDrafts();
    return drafts.map(draft => new ArticleEntity(draft));
  }

  @Get()
  @ApiOkResponse({type: ArticleEntity, isArray:  true})
  public async findAll() {
    const articles = await this.articlesService.findAll();
    return articles.map(article => new ArticleEntity(article));
  }

  @Get(':id')
  @ApiOkResponse({type: ArticleEntity})
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const article = new ArticleEntity(await this.articlesService.findOne(id));
    //TODO: починить обработку ошибки, не работет из-за автора
    if(!article) {
      throw new NotFoundException(`Article with ${id} does not exist.`)
    }
    return article;
  }

  @Patch(':id')
  @ApiOkResponse({type: ArticleEntity})
  public async update(@Param('id', ParseIntPipe) id: number, @Body() updateArticleDto: UpdateArticleDto) {
    return new ArticleEntity(await this.articlesService.update(id, updateArticleDto));
  }

  @Delete(':id')
  @ApiOkResponse({type: ArticleEntity})
  public async remove(@Param('id', ParseIntPipe) id: number) {
    return new ArticleEntity(await this.articlesService.remove(id));
  }
}
