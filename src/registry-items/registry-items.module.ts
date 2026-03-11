import { Module } from '@nestjs/common';
import { RegistryItemsController } from './registry-items.controller';
import { RegistryItemsService } from './registry-items.service';

@Module({
  controllers: [RegistryItemsController],
  providers: [RegistryItemsService],
})
export class RegistryItemsModule {}
