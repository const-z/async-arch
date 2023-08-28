export enum TasksEventTopics {
  TasksStream = 'tasks.stream',
  Tasks = 'tasks',
}

export enum TaskStreamEventTypes {
  TASK_CREATED = 'TaskCreatedEvent',
  TASK_UPDATED = 'TaskUpdatedEvent',
}

export enum TaskBusinessEventTypes {
  TASK_ASSIGNED = 'TaskAssignedEvent',
  TASK_COMPLETED = 'TaskCompletedEvent',
}
