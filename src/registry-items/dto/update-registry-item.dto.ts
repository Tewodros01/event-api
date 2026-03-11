import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistryItemDto } from './create-registry-item.dto';

export class UpdateRegistryItemDto extends PartialType(CreateRegistryItemDto) {}
