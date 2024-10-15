import { ApiProperty } from '@nestjs/swagger';

type ErrorsMapped<Type extends object> = {
  [key in keyof Type]: string;
};

type ErrorsGeneral = {
  [key: string]: string;
  root: string;
};

export class ErrorOutput<Fields extends object = object> {
  @ApiProperty({
    description:
      'Error description where key is the invalid parameter and value is error description',
    example: {
      root: 'User not found',
    },
  })
  errors: Partial<ErrorsGeneral & ErrorsMapped<Fields>>;
}
