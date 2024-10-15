import { BadRequestException as NestBadRequestException } from '@nestjs/common';

type BadRequestExceptionParams<Input extends object> = {
  field: keyof Input;
  message: string;
};

// * defining error object in this way allows us to precisely point out which field is incorrect
// * instead of general root error
export class BadRequestException<
  Type extends object,
> extends NestBadRequestException {
  constructor(params?: BadRequestExceptionParams<Type>) {
    super(
      params && {
        errors: {
          [params.field]: params.message,
        },
      },
    );
  }
}
