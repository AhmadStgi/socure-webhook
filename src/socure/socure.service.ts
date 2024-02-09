import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class SocureService {
  private readonly socureSecretKey = 'YgZ2G5jMPj61GNr24QJLm5TJAAIGHeaY21FHFtEs';

  async validateSecretKey(secretKey: string): Promise<boolean> {
    return secretKey === this.socureSecretKey;
  }

  async isDuplicateEvent(eventId: string): Promise<boolean> {
    console.log(eventId);
    return false;
  }

  async processEvent(eventPayload: any): Promise<void> {
    try {
      console.log('Processing Socure event:', eventPayload);
    } catch (error) {
      console.error('Error processing Socure webhook event:', error);
      throw error;
    }
  }

  async generateSocureRequest(): Promise<any> {
    try {
      const response = await axios.post(
        'https://service.socure.com/api/3.0/documents/request',
        {
          verificationLevel: 2,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `SocureApiKey b088d929-daaa-49bb-88bc-70a9cf61a8d7`,
          },
        },
      );

      return response.data.data;
    } catch (error) {
      console.error('Error generating Socure request:', error);
      throw error;
    }
  }
}
