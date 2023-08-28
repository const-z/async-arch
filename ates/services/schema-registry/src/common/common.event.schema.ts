import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export abstract class EventValidator {
  protected schema: TSchema;

  public validate(data: unknown) {
    const type = TypeCompiler.Compile(this.schema);
    const result = type.Check(data);

    return result;
  }

  public errors(data: unknown) {
    const type = TypeCompiler.Compile(this.schema);
    const result = [...type.Errors(data)];

    return result;
  }
}
