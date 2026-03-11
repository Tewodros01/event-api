import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Event } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateEventDto, userId: string): Promise<Event> {
    try {
      return await this.prisma.event.create({
        data: {
          ...dto,
          userId,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to create event');
    }
  }

  async findAll(userId: string): Promise<Event[]> {
    const events = await this.prisma.event.findMany({
      where: { userId },
    });
    return events;
  }

  async findOne(id: string, userId: string): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return event;
  }

  async update(
    id: string,
    dto: UpdateEventDto,
    userId: string,
  ): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string, userId: string): Promise<Event> {
    const event = await this.prisma.event.findFirst({
      where: { id, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found');
    }

    return this.prisma.event.delete({
      where: { id },
    });
  }
}
