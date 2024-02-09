import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { SocureService } from './socure.service';

@Controller('generateRequest')
export class RequestController {
  constructor(private readonly socureService: SocureService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async generateSocureRequest(): Promise<any> {
    try {
      const socureApiResponse =
        await this.socureService.generateSocureRequest();
      return {
        url: socureApiResponse.url,
        eventId: socureApiResponse.eventId,
        referenceId: socureApiResponse.referenceId,
      };
    } catch (error) {
      console.error('Error generating Socure request:', error);
      return { error: 'Internal server error.' };
    }
  }
}
