import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class ConfirmDeliveryDto {
  @IsDateString()
  @IsNotEmpty({ message: 'Delivery date is required' })
  deliveryDate!: string;

  @IsString()
  @IsOptional()
  notes?: string;
}
