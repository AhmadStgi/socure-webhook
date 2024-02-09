import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Headers,
  Req,
  Res,
} from '@nestjs/common';
import { SocureService } from './socure.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly socureService: SocureService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async handleWebhookEvent(
    @Body() eventPayload: any,
    @Headers('x-secret-key') secretKey: string,
    @Req() req: any,
    @Res() res: any,
  ): Promise<any> {
    try {
      const isHttpsRequest =
        req.secure || req.headers['x-forwarded-proto'] === 'https';
      if (!isHttpsRequest) {
        console.log('Only HTTPS requests are allowed');
        return res.status(403);
      }

      const isDuplicateEvent = await this.socureService.isDuplicateEvent(
        eventPayload.id,
      );

      if (isDuplicateEvent) {
        console.log('Duplicate event received. Already processed.');
        return res.status(403);
      }

      const allowedIPs = ['34.230.131.83', '34.199.1.104'];
      const clientIP = req.ip || req.connection.remoteAddress;

      if (!allowedIPs.includes(clientIP)) {
        console.log('Unauthorized IP address.');
        return res.status(400);
      }

      const isSecretKeyValid =
        await this.socureService.validateSecretKey(secretKey);

      if (!isSecretKeyValid) {
        console.log('Invalid secret key.');
      }

      await this.socureService.processEvent(eventPayload);

      return res.status(200);
    } catch (error) {
      console.error('Error processing Socure webhook event:', error);
      return { error: 'Internal server error.' };
    }
  }
}
