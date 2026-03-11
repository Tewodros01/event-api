import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateRegistryItemDto } from './dto/create-registry-item.dto';
import { UpdateRegistryItemDto } from './dto/update-registry-item.dto';
import { RegistryItemsService } from './registry-items.service';

@ApiTags('registry')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events/:eventId/registry')
export class RegistryItemsController {
  constructor(private readonly registryService: RegistryItemsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('eventId') eventId: string,
    @Body() createRegistryItemDto: CreateRegistryItemDto,
    @GetUser('sub') userId: string,
  ) {
    return this.registryService.create(createRegistryItemDto, eventId, userId);
  }

  @Get()
  findAll(@Param('eventId') eventId: string, @GetUser('sub') userId: string) {
    return this.registryService.findAll(eventId, userId);
  }

  @Get(':id')
  findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @GetUser('sub') userId: string,
  ) {
    return this.registryService.findOne(id, eventId, userId);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateRegistryItemDto: UpdateRegistryItemDto,
    @GetUser('sub') userId: string,
  ) {
    return this.registryService.update(id, updateRegistryItemDto, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string, @GetUser('sub') userId: string) {
    return this.registryService.remove(id, userId);
  }
}
