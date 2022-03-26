import { Type } from 'class-transformer';
import { IsNotEmpty, IsOptional, ValidateNested } from 'class-validator';
import { FileDto } from './file.dto';

export class MessageDto {
  @IsNotEmpty()
  message: string;

  @IsNotEmpty()
  user_id: number;

  @Type(() => FileDto)
  @IsOptional()
  @ValidateNested()
  file?: FileDto;
}
