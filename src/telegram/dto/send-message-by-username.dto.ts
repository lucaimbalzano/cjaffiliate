import { ApiProperty } from '@nestjs/swagger';
import { CreateTelegramDto } from './create-telegram.dto';
import { IsNotEmpty, IsString } from 'class-validator';

export class SendMessageByUsername extends CreateTelegramDto {
//   @ApiProperty({ example: `@Esperanza591` })
//   @IsString({ message: 'Username must be a string', always: true })
//   @IsNotEmpty({
//     message: '@Esperanza591',
//     always: true,
//   })
//   username?: string;

  @ApiProperty({ example: `Ciao! questo e un test non preoccuparti` })
  @IsString({ message: 'Message must be a string', always: true })
  @IsNotEmpty({
    message: 'It shouldnt be empty',
    always: true,
  })
  message: string;
}
