export class Task {
    constructor(
        public id: string,
        public title: string,
        public description: string,
        public priority: TaskPriority,
        public status: TaskStatus,
        public userId: string,
        public createdAt: Date,
        public updatedAt?: Date,
    ) { }
}

export type TaskStatus = 'PENDING' | 'COMPLETED';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH';