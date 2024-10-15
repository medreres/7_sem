import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('technical')
@Controller()
export class AppController {
  @Get('/alive')
  @ApiOkResponse({ description: 'Indicates that server is running' })
  alive(): string {
    return 'alive';
  }
}
