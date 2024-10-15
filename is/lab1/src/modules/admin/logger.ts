import { AdminModule } from '@adminjs/nestjs';
import { Logger } from '@nestjs/common';

export const logger = new Logger(AdminModule.name);
