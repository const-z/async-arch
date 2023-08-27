import { TaskCreatedSchemaV1 } from './tasks/TaskCreatedEvent/v1';

const result = new TaskCreatedSchemaV1().validate({ asd: 1 });

console.log(result);
console.log(typeof result);
