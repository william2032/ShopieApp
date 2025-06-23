import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { CartsModule } from './carts/carts.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { ProductsController } from './products/products.controller';
import { ProductsModule } from './products/products.module';
import { MailerService } from './mailer/mailer.service';
import { AppMailerModule } from './mailer/mailer.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: '.env' }),
    AuthModule,
    PrismaModule,
    CartsModule,
    UsersModule,
    ProductsModule,
    AppMailerModule,
  ],
  controllers: [AppController, ProductsController],
  providers: [AppService, MailerService],
})
export class AppModule {}
