import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
  @Get()
  async healthCheck() {
    return 'Payments webhook is running!!';
  }
}
