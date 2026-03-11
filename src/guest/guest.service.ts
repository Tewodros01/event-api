import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Guest } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateGuestDto } from './dto/create-guest.dto';
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
}
