import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
  Type,
} from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: unknown, { metatype }: ArgumentMetadata) {
    if (value == null || !metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object: unknown = plainToInstance(metatype, value);
    const errors = await validate(object as Record<string, unknown>, {
      whitelist: true,
    });
    if (errors.length > 0) {
      throw new BadRequestException(
        errors.flatMap((e) => Object.values(e.constraints ?? {})),
      );
    }
    return object;
  }

  private toValidate(metatype: Type<unknown>): boolean {
    const primitives: unknown[] = [String, Boolean, Number, Array, Object];
    return !primitives.includes(metatype);
  }
}
