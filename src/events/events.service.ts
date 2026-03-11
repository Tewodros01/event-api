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

  async findAll(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string,
  ): Promise<{ data: Event[]; total: number; page: number; limit: number }> {
    const skip = (page - 1) * limit;
    const where: any = { userId };

    if (status) {
      where.status = status;
    }

    const [events, total] = await Promise.all([
      this.prisma.event.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.event.count({ where }),
    ]);

    return { data: events, total, page, limit };
  }
}
