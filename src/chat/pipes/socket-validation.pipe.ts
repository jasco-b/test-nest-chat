import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class SocketValidationPipe implements PipeTransform<any> {
  async transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }

    if (metadata.type !== 'body') {
      return value;
    }

    console.log(value, metadata);

    let obj;

    if (typeof value === 'object' && value !== null) {
      obj = value;
    } else {
      obj = JSON.parse(value);
    }

    const object = plainToClass(metatype, obj);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new WsException(this.getErrorMessage(errors));
    }
    return object;
  }

  private toValidate(metatype: any): boolean {
    const types: any[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  private getErrorMessage(errors: ValidationError[]): string {
    const error = errors.shift();
    const messages = error.constraints;
    if (
      error.children &&
      Array.isArray(error.children) &&
      error.children.length > 0
    ) {
      return this.getErrorMessage(error.children);
    }
    return (
      messages[Object.keys(messages).shift()] ||
      'Validation error: ' + error.property
    );
  }
}
