import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Guest } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
import { GuestAnalyticsDto } from './dto/guest-analytics.dto';
import { UpdateGuestDto } from './dto/update-guest.dto';

@Injectable()
export class GuestService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createGuestDto: CreateGuestDto,
    eventId: string,
    userId: string,
  ): Promise<Guest> {
    try {
      return await this.prisma.guest.create({
        data: {
          ...createGuestDto,
          eventId,
          userId,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to create guest');
    }
  }

  async findAll(eventId: string, userId: string): Promise<Guest[]> {
    const guests = await this.prisma.guest.findMany({
      where: { eventId, userId },
    });

    return guests;
  }

  async findOne(id: string, eventId: string, userId: string): Promise<Guest> {
    const guest = await this.prisma.guest.findFirst({
      where: { id, eventId, userId },
    });

    if (!guest) {
      throw new NotFoundException(`Guest with ID "${id}" not found`);
    }

    return guest;
  }

  async update(
    id: string,
    updateGuestDto: UpdateGuestDto,
    eventId: string,
    userId: string,
  ): Promise<Guest> {
    await this.findOne(id, eventId, userId);

    return this.prisma.guest.update({
      where: { id },
      data: {
        ...updateGuestDto,
      },
    });
  }

  async remove(id: string, eventId: string, userId: string): Promise<Guest> {
    await this.findOne(id, eventId, userId);

    return this.prisma.guest.delete({
      where: { id },
    });
  }

  async getAnalytics(
    eventId: string,
    userId: string,
  ): Promise<GuestAnalyticsDto> {
    const guests = await this.prisma.guest.findMany({
      where: { eventId, user: { id: userId } },
    });

    const total = guests.length;
    const accepted = guests.filter((g) => g.rsvpStatus === 'ACCEPTED').length;
    const declined = guests.filter((g) => g.rsvpStatus === 'DECLINED').length;
    const pending = guests.filter((g) => g.rsvpStatus === 'PENDING').length;
    const maybe = guests.filter((g) => g.rsvpStatus === 'MAYBE').length;

    return {
      total,
      accepted,
      declined,
      pending,
      maybe,
      acceptanceRate: total > 0 ? (accepted / total) * 100 : 0,
    };
  }
}
