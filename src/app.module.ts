import { Module } from '@nestjs/common';
import { WebhookController } from './socure/socure.controller';
import { SocureService } from './socure/socure.service';
import { RequestController } from './socure/request.controller'; // Import the new controller

@Module({
  imports: [],
  controllers: [WebhookController, RequestController],
  providers: [SocureService],
})
export class AppModule {}
