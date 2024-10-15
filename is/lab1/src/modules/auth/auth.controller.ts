import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Logger,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';

import { AuthService } from './auth.service.js';
import { ONE_YEAR_IN_MS } from './constants.js';
import { LoginInput } from './dto/login/input.dto.js';
import { LoginOutput } from './dto/login/output.dto.js';
import { RegisterUserInput } from './dto/register/input.dto.js';
import { ResetPasswordInput } from './dto/reset-password/input.dto.js';
import { SendResetPasswordCodeInput } from './dto/send-reset-password-code/input.dto.js';
import { VerifyResetPasswordCodeInput } from './dto/verify-reset-password-code/input.dto.js';
import { UserGuard } from './guards/user.guard.js';
import { ResetPasswordService } from './modules/reset-password/reset-password.service.js';

import { ErrorOutput } from '../common/dto/error.output.js';
import { SuccessOutput } from '../common/dto/sucess.output.js';
import { UserIdentity } from '../user/decorators/user-identity.decorator.js';
import { UserRole } from '../user/enums/user-status.enum.js';
import { User } from '../user/types/user.js';
import { UserService } from '../user/user.service.js';

@ApiTags('auth')
@Controller('/auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly resetPasswordService: ResetPasswordService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'User logged in successfully',
    type: LoginOutput,
  })
  @ApiNotFoundResponse({
    description: 'User is not found',
    type: ErrorOutput,
  })
  @Post('/login')
  async login(
    @Body() loginDto: LoginInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutput | ErrorOutput> {
    try {
      const { accessToken } = await this.authService.login(loginDto);

      this.attachAccessToken(res, accessToken);

      return { accessToken };
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND);
      this.logger.error('Error while authenticating', error);

      return {
        errors: {
          root: 'User not found',
        },
      };
    }
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/register')
  @ApiOkResponse({
    description: 'User is created successfully',
    type: LoginOutput,
  })
  @ApiNotFoundResponse({
    description: 'User already exists',
    type: ErrorOutput,
  })
  async register(
    @Body() dto: RegisterUserInput,
    @Res({ passthrough: true }) res: Response,
  ): Promise<LoginOutput | ErrorOutput> {
    try {
      // * to prevent registering user admin other way than from admin panel
      const { accessToken } = await this.authService.register({
        ...dto,
        role: UserRole.User,
      });

      this.attachAccessToken(res, accessToken);

      return { accessToken };
    } catch (error) {
      res.status(HttpStatus.NOT_FOUND);

      return { errors: { root: 'User already exists' } };
    }
  }

  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  @UseGuards(UserGuard)
  @ApiOkResponse({
    description: 'User is logged out successfully',
    type: SuccessOutput,
  })
  async logout(
    @Res({ passthrough: true }) res: Response,
    @UserIdentity() user: User,
  ): Promise<SuccessOutput> {
    res.cookie('accessToken', '');

    await this.userService.updateUserById({
      id: user.id,
      data: { deviceToken: undefined },
    });

    return { message: 'Logged out successfully' };
  }

  @Post('/send-reset-password-code')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Code is sent successfully',
    type: SuccessOutput,
  })
  @ApiNotFoundResponse({
    type: ErrorOutput,
  })
  async sendResetPasswordCode(
    @Body() input: SendResetPasswordCodeInput,
  ): Promise<SuccessOutput> {
    const user = await this.userService.getUserByEmail(input.email);

    // * we don't want to send email if user is not in our db, but do not inform user to prevent attacks
    if (user && user.isActive) {
      await this.resetPasswordService.sendResetPasswordCode(user);
    } else {
      this.logger.debug('User not found or is not active', { input });
    }

    return { message: 'Code has been sent successfully' };
  }

  @Post('/verify-reset-password-code')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Code is valid',
    type: SuccessOutput,
  })
  @ApiBadRequestResponse({
    description: 'Code is invalid',
    type: ErrorOutput,
  })
  async verifyResetPasswordCode(
    @Body() input: VerifyResetPasswordCodeInput,
  ): Promise<SuccessOutput> {
    await this.resetPasswordService.verifyResetPasswordCode(
      input.email,
      input.code,
    );

    return { message: 'Code is valid' };
  }

  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Password has been reset successfully',
    type: SuccessOutput,
  })
  @ApiBadRequestResponse({
    description: 'Code is invalid',
    type: ErrorOutput,
  })
  async resetPassword(
    @Body() input: ResetPasswordInput,
  ): Promise<SuccessOutput> {
    await this.authService.resetPasswordByCode(input);

    return { message: 'Password has been reset successfully' };
  }

  private attachAccessToken(response: Response, accessToken: string): void {
    response.cookie('accessToken', accessToken, {
      expires: new Date(Date.now() + ONE_YEAR_IN_MS),
    });
  }
}
