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
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CreateGuestDto } from './dto/create-guest.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';
import { GuestService } from './guest.service';

@ApiTags('guests')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('events/:eventId/guests')
export class GuestController {
  constructor(private readonly guestService: GuestService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('eventId') eventId: string,
    @Body() createGuestDto: CreateGuestDto,
    @GetUser('sub') userId: string,
  ) {
    return this.guestService.create(createGuestDto, eventId, userId);
  }

  @Get()
  findAll(@Param('eventId') eventId: string, @GetUser('sub') userId: string) {
    return this.guestService.findAll(eventId, userId);
  }

  @Get(':id')
  findOne(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @GetUser('sub') userId: string,
  ) {
    return this.guestService.findOne(id, eventId, userId);
  }

  @Patch(':id')
  update(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @Body() updateGuestDto: UpdateGuestDto,
    @GetUser('sub') userId: string,
  ) {
    return this.guestService.update(id, updateGuestDto, eventId, userId);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('eventId') eventId: string,
    @Param('id') id: string,
    @GetUser('sub') userId: string,
  ) {
    return this.guestService.remove(id, eventId, userId);
  }

  @Get(':eventId/analytics')
  @ApiOperation({ summary: 'Get guest attendance analytics' })
  @ApiResponse({ status: 200, description: 'Analytics retrieved successfully' })
  getAnalytics(
    @Param('eventId') eventId: string,
    @GetUser('sub') userId: string,
  ) {
    return this.guestService.getAnalytics(eventId, userId);
  }
}
