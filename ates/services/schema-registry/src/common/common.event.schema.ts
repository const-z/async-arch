import { TSchema } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';

export abstract class CommonEventSchema {
  protected schema: TSchema;

  public validate(data: unknown) {
    const type = TypeCompiler.Compile(this.schema);
    
    return type.Check(data);
  }
}
