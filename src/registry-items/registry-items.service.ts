import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { RegistryItem } from 'generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRegistryItemDto } from './dto/create-registry-item.dto';
import { UpdateRegistryItemDto } from './dto/update-registry-item.dto';

@Injectable()
export class RegistryItemsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    dto: CreateRegistryItemDto,
    eventId: string,
    userId: string,
  ): Promise<RegistryItem> {
    const event = await this.prisma.event.findFirst({
      where: { id: eventId, userId },
    });

    if (!event) {
      throw new NotFoundException('Event not found or unauthorized');
    }

    try {
      return await this.prisma.registryItem.create({
        data: {
          ...dto,
          eventId,
        },
      });
    } catch {
      throw new InternalServerErrorException('Failed to create registry item');
    }
  }

  async findAll(eventId: string, userId: string): Promise<RegistryItem[]> {
    const items = await this.prisma.registryItem.findMany({
      where: {
        eventId,
        event: { userId },
      },
    });
    return items;
  }

  async update(
    id: string,
    dto: UpdateRegistryItemDto,
    userId: string,
  ): Promise<RegistryItem> {
    const item = await this.prisma.registryItem.findFirst({
      where: { id, event: { userId } },
    });

    if (!item) {
      throw new NotFoundException('Registry item not found');
    }

    return this.prisma.registryItem.update({
      where: { id },
      data: dto,
    });
  }

  async findOne(
    id: string,
    eventId: string,
    userId: string,
  ): Promise<RegistryItem> {
    const item = await this.prisma.registryItem.findFirst({
      where: { id, eventId, event: { userId } },
    });

    if (!item) {
      throw new NotFoundException('Registry item not found');
    }

    return item;
  }

  async remove(id: string, userId: string): Promise<RegistryItem> {
    const item = await this.prisma.registryItem.findFirst({
      where: { id, event: { userId } },
    });

    if (!item) {
      throw new NotFoundException('Registry item not found');
    }

    return this.prisma.registryItem.delete({
      where: { id },
    });
  }

  async confirmDelivery(id: string, userId: string): Promise<RegistryItem> {
    const item = await this.prisma.registryItem.findFirst({
      where: { id, event: { userId } },
    });

    if (!item) {
      throw new NotFoundException('Registry item not found');
    }

    if (item.status !== 'PURCHASED') {
      throw new BadRequestException(
        'Only purchased items can be marked as delivered',
      );
    }

    return this.prisma.registryItem.update({
      where: { id },
      data: { status: 'DELIVERED' },
    });
  }
}
