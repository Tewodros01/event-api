import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';
import { GuestModule } from './guest/guest.module';
import { PrismaModule } from './prisma/prisma.module';
import { RegistryItemsModule } from './registry-items/registry-items.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PrismaModule,
    AuthModule,
    EventsModule,
    GuestModule,
    RegistryItemsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
