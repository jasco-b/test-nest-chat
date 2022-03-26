import { IsBase64, IsNotEmpty, IsOptional } from 'class-validator';

export class FileDto {
  @IsBase64({ message: 'file required' })
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  type: string;

  @IsNotEmpty()
  name: string;

  @IsOptional()
  extension?: string;

  getExtention(): string {
    if (!this.extension || this.extension.trim() === '') {
      return '';
    }

    return this.extension;
  }

  path: string;
}
