import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { RSVPStatus } from 'generated/prisma/client';

export class CreateGuestDto {
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @IsString()
  @IsNotEmpty()
  lastName!: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsOptional()
  @IsEnum(RSVPStatus)
  rsvpStatus?: RSVPStatus;
}
