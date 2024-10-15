import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';

import { ContactUsInput } from './dto/contact-us.js';
import { SupportService } from './support.service.js';

import { UserGuard } from '../auth/guards/user.guard.js';
import { ErrorOutput } from '../common/dto/error.output.js';
import { SuccessOutput } from '../common/dto/sucess.output.js';

@UseGuards(UserGuard)
@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private readonly supportService: SupportService) {}

  @ApiOkResponse({
    description: 'Send contact us email',
    type: SuccessOutput,
  })
  @ApiInternalServerErrorResponse({
    description: 'Contact us email sending error',
    type: ErrorOutput,
  })
  @ApiForbiddenResponse({
    description: 'Error message',
    type: ErrorOutput,
  })
  @Post('contact-us')
  async contactUs(@Body() input: ContactUsInput): Promise<SuccessOutput> {
    const { name, message, email } = input;

    await this.supportService.sendContactUsEmail({ name, message, email });

    return { message: 'Email has been sended' };
  }
}
