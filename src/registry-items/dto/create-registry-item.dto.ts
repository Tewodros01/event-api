import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { GiftStatus } from 'generated/prisma/client';

export class CreateRegistryItemDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @IsEnum(GiftStatus)
  status?: GiftStatus;
}
